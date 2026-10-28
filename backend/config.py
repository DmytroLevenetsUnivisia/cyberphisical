from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    sse_refresh_pause = 25

    hot_water_threshold = 30


settings = Settings()
