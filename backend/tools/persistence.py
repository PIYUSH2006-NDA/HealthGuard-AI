"""Persistence layer - MemoryBank and SessionService"""
from typing import Dict, Any, List, Optional
import json
from pathlib import Path
from datetime import datetime
from ..tools.logger import get_logger

logger = get_logger(__name__)


class MemoryBank:
    """File-backed JSON storage for patient data and events"""
    
    def __init__(self, data_file: str = "backend/data/memory_v2.json"):
        self.data_file = Path(data_file)
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        self.data: Dict[str, Any] = self._load()
        logger.info(f"MemoryBank initialized with {len(self.data.get('patients', {}))} patients")
    
    def _load(self) -> Dict[str, Any]:
        """Load data from file"""
        if self.data_file.exists():
            with open(self.data_file, 'r') as f:
                return json.load(f)
        return {"patients": {}, "events": []}
    
    def _save(self) -> None:
        """Save data to file"""
        with open(self.data_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def add_patient(self, patient: Dict[str, Any]) -> None:
        """Add or update patient"""
        patient_id = patient["patient_id"]
        self.data["patients"][patient_id] = patient
        self._save()
        logger.info(f"Saved patient {patient_id}")
    
    def get_patient(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """Get patient by ID"""
        return self.data["patients"].get(patient_id)
    
    def get_all_patients(self) -> List[Dict[str, Any]]:
        """Get all patients"""
        return list(self.data["patients"].values())
    
    def add_event(self, event: Dict[str, Any]) -> None:
        """Add event to history"""
        if "timestamp" not in event:
            event["timestamp"] = datetime.now().isoformat()
        self.data["events"].append(event)
        self._save()
        logger.debug(f"Added event: {event.get('type')}")
    
    def get_patient_events(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get all events for a patient"""
        return [
            event for event in self.data["events"]
            if event.get("patient_id") == patient_id
        ]
    
    def get_all_events(self) -> List[Dict[str, Any]]:
        """Get all events"""
        return self.data["events"]


class SessionService:
    """Manage user sessions (stub for future expansion)"""
    
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        logger.info("SessionService initialized")
    
    def create_session(self, patient_id: str) -> str:
        """Create new session"""
        import uuid
        session_id = f"session_{uuid.uuid4().hex[:12]}"
        self.sessions[session_id] = {
            "patient_id": patient_id,
            "created_at": datetime.now().isoformat()
        }
        return session_id
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        return self.sessions.get(session_id)
