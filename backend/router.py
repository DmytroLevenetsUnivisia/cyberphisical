from fastapi import APIRouter, HTTPException
from models import CreateSensor, UpdateSensor
from service import *

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello, World!"}


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/sensors")
async def test():
    return sensors


@router.post("/sensors")
async def test(sensor: CreateSensor):
    print(sensor)
    return create_sensor(**sensor.model_dump())


@router.get("/sensors/{sensor_id}")
async def test(sensor_id: str):
    try:
        return get_sensor(sensor_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/sensors/{sensor_id}")
async def test(sensor_id: str, new_value: UpdateSensor):
    try:
        return update_sensor(sensor_id, new_value)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/sensors/{sensor_id}")
async def test(sensor_id: str):
    try:
        return delete_sensor(sensor_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
