"""Medication Database - Stub with common interactions"""
from typing import Dict, Optional
from ..tools.logger import get_logger

logger = get_logger(__name__)


class MedicationDB:
    """Stub medication database with interaction checking"""
    
    def __init__(self):
        # Common medication interactions
        self.interactions: Dict[tuple, str] = {
            ("aspirin", "warfarin"): "Increased bleeding risk",
            ("warfarin", "aspirin"): "Increased bleeding risk",
            ("ibuprofen", "aspirin"): "Increased GI bleeding risk",
            ("aspirin", "ibuprofen"): "Increased GI bleeding risk",
            ("lisinopril", "potassium"): "Hyperkalemia risk",
            ("potassium", "lisinopril"): "Hyperkalemia risk",
            ("metformin", "alcohol"): "Lactic acidosis risk",
            ("alcohol", "metformin"): "Lactic acidosis risk",
            ("simvastatin", "grapefruit"): "Increased statin levels",
            ("grapefruit", "simvastatin"): "Increased statin levels",
            ("levothyroxine", "calcium"): "Reduced absorption",
            ("calcium", "levothyroxine"): "Reduced absorption",
        }
        logger.info(f"MedicationDB initialized with {len(self.interactions)} interactions")
    
    def check_interaction(self, med1: str, med2: str) -> Optional[str]:
        """
        Check for interaction between two medications
        
        Args:
            med1: First medication name
            med2: Second medication name
            
        Returns:
            Interaction warning or None
        """
        key1 = (med1.lower(), med2.lower())
        key2 = (med2.lower(), med1.lower())
        
        return self.interactions.get(key1) or self.interactions.get(key2)
    
    def add_interaction(self, med1: str, med2: str, warning: str) -> None:
        """Add new interaction to database"""
        key = (med1.lower(), med2.lower())
        self.interactions[key] = warning
        logger.info(f"Added interaction: {med1} + {med2}")
