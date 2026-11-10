"""
AI Service - FastAPI Entry Point
Exports app and provides uvicorn startup configuration for local and cloud deployment.
"""

import os
import uvicorn
from ai_service import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)
