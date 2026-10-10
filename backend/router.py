import asyncio

from starlette.requests import Request
from fastapi import APIRouter, Depends
from fastapi.sse import EventSourceResponse
from sqlalchemy.orm import Session

from database import get_db
from schemas import NewSensor, UpdateSensor
from service import get_all_sensors, get_one_sensor, update_sensor, delete_sensor, create_sensor, get_last_measurement

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


@router.get("/sensors/{sensor_id}/stream/last_measurement", response_class=EventSourceResponse)
async def function(request: Request, sensor_id: int, db: Session = Depends(get_db)):
    while not await request.is_disconnected():
        last_sent_id = None
        last_measurement = get_last_measurement(sensor_id, db)
        if last_measurement.id != last_sent_id:
            last_sent_id = last_measurement.id
            yield last_measurement
        await asyncio.sleep(1)


# @router.get("/sensors/{sensor_id}/stream/hot_water_alert", response_class=EventSourceResponse)
# async def function(request: Request, sensor_id: int, db: Session = Depends(get_db)):
#     pass


@router.post("/sensors")
async def function(new_sensor: NewSensor, db: Session = Depends(get_db)):
    return create_sensor(new_sensor, db)


@router.patch("/sensors/{sensor_id}")
async def function(sensor_id: int, new_value: UpdateSensor, db: Session = Depends(get_db)):
    return update_sensor(sensor_id, new_value, db)


@router.delete("/sensors/{sensor_id}")
async def function(sensor_id: int, db: Session = Depends(get_db)):
    return delete_sensor(sensor_id, db)
