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

# Serve static files (Frontend build)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from fastapi import HTTPException

# Check if static directory exists (it will in production)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    # Catch-all for SPA client-side routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API calls to pass through
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
            
        # Check if file exists in static dir (e.g. favicon.svg)
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Serve index.html for any other route (SPA Fallback)
        return FileResponse(os.path.join(static_dir, "index.html"))
