from pydantic import BaseModel


class Reading(BaseModel):
    timestamp: float
    value: float


class Sensor(BaseModel):
    id: str
    name: str
    readings: list[Reading]
    unit: str


class NewSensor(BaseModel):
    name: str
    value: float| None
    unit: str


class UpdateSensor(BaseModel):
    value: float