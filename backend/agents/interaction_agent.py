"""Interaction Agent - Checks medication interactions"""
from typing import List
from ..tools.med_db import MedicationDB
from ..tools.logger import get_logger

logger = get_logger(__name__)


class InteractionAgent:
    """Agent that checks for medication interactions"""
    
    def __init__(self):
        self.med_db = MedicationDB()
        logger.info("InteractionAgent initialized")
    
    def check_interactions(self, medications: List[str]) -> List[str]:
        """
        Check for interactions between medications
        
        Args:
            medications: List of medication names
            
        Returns:
            List of interaction warnings
        """
        if len(medications) < 2:
            return []
        
        interactions = []
        
        # Check each pair
        for i in range(len(medications)):
            for j in range(i + 1, len(medications)):
                med1 = medications[i].lower()
                med2 = medications[j].lower()
                
                interaction = self.med_db.check_interaction(med1, med2)
                if interaction:
                    warning = f"{medications[i]} + {medications[j]}: {interaction}"
                    interactions.append(warning)
                    logger.warning(f"Interaction detected: {warning}")
        
        return interactions
