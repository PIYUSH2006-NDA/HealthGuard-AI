"""Automated evaluation script for MediBuddy v2"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.tools.persistence import MemoryBank
from backend.agents.orchestrator import OrchestratorAgent
import tempfile
import os


def evaluate_system() -> float:
    """
    Evaluate the MediBuddy v2 system
    
    Returns:
        Score out of 100
    """
    print("=" * 60)
    print("MediBuddy v2 - Automated Evaluation")
    print("=" * 60)
    
    # Create temporary memory
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as f:
        temp_file = f.name
    
    try:
        memory = MemoryBank(temp_file)
        orchestrator = OrchestratorAgent(memory)
        
        score = 0
        max_score = 100
        
        # Test 1: Patient creation (10 points)
        print("\n[Test 1] Patient Creation...")
        patient = {
            "patient_id": "eval_patient_001",
            "name": "Evaluation Patient",
            "age": 75,
            "medications": [
                {"name": "Aspirin", "dosage": "81mg", "frequency": "daily", "time_slots": ["09:00"]},
                {"name": "Warfarin", "dosage": "5mg", "frequency": "daily", "time_slots": ["20:00"]},
                {"name": "Lisinopril", "dosage": "10mg", "frequency": "daily", "time_slots": ["09:00"]}
            ],
            "caregiver_contact": "caregiver@test.com"
        }
        memory.add_patient(patient)
        
        retrieved = memory.get_patient("eval_patient_001")
        if retrieved and retrieved["name"] == "Evaluation Patient":
            score += 10
            print("✅ PASS - Patient created successfully")
        else:
            print("❌ FAIL - Patient creation failed")
        
        # Test 2: Interaction detection (25 points)
        print("\n[Test 2] Interaction Detection...")
        result = orchestrator.orchestrate("eval_patient_001", "check_interactions")
        
        if result["status"] == "success":
            score += 10
            print("✅ Orchestration successful")
            
            interactions = result.get("interactions", [])
            if len(interactions) > 0:
                score += 15
                print(f"✅ PASS - Detected {len(interactions)} interaction(s)")
                for interaction in interactions:
                    print(f"   - {interaction}")
            else:
                print("❌ FAIL - No interactions detected (expected at least 1)")
        else:
            print("❌ FAIL - Orchestration failed")
        
        # Test 3: Reminder scheduling (15 points)
        print("\n[Test 3] Reminder Scheduling...")
        result = orchestrator.orchestrate("eval_patient_001", "schedule_reminders")
        
        if result["status"] == "success":
            scheduled = result.get("reminders_scheduled", 0)
            if scheduled >= 3:
                score += 15
                print(f"✅ PASS - Scheduled {scheduled} reminders")
            else:
                score += 5
                print(f"⚠️  PARTIAL - Only {scheduled} reminders scheduled")
        else:
            print("❌ FAIL - Reminder scheduling failed")
        
        # Test 4: Symptom triage (20 points)
        print("\n[Test 4] Symptom Monitoring & Triage...")
        
        # Low severity
        result = orchestrator.orchestrate("eval_patient_001", "log_symptom", {
            "symptom": "Mild headache",
            "severity": 2
        })
        if result["status"] == "success" and result["triage"]["level"] == "low":
            score += 7
            print("✅ Low severity triage correct")
        
        # High severity
        result = orchestrator.orchestrate("eval_patient_001", "log_symptom", {
            "symptom": "Severe chest pain",
            "severity": 9
        })
        if result["status"] == "success" and result["triage"]["level"] in ["high", "critical"]:
            score += 13
            print("✅ High severity triage correct")
        else:
            print("❌ High severity triage failed")
        
        # Test 5: Analytics & Summary (30 points)
        print("\n[Test 5] Analytics & Summary Generation...")
        summary = orchestrator.analytics_agent.generate_summary("eval_patient_001")
        
        checks = [
            ("patient_id" in summary, "Patient ID present"),
            ("adherence_rate" in summary, "Adherence rate calculated"),
            ("interactions_detected" in summary, "Interactions in summary"),
            ("recent_symptoms" in summary, "Symptoms tracked"),
            ("alerts" in summary, "Alerts generated"),
            (len(summary.get("recent_symptoms", [])) >= 2, "Multiple symptoms recorded")
        ]
        
        points_per_check = 30 // len(checks)
        for check, description in checks:
            if check:
                score += points_per_check
                print(f"✅ {description}")
            else:
                print(f"❌ {description} - FAILED")
        
        # Final results
        print("\n" + "=" * 60)
        print("EVALUATION COMPLETE")
        print("=" * 60)
        print(f"Final Score: {score}/{max_score} ({score/max_score*100:.1f}%)")
        
        if score >= 90:
            grade = "A - Excellent"
        elif score >= 80:
            grade = "B - Good"
        elif score >= 70:
            grade = "C - Satisfactory"
        elif score >= 60:
            grade = "D - Needs Improvement"
        else:
            grade = "F - Unsatisfactory"
        
        print(f"Grade: {grade}")
        print("=" * 60)
        
        return score
        
    finally:
        # Cleanup
        if os.path.exists(temp_file):
            os.remove(temp_file)


if __name__ == "__main__":
    score = evaluate_system()
    sys.exit(0 if score >= 70 else 1)  # Exit code 0 if passing (>=70%)
