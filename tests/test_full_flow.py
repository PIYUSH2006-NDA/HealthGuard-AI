"""Integration test for full flow"""
import pytest
from backend.tools.persistence import MemoryBank
from backend.agents.orchestrator import OrchestratorAgent
import tempfile
import os


@pytest.fixture
def temp_memory():
    """Create temporary memory bank for testing"""
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as f:
        temp_file = f.name
    
    memory = MemoryBank(temp_file)
    yield memory
    
    # Cleanup
    if os.path.exists(temp_file):
        os.remove(temp_file)


def test_full_patient_flow(temp_memory):
    """Test complete patient flow from creation to summary"""
    orchestrator = OrchestratorAgent(temp_memory)
    
    # Create patient
    patient = {
        "patient_id": "test_001",
        "name": "Test Patient",
        "age": 70,
        "medications": [
            {
                "name": "Aspirin",
                "dosage": "81mg",
                "frequency": "daily",
                "time_slots": ["09:00"]
            },
            {
                "name": "Warfarin",
                "dosage": "5mg",
                "frequency": "daily",
                "time_slots": ["18:00"]
            }
        ],
        "caregiver_contact": "test@example.com"
    }
    temp_memory.add_patient(patient)
    
    # Check interactions
    result = orchestrator.orchestrate("test_001", "check_interactions")
    assert result["status"] == "success"
    assert len(result["interactions"]) > 0  # Should detect aspirin-warfarin interaction
    
    # Schedule reminders
    result = orchestrator.orchestrate("test_001", "schedule_reminders")
    assert result["status"] == "success"
    assert result["reminders_scheduled"] == 2  # Two medications
    
    # Log symptom
    result = orchestrator.orchestrate("test_001", "log_symptom", {
        "symptom": "Headache",
        "severity": 3
    })
    assert result["status"] == "success"
    assert result["triage"]["level"] in ["low", "medium"]
    
    # Generate summary
    summary = orchestrator.analytics_agent.generate_summary("test_001")
    assert summary["patient_id"] == "test_001"
    assert "adherence_rate" in summary
    assert len(summary["interactions_detected"]) > 0


def test_high_severity_symptom(temp_memory):
    """Test high severity symptom triggers notification"""
    orchestrator = OrchestratorAgent(temp_memory)
    
    patient = {
        "patient_id": "test_002",
        "name": "Test Patient 2",
        "age": 65,
        "medications": [],
        "caregiver_contact": "caregiver@example.com"
    }
    temp_memory.add_patient(patient)
    
    # Log high severity symptom
    result = orchestrator.orchestrate("test_002", "log_symptom", {
        "symptom": "Chest pain",
        "severity": 9
    })
    
    assert result["status"] == "success"
    assert result["triage"]["level"] in ["high", "critical"]
