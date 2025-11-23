#!/bin/bash

# MediBuddy v2 - Local Development Script
echo "========================================"
echo "MediBuddy v2 - AI Multi-Agent Assistant"
echo "========================================"

# Check Python version
echo ""
echo "[1/5] Checking Python version..."
python3 --version | grep "Python 3.11" || {
    echo "⚠️  Warning: Python 3.11+ recommended"
}

# Install dependencies
echo ""
echo "[2/5] Installing dependencies..."
pip install -r backend/requirements.txt

# Run tests
echo ""
echo "[3/5] Running tests..."
pytest tests/ -v

# Start backend
echo ""
echo "[4/5] Starting backend server..."
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:8000"
echo ""
echo "To start the dashboard (in another terminal):"
echo "  streamlit run dashboard/streamlit_app.py"
echo ""
echo "To run evaluation:"
echo "  python evaluation/automated_evaluator.py"
echo ""
echo "[5/5] Starting server..."
uvicorn backend.main:app --reload --port 8000
