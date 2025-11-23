"""Reminder Agent - Manages medication reminders"""
from typing import Dict, Any, List
from ..tools.scheduler import Scheduler
from ..tools.logger import get_logger

logger = get_logger(__name__)


class ReminderAgent:
    """Agent responsible for scheduling medication reminders"""
    
    def __init__(self, memory_bank):
        self.memory = memory_bank
        self.scheduler = Scheduler()
        logger.info("ReminderAgent initialized")
    
    def schedule_reminders(self, patient: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Schedule reminders for a patient's medications
        
        Args:
            patient: Patient data dictionary
            
        Returns:
            List of scheduled jobs
        """
        patient_id = patient["patient_id"]
        medications = patient.get("medications", [])
        
        scheduled_jobs = []
        
        for med in medications:
            med_name = med["name"]
            time_slots = med.get("time_slots", ["09:00", "21:00"])
            
            for time_slot in time_slots:
                job_id = self.scheduler.schedule_job(
                    patient_id=patient_id,
                    medication=med_name,
                    time=time_slot
                )
                scheduled_jobs.append({
                    "job_id": job_id,
                    "medication": med_name,
                    "time": time_slot
                })
                logger.info(f"Scheduled reminder {job_id} for {patient_id}: {med_name} at {time_slot}")
        
        return scheduled_jobs
    
    def get_scheduled_reminders(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get all scheduled reminders for a patient"""
        return self.scheduler.get_patient_jobs(patient_id)
