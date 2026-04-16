"""
Vercel Serverless Function wrapper for FastAPI backend.
This file imports the FastAPI app from backend/server.py and exposes it
for Vercel's Python runtime.
"""
import sys
import os
from pathlib import Path

# Add backend directory to Python path so imports work
backend_dir = str(Path(__file__).parent.parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set environment variables for serverless context
os.environ.setdefault('DB_NAME', 'avahsa')

# Import the FastAPI app
from server import app

# Vercel expects the app to be available as 'app'
# This is automatically detected by @vercel/python runtime
