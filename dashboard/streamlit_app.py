"""Streamlit Dashboard for Clinicians"""
import streamlit as st
import json
from pathlib import Path
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="MediBuddy v2 Dashboard", page_icon="🏥", layout="wide")

st.title("🏥 MediBuddy v2 - Clinician Dashboard")
st.markdown("**AI Multi-Agent Medication Adherence Assistant**")

# Load data
data_file = Path("backend/data/memory_v2.json")

if not data_file.exists():
    st.warning("⚠️ No data file found. Please run the backend and create patients first.")
    st.info(f"Expected file: {data_file.absolute()}")
    st.stop()

with open(data_file, 'r') as f:
    data = json.load(f)

patients = data.get("patients", {})
events = data.get("events", [])

# Sidebar
st.sidebar.header("📊 Overview")
st.sidebar.metric("Total Patients", len(patients))
st.sidebar.metric("Total Events", len(events))

if not patients:
    st.info("No patients found. Create a patient using the API or frontend.")
    st.stop()

# Patient selector
patient_ids = list(patients.keys())
selected_patient_id = st.sidebar.selectbox("Select Patient", patient_ids)

# Main content
patient = patients[selected_patient_id]
patient_events = [e for e in events if e.get("patient_id") == selected_patient_id]

col1, col2 = st.columns(2)

with col1:
    st.subheader("👤 Patient Information")
    st.write(f"**Name:** {patient.get('name', 'Unknown')}")
    st.write(f"**Age:** {patient.get('age', 'N/A')}")
    st.write(f"**Patient ID:** {patient.get('patient_id')}")
    st.write(f"**Caregiver:** {patient.get('caregiver_contact', 'N/A')}")

with col2:
    st.subheader("💊 Medications")
    meds = patient.get("medications", [])
    if meds:
        for med in meds:
            st.write(f"• **{med['name']}** - {med.get('dosage', 'N/A')} ({med.get('frequency', 'N/A')})")
    else:
        st.info("No medications recorded")

# Events
st.subheader("📋 Recent Events")
if patient_events:
    # Create DataFrame
    events_df = pd.DataFrame(patient_events)
    
    # Display event types
    event_types = events_df['type'].value_counts()
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Dose Events", event_types.get('dose', 0))
    with col2:
        st.metric("Symptoms", event_types.get('symptom', 0))
    with col3:
        st.metric("Interactions", event_types.get('interaction', 0))
    
    # Show events table
    st.dataframe(events_df, use_container_width=True)
else:
    st.info("No events recorded for this patient")

# Adherence metrics
st.subheader("📈 Adherence Metrics")
dose_events = [e for e in patient_events if e.get("type") == "dose"]
if dose_events:
    total = len([e for e in dose_events if e.get("scheduled")])
    taken = len([e for e in dose_events if e.get("taken")])
    
    if total > 0:
        adherence_rate = (taken / total) * 100
        st.progress(adherence_rate / 100)
        st.write(f"**Adherence Rate:** {adherence_rate:.1f}%")
        st.write(f"**Doses Taken:** {taken} / {total}")
    else:
        st.info("No dose data available yet")
else:
    st.info("No dose tracking data available")

# Symptoms
symptom_events = [e for e in patient_events if e.get("type") == "symptom"]
if symptom_events:
    st.subheader("🩺 Recent Symptoms")
    for symptom in symptom_events[-5:]:
        severity = symptom.get("severity", 0)
        triage = symptom.get("triage_level", "unknown")
        
        color = {
            "low": "🟢",
            "medium": "🟡",
            "high": "🟠",
            "critical": "🔴"
        }.get(triage, "⚪")
        
        st.write(f"{color} **{symptom.get('symptom')}** - Severity: {severity}/10 ({triage})")

# Raw data expander
with st.expander("🔍 View Raw Data"):
    st.json(patient)
