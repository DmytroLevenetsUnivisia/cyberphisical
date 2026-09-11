import time
from uuid import uuid4

from backend.models import Sensor

sensors: list[Sensor] = []


def create_sensor(name: str, value: float, unit: str):
    sensor = Sensor(
        id=uuid4().hex,
        timestamp=int(time.time()),
        name=name,
        value=value,
        unit=unit
    )
    sensors.append(sensor)

    return sensor


def get_sensor(id: str) -> Sensor | None:
    for sensor in sensors:
        if sensor.id == id:
            return sensor

    raise Exception(f"Sensor with id {id} not found")


def get_all_sensors() -> list[Sensor]:
    return sensors


def update_sensor(id: str, value: float):
    sensor = get_sensor(id)
    sensor.timestamp = time.time()
    sensor.value = value

    return sensor


def delete_sensor(id: str):
    sensor = get_sensor(id)
    sensors.remove(sensor)

    return sensor
