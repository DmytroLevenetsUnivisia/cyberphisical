import time

from fastapi import HTTPException
from sqlalchemy import select, func, and_
from sqlalchemy.orm import Session

from schemas import NewSensor, UpdateSensor
from models import Sensor, Measurement
from config import settings


def get_all_sensors(db: Session):
    latest = (
        select(
            Measurement.sensor_id,
            func.max(Measurement.id).label("measurement_id"),
        )
        .group_by(Measurement.sensor_id)
        .subquery()
    )
    stmt = (
        select(Sensor, Measurement)
        .outerjoin(
            latest,
            (latest.c.sensor_id == Sensor.id),
        )
        .outerjoin(Measurement, Measurement.id == latest.c.measurement_id)
    )
    sensors = []
    for sensor, measurement in db.execute(stmt):
        sensor.measurement = [measurement]
        sensors.append(sensor)
    return sensors


def get_one_sensor(sensor_id: int, db: Session):
    stmt = (
        select(Sensor)
        .where(Sensor.id == sensor_id)
    )
    sensor = db.scalars(stmt).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return sensor


def get_all_measurements(sensor_id: int, db: Session):
    stmt = (
        select(Measurement)
        .where(Measurement.sensor_id == sensor_id)
    )
    measurements = db.scalars(stmt).all()
    if not measurements:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return measurements


def get_last_measurement(sensor_id: int, db: Session):
    stmt = (
        select(Measurement)
        .where(Measurement.sensor_id == sensor_id)
        .order_by(Measurement.timestamp.desc())
    )
    measurement = db.scalars(stmt).first()
    if not measurement:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return measurement


def get_hot_water_alert(sensor_id: int, last_checked_id: int, db: Session):
    previous_value = (
        select(Measurement.value)
        .where(Measurement.id == last_checked_id)
        .scalar_subquery()
    )
    stmt = (
        select(
            Measurement,
            and_(previous_value <= settings.hot_water_threshold_Celsius,
                 Measurement.value > settings.hot_water_threshold_Celsius).label("heated"),
            and_(previous_value > settings.hot_water_threshold_Celsius,
                 Measurement.value <= settings.hot_water_threshold_Celsius).label("cooled"),
        )
        .where(Measurement.sensor_id == sensor_id)
        .order_by(Measurement.timestamp.desc())
    )
    row = db.execute(stmt).first()
    if not row:
        raise HTTPException(status_code=404, detail="Measurement not found")
    measurement, heated, cooled = row
    if heated:
        return measurement.id, {"message": "вода нагрілась", "value": measurement.value, "timestamp": measurement.timestamp}
    if cooled:
        return measurement.id, {"message": "вода охолола", "value": measurement.value, "timestamp": measurement.timestamp}
    return measurement.id, None


def create_sensor(new_sensor: NewSensor, db: Session):
    sensor = Sensor(name=new_sensor.name, unit=new_sensor.unit)
    db.add(sensor)
    db.commit()
    db.refresh(sensor)

    if new_sensor.value:
        measurement = Measurement(sensor_id=sensor.id, value=new_sensor.value,
                                  timestamp=new_sensor.timestamp or int(time.time()))
        db.add(measurement)

    db.commit()
    db.refresh(sensor)

    return get_one_sensor(sensor.id, db)


def update_sensor(sensor_id: int, measurement: UpdateSensor, db: Session):
    sensor = db.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    measurement = Measurement(sensor_id=sensor.id, value=measurement.value,
                              timestamp=measurement.timestamp or int(time.time()))
    db.add(measurement)
    db.commit()

    return get_one_sensor(sensor.id, db)


def delete_sensor(sensor_id: int, db: Session):
    sensor = db.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    db.delete(sensor)
    db.commit()

    return {"message": "Sensor deleted"}
