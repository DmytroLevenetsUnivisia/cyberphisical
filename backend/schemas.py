import time

from pydantic import BaseModel


class Reading(BaseModel):
    id: float
    value: float


class Sensor(BaseModel):
    id: str
    name: str
    readings: list[Reading]
    unit: str


class NewSensor(BaseModel):
    name: str
    value: float | int | None
    unit: str


class UpdateSensor(BaseModel):
    value: float | int
    timestamp: float | int | None = None
