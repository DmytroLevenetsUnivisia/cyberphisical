import time

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from schemas import NewSensor, UpdateSensor
from models import Sensor, Measurement


def get_all_sensors(db: Session):
    stmt = select(Sensor).options(selectinload(Sensor.measurement).load_only(Measurement.timestamp, Measurement.value))
    return db.scalars(stmt).all()


def get_one_sensor(sensor_id: int, db: Session):
    stmt = (
        select(Sensor)
        .where(Sensor.id == sensor_id)
        .options(selectinload(Sensor.measurement)
                 .load_only(Measurement.timestamp, Measurement.value))
    )
    sensor = db.scalars(stmt).first()
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return sensor


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


def create_sensor(new_sensor: NewSensor, db: Session):
    sensor = Sensor(name=new_sensor.name, unit=new_sensor.unit)
    db.add(sensor)
    db.commit()
    db.refresh(sensor)

    if new_sensor.value:
        measurement = Measurement(sensor_id=sensor.id, value=new_sensor.value, )
        db.add(measurement)

    db.commit()
    db.refresh(sensor)

    return get_one_sensor(sensor.id, db)


def update_sensor(sensor_id: int, measurement: UpdateSensor, db: Session):
    sensor = db.get(Sensor, sensor_id)
    if not sensor:
        return HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    measurement = Measurement(sensor_id=sensor.id, value=measurement.value, )
    db.add(measurement)
    db.commit()

    return get_one_sensor(sensor.id, db)


def delete_sensor(sensor_id: int, db: Session):
    sensor = db.get(Sensor, sensor_id)
    if not sensor:
        return HTTPException(
            status_code=404,
            detail="Sensor not found"
        )
    db.delete(sensor)
    db.commit()

    return {"message": "Sensor deleted"}
