"""Pydantic schemas for API validation"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    time_slots: List[str] = Field(default_factory=list)


class Patient(BaseModel):
    patient_id: str
    name: str
    age: int
    medications: List[Medication] = Field(default_factory=list)
    caregiver_contact: Optional[str] = None


class SymptomReport(BaseModel):
    symptom: str
    severity: int = Field(ge=1, le=10)
    timestamp: Optional[str] = None


class OrchestrationRequest(BaseModel):
    action: str = Field(description="orchestration action: check_interactions, schedule_reminders, log_symptom")
    data: Optional[Dict[str, Any]] = None


class SummaryResponse(BaseModel):
    patient_id: str
    adherence_rate: float
    total_doses: int
    taken_doses: int
    missed_doses: int
    interactions_detected: List[str]
    recent_symptoms: List[Dict[str, Any]]
    alerts: List[str]
