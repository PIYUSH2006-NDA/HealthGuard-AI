"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface PatientProfile {
  id: string
  name: string
  age: number
  email: string
  phone: string
  medicationCount: number
  adherenceRate: number
  lastActive: string
  riskLevel: "low" | "medium" | "high"
  conditions: string[]
  assignedClinician?: string
}

export interface PatientEvent {
  id: string
  patientId: string
  type: "med_taken" | "med_missed" | "symptom_report" | "advice_request" | "clinician_note"
  timestamp: string
  details: string
  metadata?: Record<string, any>
}

export interface ClinicianNote {
  id: string
  patientId: string
  clinicianId: string
  clinicianName: string
  note: string
  timestamp: string
  category: "observation" | "treatment_plan" | "follow_up" | "general"
}

interface ClinicianContextType {
  patients: PatientProfile[]
  events: PatientEvent[]
  notes: ClinicianNote[]
  getPatientEvents: (patientId: string) => PatientEvent[]
  getPatientNotes: (patientId: string) => ClinicianNote[]
  addClinicianNote: (note: Omit<ClinicianNote, "id" | "clinicianId" | "clinicianName" | "timestamp">) => void
  updatePatientRisk: (patientId: string, riskLevel: PatientProfile["riskLevel"]) => void
}

const ClinicianContext = createContext<ClinicianContextType | undefined>(undefined)

const PATIENTS_KEY = "medibuddy_patients"
const EVENTS_KEY = "medibuddy_events"
const NOTES_KEY = "medibuddy_notes"

// Demo patient data
const DEMO_PATIENTS: PatientProfile[] = [
  {
    id: "patient_001",
    name: "John Doe",
    age: 45,
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    medicationCount: 3,
    adherenceRate: 65,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    riskLevel: "high",
    conditions: ["Hypertension", "Type 2 Diabetes"],
    assignedClinician: "Dr. Emily Chen",
  },
  {
    id: "patient_002",
    name: "Sarah Smith",
    age: 62,
    email: "sarah.smith@example.com",
    phone: "(555) 234-5678",
    medicationCount: 5,
    adherenceRate: 88,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    riskLevel: "medium",
    conditions: ["Heart Disease", "High Cholesterol"],
    assignedClinician: "Dr. Emily Chen",
  },
  {
    id: "patient_003",
    name: "Alex Johnson",
    age: 38,
    email: "alex.j@example.com",
    phone: "(555) 345-6789",
    medicationCount: 2,
    adherenceRate: 96,
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    riskLevel: "low",
    conditions: ["Hypothyroidism"],
    assignedClinician: "Dr. Emily Chen",
  },
  {
    id: "patient_004",
    name: "Maria Garcia",
    age: 55,
    email: "maria.g@example.com",
    phone: "(555) 456-7890",
    medicationCount: 4,
    adherenceRate: 92,
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    riskLevel: "low",
    conditions: ["Asthma", "Allergies"],
    assignedClinician: "Dr. Emily Chen",
  },
]

const DEMO_EVENTS: PatientEvent[] = [
  {
    id: "event_001",
    patientId: "patient_001",
    type: "med_missed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    details: "Missed Lisinopril 10mg dose at 8:00 AM",
  },
  {
    id: "event_002",
    patientId: "patient_001",
    type: "med_missed",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    details: "Missed Metformin 500mg dose at 7:00 PM",
  },
  {
    id: "event_003",
    patientId: "patient_002",
    type: "symptom_report",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    details: "Reported mild dizziness",
  },
  {
    id: "event_004",
    patientId: "patient_002",
    type: "med_taken",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    details: "Took Atorvastatin 20mg",
  },
]

export function ClinicianProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [events, setEvents] = useState<PatientEvent[]>([])
  const [notes, setNotes] = useState<ClinicianNote[]>([])

  useEffect(() => {
    if (user?.role !== "clinician") {
      setPatients([])
      setEvents([])
      setNotes([])
      return
    }

    // Load or initialize demo data
    const storedPatients = localStorage.getItem(PATIENTS_KEY)
    if (storedPatients) {
      try {
        setPatients(JSON.parse(storedPatients))
      } catch (e) {
        console.error("Failed to parse patients data", e)
        setPatients(DEMO_PATIENTS)
      }
    } else {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(DEMO_PATIENTS))
      setPatients(DEMO_PATIENTS)
    }

    const storedEvents = localStorage.getItem(EVENTS_KEY)
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents))
      } catch (e) {
        console.error("Failed to parse events data", e)
        setEvents(DEMO_EVENTS)
      }
    } else {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(DEMO_EVENTS))
      setEvents(DEMO_EVENTS)
    }

    const storedNotes = localStorage.getItem(NOTES_KEY)
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes))
      } catch (e) {
        console.error("Failed to parse notes data", e)
        setNotes([])
      }
    }
  }, [user])

  const getPatientEvents = (patientId: string) => {
    return events
      .filter((e) => e.patientId === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const getPatientNotes = (patientId: string) => {
    return notes
      .filter((n) => n.patientId === patientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const addClinicianNote = (note: Omit<ClinicianNote, "id" | "clinicianId" | "clinicianName" | "timestamp">) => {
    if (!user || user.role !== "clinician") return

    const newNote: ClinicianNote = {
      ...note,
      id: `note_${Date.now()}`,
      clinicianId: user.id,
      clinicianName: user.name,
      timestamp: new Date().toISOString(),
    }

    const updatedNotes = [newNote, ...notes]
    localStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes))
    setNotes(updatedNotes)

    // Also add as event
    const newEvent: PatientEvent = {
      id: `event_${Date.now()}`,
      patientId: note.patientId,
      type: "clinician_note",
      timestamp: newNote.timestamp,
      details: `Dr. ${user.name} added note: ${note.note.substring(0, 50)}${note.note.length > 50 ? "..." : ""}`,
    }

    const updatedEvents = [newEvent, ...events]
    localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
  }

  const updatePatientRisk = (patientId: string, riskLevel: PatientProfile["riskLevel"]) => {
    const updatedPatients = patients.map((p) => (p.id === patientId ? { ...p, riskLevel } : p))
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(updatedPatients))
    setPatients(updatedPatients)
  }

  return (
    <ClinicianContext.Provider
      value={{
        patients,
        events,
        notes,
        getPatientEvents,
        getPatientNotes,
        addClinicianNote,
        updatePatientRisk,
      }}
    >
      {children}
    </ClinicianContext.Provider>
  )
}

export function useClinician() {
  const context = useContext(ClinicianContext)
  if (context === undefined) {
    throw new Error("useClinician must be used within a ClinicianProvider")
  }
  return context
}
