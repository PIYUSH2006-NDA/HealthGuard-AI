"""Monitor Agent - Tracks symptoms and triages severity"""
from typing import Dict, Any
from ..tools.logger import get_logger

logger = get_logger(__name__)


class MonitorAgent:
    """Agent that monitors patient symptoms and performs triage"""
    
    def __init__(self):
        logger.info("MonitorAgent initialized")
    
    def triage_symptom(self, symptom: str, severity: int) -> Dict[str, Any]:
        """
        Triage symptom based on severity and type
        
        Args:
            symptom: Symptom description
            severity: Severity level (1-10)
            
        Returns:
            Triage result with level and recommendation
        """
        symptom_lower = symptom.lower()
        
        # Critical symptoms requiring immediate attention
        critical_keywords = ["chest pain", "difficulty breathing", "seizure", "unconscious"]
        if any(keyword in symptom_lower for keyword in critical_keywords):
            level = "critical"
            recommendation = "SEEK IMMEDIATE MEDICAL ATTENTION - Call emergency services"
        elif severity >= 8:
            level = "critical"
            recommendation = "Contact healthcare provider immediately"
        elif severity >= 6:
            level = "high"
            recommendation = "Schedule appointment with healthcare provider soon"
        elif severity >= 4:
            level = "medium"
            recommendation = "Monitor and report at next scheduled visit"
        else:
            level = "low"
            recommendation = "Continue monitoring"
        
        result = {
            "level": level,
            "severity": severity,
            "recommendation": recommendation,
            "symptom": symptom
        }
        
        logger.info(f"Triaged symptom '{symptom}' (severity {severity}) as {level}")
        return result
