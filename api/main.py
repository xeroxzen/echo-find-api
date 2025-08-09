from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import upload, search, playback, admin
from api.config import settings

app = FastAPI(
    title="EchoFind API",
    description="Audio upload, search, and playback API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])
app.include_router(playback.router, prefix="/api/v1/playback", tags=["playback"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "EchoFind API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
