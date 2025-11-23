"""In-memory Scheduler for medication reminders"""
from typing import Dict, List, Any
from datetime import datetime
import uuid
from ..tools.logger import get_logger

logger = get_logger(__name__)


class Scheduler:
    """In-memory job scheduler for reminders"""
    
    def __init__(self):
        self.jobs: Dict[str, Dict[str, Any]] = {}
        logger.info("Scheduler initialized")
    
    def schedule_job(
        self,
        patient_id: str,
        medication: str,
        time: str
    ) -> str:
        """
        Schedule a reminder job
        
        Args:
            patient_id: Patient identifier
            medication: Medication name
            time: Time slot (e.g., "09:00")
            
        Returns:
            Job ID
        """
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        
        self.jobs[job_id] = {
            "job_id": job_id,
            "patient_id": patient_id,
            "medication": medication,
            "time": time,
            "created_at": datetime.now().isoformat(),
            "status": "scheduled"
        }
        
        logger.debug(f"Scheduled job {job_id}: {medication} at {time} for {patient_id}")
        return job_id
    
    def get_patient_jobs(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get all jobs for a patient"""
        return [
            job for job in self.jobs.values()
            if job["patient_id"] == patient_id
        ]
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get all scheduled jobs"""
        return list(self.jobs.values())
    
    def cancel_job(self, job_id: str) -> bool:
        """Cancel a scheduled job"""
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "cancelled"
            logger.info(f"Cancelled job {job_id}")
            return True
        return False
