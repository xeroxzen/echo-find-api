#!/usr/bin/env python3
"""
EchoFind API Server Runner
"""
import uvicorn
from api.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
