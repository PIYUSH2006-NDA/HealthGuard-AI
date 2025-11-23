"""Analytics Agent - Generates adherence metrics and summaries"""
from typing import Dict, Any, List
from ..tools.persistence import MemoryBank
from ..tools.logger import get_logger

logger = get_logger(__name__)


class AnalyticsAgent:
    """Agent that computes adherence metrics and generates summaries"""
    
    def __init__(self, memory_bank: MemoryBank):
        self.memory = memory_bank
        logger.info("AnalyticsAgent initialized")
    
    def generate_summary(self, patient_id: str) -> Dict[str, Any]:
        """
        Generate comprehensive summary for clinician
        
        Args:
            patient_id: Patient identifier
            
        Returns:
            Summary dictionary with metrics and insights
        """
        patient = self.memory.get_patient(patient_id)
        if not patient:
            return {"error": f"Patient {patient_id} not found"}
        
        events = self.memory.get_patient_events(patient_id)
        
        # Calculate adherence metrics
        dose_events = [e for e in events if e.get("type") == "dose"]
        total_doses = len([e for e in dose_events if e.get("scheduled")])
        taken_doses = len([e for e in dose_events if e.get("taken")])
        missed_doses = total_doses - taken_doses
        
        adherence_rate = (taken_doses / total_doses * 100) if total_doses > 0 else 100.0
        
        # Get symptoms
        symptom_events = [e for e in events if e.get("type") == "symptom"]
        recent_symptoms = symptom_events[-5:] if symptom_events else []
        
        # Get interactions
        interaction_events = [e for e in events if e.get("type") == "interaction"]
        interactions_detected = [e.get("interaction") for e in interaction_events]
        
        # Generate alerts
        alerts = []
        if adherence_rate < 80:
            alerts.append(f"Low adherence rate: {adherence_rate:.1f}%")
        if any(s.get("triage_level") in ["high", "critical"] for s in symptom_events):
            alerts.append("High severity symptoms reported")
        if interactions_detected:
            alerts.append(f"{len(interactions_detected)} medication interactions detected")
        
        summary = {
            "patient_id": patient_id,
            "patient_name": patient.get("name", "Unknown"),
            "adherence_rate": round(adherence_rate, 1),
            "total_doses": total_doses,
            "taken_doses": taken_doses,
            "missed_doses": missed_doses,
            "interactions_detected": interactions_detected,
            "recent_symptoms": recent_symptoms,
            "alerts": alerts,
            "medication_count": len(patient.get("medications", []))
        }
        
        logger.info(f"Generated summary for {patient_id}: {adherence_rate:.1f}% adherence")
        return summary
    
    def calculate_adherence(self, patient_id: str) -> float:
        """Calculate simple adherence percentage"""
        summary = self.generate_summary(patient_id)
        return summary.get("adherence_rate", 0.0)
