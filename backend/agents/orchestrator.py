"""Orchestrator Agent - Coordinates all sub-agents"""
from typing import Dict, Any, List
from .reminder_agent import ReminderAgent
from .interaction_agent import InteractionAgent
from .monitor_agent import MonitorAgent
from .notifier_agent import NotifierAgent
from .analytics_agent import AnalyticsAgent
from ..tools.persistence import MemoryBank
from ..tools.logger import get_logger

logger = get_logger(__name__)


class OrchestratorAgent:
    """Main orchestrator coordinating all sub-agents"""
    
    def __init__(self, memory_bank: MemoryBank):
        self.memory = memory_bank
        self.reminder_agent = ReminderAgent(memory_bank)
        self.interaction_agent = InteractionAgent()
        self.monitor_agent = MonitorAgent()
        self.notifier_agent = NotifierAgent()
        self.analytics_agent = AnalyticsAgent(memory_bank)
        logger.info("OrchestratorAgent initialized")
    
    def orchestrate(self, patient_id: str, action: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main orchestration method
        
        Args:
            patient_id: Patient identifier
            action: Action to perform
            data: Optional action data
            
        Returns:
            Result dictionary
        """
        logger.info(f"Orchestrating action '{action}' for patient {patient_id}")
        
        patient = self.memory.get_patient(patient_id)
        if not patient:
            return {"status": "error", "message": f"Patient {patient_id} not found"}
        
        result = {"status": "success", "action": action, "patient_id": patient_id}
        
        if action == "check_interactions":
            result.update(self._check_interactions(patient))
        elif action == "schedule_reminders":
            result.update(self._schedule_reminders(patient))
        elif action == "log_symptom":
            result.update(self._log_symptom(patient_id, data or {}))
        elif action == "full_check":
            result.update(self._full_health_check(patient))
        else:
            result["status"] = "error"
            result["message"] = f"Unknown action: {action}"
        
        return result
    
    def _check_interactions(self, patient: Dict[str, Any]) -> Dict[str, Any]:
        """Check medication interactions"""
        medications = [med["name"] for med in patient.get("medications", [])]
        interactions = self.interaction_agent.check_interactions(medications)
        
        if interactions:
            logger.warning(f"Interactions found for patient {patient['patient_id']}: {interactions}")
            self.notifier_agent.notify_caregiver(
                patient_id=patient["patient_id"],
                message=f"Medication interactions detected: {', '.join(interactions)}",
                severity="high"
            )
        
        return {"interactions": interactions, "medication_count": len(medications)}
    
    def _schedule_reminders(self, patient: Dict[str, Any]) -> Dict[str, Any]:
        """Schedule medication reminders"""
        scheduled = self.reminder_agent.schedule_reminders(patient)
        return {"reminders_scheduled": len(scheduled), "jobs": scheduled}
    
    def _log_symptom(self, patient_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Log and triage symptoms"""
        symptom = data.get("symptom", "unknown")
        severity = data.get("severity", 5)
        
        triage_result = self.monitor_agent.triage_symptom(symptom, severity)
        
        # Store in memory
        self.memory.add_event({
            "type": "symptom",
            "patient_id": patient_id,
            "symptom": symptom,
            "severity": severity,
            "triage_level": triage_result["level"],
            "timestamp": data.get("timestamp")
        })
        
        # Notify if high severity
        if triage_result["level"] in ["high", "critical"]:
            self.notifier_agent.notify_caregiver(
                patient_id=patient_id,
                message=f"High severity symptom: {symptom} (level: {severity})",
                severity=triage_result["level"]
            )
        
        return {"triage": triage_result, "symptom": symptom}
    
    def _full_health_check(self, patient: Dict[str, Any]) -> Dict[str, Any]:
        """Perform comprehensive health check"""
        interactions = self._check_interactions(patient)
        reminders = self._schedule_reminders(patient)
        summary = self.analytics_agent.generate_summary(patient["patient_id"])
        
        return {
            "interactions": interactions,
            "reminders": reminders,
            "summary": summary
        }
