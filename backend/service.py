import time
import os, dotenv
from sqlalchemy import create_engine
from uuid import uuid4

from models import Sensor, Reading

# dotenv.load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")
# engine = create_engine(DATABASE_URL)

sensors: list[Sensor] = []


def create_sensor(name: str, value: float, unit: str):
    sensor = Sensor(
        id=uuid4().hex,
        name=name,
        readings=[Reading(value=value, timestamp=int(time.time()))],
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
    sensor.readings.append(Reading(value=value, timestamp=int(time.time())))

    return sensor


def delete_sensor(id: str):
    sensor = get_sensor(id)
    sensors.remove(sensor)

    return sensor
