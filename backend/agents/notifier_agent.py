"""Notifier Agent - Sends notifications to caregivers"""
from typing import Optional
from ..tools.logger import get_logger
import json
from pathlib import Path

logger = get_logger(__name__)


class NotifierAgent:
    """Agent that sends notifications to caregivers"""
    
    def __init__(self):
        self.notifications_file = Path("backend/data/notifications.json")
        self.notifications_file.parent.mkdir(parents=True, exist_ok=True)
        logger.info("NotifierAgent initialized")
    
    def notify_caregiver(
        self,
        patient_id: str,
        message: str,
        severity: str = "medium"
    ) -> Dict[str, Any]:
        """
        Send notification to caregiver
        
        Args:
            patient_id: Patient identifier
            message: Notification message
            severity: Severity level (low, medium, high, critical)
            
        Returns:
            Notification result
        """
        from datetime import datetime
        
        notification = {
            "patient_id": patient_id,
            "message": message,
            "severity": severity,
            "timestamp": datetime.now().isoformat(),
            "status": "sent"
        }
        
        # Log notification
        logger.warning(f"[CAREGIVER NOTIFICATION] {severity.upper()} - Patient {patient_id}: {message}")
        
        # Save to file
        self._save_notification(notification)
        
        return notification
    
    def _save_notification(self, notification: Dict[str, Any]) -> None:
        """Save notification to file"""
        notifications = []
        
        if self.notifications_file.exists():
            with open(self.notifications_file, 'r') as f:
                notifications = json.load(f)
        
        notifications.append(notification)
        
        with open(self.notifications_file, 'w') as f:
            json.dump(notifications, f, indent=2)
