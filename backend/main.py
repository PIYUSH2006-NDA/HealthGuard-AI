"""FastAPI main application"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Dict, Any
from pathlib import Path

from .agents.schemas import Patient, OrchestrationRequest, SummaryResponse
from .agents.orchestrator import OrchestratorAgent
from .tools.persistence import MemoryBank
from .tools.logger import get_logger

logger = get_logger(__name__)

# Initialize
app = FastAPI(
    title="MediBuddy v2 API",
    description="AI Multi-Agent Medication Adherence Assistant",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
memory = MemoryBank()
orchestrator = OrchestratorAgent(memory)

logger.info("MediBuddy v2 API started")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "MediBuddy v2",
        "version": "2.0.0",
        "status": "running",
        "patients": len(memory.get_all_patients())
    }


@app.post("/api/patient")
async def create_or_update_patient(patient: Patient) -> Dict[str, Any]:
    """Create or update a patient"""
    try:
        memory.add_patient(patient.model_dump())
        logger.info(f"Patient {patient.patient_id} created/updated")
        
        return {
            "status": "success",
            "message": f"Patient {patient.patient_id} saved",
            "patient_id": patient.patient_id
        }
    except Exception as e:
        logger.error(f"Error creating patient: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/patient/{patient_id}")
async def get_patient(patient_id: str) -> Dict[str, Any]:
    """Get patient details"""
    patient = memory.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient {patient_id} not found")
    return patient


@app.get("/api/patients")
async def list_patients() -> Dict[str, Any]:
    """List all patients"""
    patients = memory.get_all_patients()
    return {
        "count": len(patients),
        "patients": patients
    }


@app.post("/api/run/{patient_id}")
async def run_orchestration(patient_id: str, request: OrchestrationRequest) -> Dict[str, Any]:
    """Run orchestration for a patient"""
    try:
        result = orchestrator.orchestrate(
            patient_id=patient_id,
            action=request.action,
            data=request.data
        )
        return result
    except Exception as e:
        logger.error(f"Orchestration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/summary/{patient_id}")
async def get_summary(patient_id: str) -> Dict[str, Any]:
    """Get clinician summary for a patient"""
    patient = memory.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient {patient_id} not found")
    
    summary = orchestrator.analytics_agent.generate_summary(patient_id)
    return summary


@app.get("/api/events/{patient_id}")
async def get_patient_events(patient_id: str) -> Dict[str, Any]:
    """Get all events for a patient"""
    events = memory.get_patient_events(patient_id)
    return {
        "patient_id": patient_id,
        "count": len(events),
        "events": events
    }


# Serve frontend
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="frontend")
