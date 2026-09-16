import uvicorn
import os, dotenv
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from router import router

dotenv.load_dotenv()
origins = os.getenv("ORIGINS").split(",")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix="")


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
