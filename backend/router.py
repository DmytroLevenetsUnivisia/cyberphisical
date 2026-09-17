from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import NewSensor, UpdateSensor
from service import get_all_sensors, get_one_sensor, update_sensor, delete_sensor, create_sensor

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello, World!"}


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/sensors")
def function(db: Session = Depends(get_db)):
    return get_all_sensors(db)


@router.get("/sensors/{sensor_id}")
async def function(sensor_id: int, db: Session = Depends(get_db)):
    return get_one_sensor(sensor_id, db)


@router.post("/sensors")
async def function(new_sensor: NewSensor, db: Session = Depends(get_db)):
    return create_sensor(new_sensor, db)


@router.patch("/sensors/{sensor_id}")
async def function(sensor_id: int, new_value: UpdateSensor, db: Session = Depends(get_db)):
    return update_sensor(sensor_id, new_value, db)


@router.delete("/sensors/{sensor_id}")
async def function(sensor_id: int, db: Session = Depends(get_db)):
    return delete_sensor(sensor_id, db)
