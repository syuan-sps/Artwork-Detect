#!/usr/bin/env bash
# Start the FastAPI similarity backend
# Usage: ./start_backend.sh [port]
PORT="${1:-8000}"
cd "$(dirname "$0")"
uvicorn backend.main:app --host 0.0.0.0 --port "$PORT" --reload
