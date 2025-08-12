"""
FastAPI main application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Import routes
from .routes import health
from .routes import brokers

# Create FastAPI app
app = FastAPI(
    title="Trading Journal API",
    description="API for the Trading Journal application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(brokers.router)

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "status": "ok",
        "message": "Trading Journal API is running"
    }

if __name__ == "__main__":
    import uvicorn
    
    # Ensure data directory exists
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
# Import health router
from backend.routes.health import router as health_router

# Include health router
app.include_router(health_router, tags=["health"])
