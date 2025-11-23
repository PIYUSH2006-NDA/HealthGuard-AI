"""Unit tests for interaction checking"""
import pytest
from backend.tools.med_db import MedicationDB
from backend.agents.interaction_agent import InteractionAgent


def test_medication_db_known_interaction():
    """Test MedicationDB detects known interactions"""
    db = MedicationDB()
    
    # Test aspirin-warfarin interaction
    result = db.check_interaction("aspirin", "warfarin")
    assert result is not None
    assert "bleeding" in result.lower()
    
    # Test reverse order
    result = db.check_interaction("warfarin", "aspirin")
    assert result is not None


def test_medication_db_no_interaction():
    """Test MedicationDB returns None for non-interacting meds"""
    db = MedicationDB()
    
    result = db.check_interaction("aspirin", "metformin")
    assert result is None


def test_interaction_agent_multiple_meds():
    """Test InteractionAgent with multiple medications"""
    agent = InteractionAgent()
    
    # No interactions
    meds = ["metformin"]
    interactions = agent.check_interactions(meds)
    assert len(interactions) == 0
    
    # Known interaction
    meds = ["aspirin", "warfarin"]
    interactions = agent.check_interactions(meds)
    assert len(interactions) == 1
    assert "aspirin" in interactions[0].lower()
    assert "warfarin" in interactions[0].lower()
    
    # Multiple interactions
    meds = ["aspirin", "warfarin", "ibuprofen"]
    interactions = agent.check_interactions(meds)
    assert len(interactions) >= 2  # aspirin-warfarin and aspirin-ibuprofen


def test_interaction_agent_case_insensitive():
    """Test that interaction checking is case-insensitive"""
    agent = InteractionAgent()
    
    meds_lower = ["aspirin", "warfarin"]
    meds_upper = ["ASPIRIN", "WARFARIN"]
    meds_mixed = ["Aspirin", "Warfarin"]
    
    interactions_lower = agent.check_interactions(meds_lower)
    interactions_upper = agent.check_interactions(meds_upper)
    interactions_mixed = agent.check_interactions(meds_mixed)
    
    assert len(interactions_lower) == len(interactions_upper) == len(interactions_mixed)
