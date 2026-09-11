from pydantic import BaseModel


class Sensor(BaseModel):
    id: str
    timestamp: float
    name: str
    value: float
    unit: str


class CreateSensor(BaseModel):
    name: str
    value: float = .0
    unit: str


class UpdateSensor(BaseModel):
    value: float