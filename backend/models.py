from pydantic import BaseModel


class Reading(BaseModel):
    timestamp: float
    value: float


class Sensor(BaseModel):
    id: str
    name: str
    readings: list[Reading]
    unit: str


class CreateSensor(BaseModel):
    name: str
    value: float = .0
    unit: str


class UpdateSensor(BaseModel):
    value: float