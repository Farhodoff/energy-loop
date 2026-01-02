from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time
from generator import generate_grid

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Tile(BaseModel):
    type: int
    rotation: int
    locked: bool

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/level/random")
def get_random_level(width: int = 5, height: int = 5):
    grid = generate_grid(width, height)
    return grid

@app.get("/api/level/daily")
def get_daily_level():
    # Use current date as seed (YYYYMMDD)
    # This is a simple daily seed
    import datetime
    seed = int(datetime.datetime.now().strftime("%Y%m%d"))
    # Daily challenge is hardcoded to 7x7 for extra fun
    grid = generate_grid(7, 7, seed=seed)
    return grid
