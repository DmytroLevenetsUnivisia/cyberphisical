from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    sse_refresh_pause_seconds: int = 25

    hot_water_threshold_Celsius: int = 30


settings = Settings()
