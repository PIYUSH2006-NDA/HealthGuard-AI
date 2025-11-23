"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Medication {
  id: string
  userId: string
  name: string
  dosage: string
  frequency: string
  schedule: string // cron-like or times per day
  startDate: string
  endDate?: string
  notes?: string
  color?: string
  icon?: string
  isPaused?: boolean
  interactions?: string[]
  nextDose?: string
}

interface MedicationContextType {
  medications: Medication[]
  addMedication: (med: Omit<Medication, "id" | "userId">) => void
  updateMedication: (id: string, updates: Partial<Medication>) => void
  deleteMedication: (id: string) => void
  getMedication: (id: string) => Medication | undefined
  pauseMedication: (id: string) => void
  resumeMedication: (id: string) => void
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined)

const MEDICATIONS_KEY = "medibuddy_medications"

// Common medication database for autocomplete
export const COMMON_MEDICATIONS = [
  "Aspirin",
  "Ibuprofen",
  "Acetaminophen",
  "Amoxicillin",
  "Lisinopril",
  "Metformin",
  "Atorvastatin",
  "Levothyroxine",
  "Omeprazole",
  "Warfarin",
  "Gabapentin",
  "Losartan",
  "Metoprolol",
  "Sertraline",
  "Simvastatin",
]

export function MedicationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [medications, setMedications] = useState<Medication[]>([])

  // Load medications from localStorage
  useEffect(() => {
    if (!user) {
      setMedications([])
      return
    }

    const storedMeds = localStorage.getItem(MEDICATIONS_KEY)
    if (storedMeds) {
      try {
        const allMeds = JSON.parse(storedMeds)
        if (Array.isArray(allMeds)) {
          setMedications(allMeds.filter((m: Medication) => m.userId === user.id))
        } else {
          setMedications([])
        }
      } catch (error) {
        console.error("Failed to parse medications:", error)
        setMedications([])
      }
    }
  }, [user])

  const saveMedications = (meds: Medication[]) => {
    const storedMeds = localStorage.getItem(MEDICATIONS_KEY)
    let allMeds: Medication[] = []
    try {
      allMeds = storedMeds ? JSON.parse(storedMeds) : []
      if (!Array.isArray(allMeds)) allMeds = []
    } catch (error) {
      console.error("Failed to parse stored medications:", error)
      allMeds = []
    }

    // Remove old meds for this user and add new ones
    const otherUserMeds = allMeds.filter((m: Medication) => m.userId !== user?.id)
    const updatedMeds = [...otherUserMeds, ...meds]

    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(updatedMeds))
    setMedications(meds)
  }

  const addMedication = (med: Omit<Medication, "id" | "userId">) => {
    if (!user) return

    const newMed: Medication = {
      ...med,
      id: `med_${Date.now()}`,
      userId: user.id,
      color: med.color || "#3b82f6",
      isPaused: false,
    }

    saveMedications([...medications, newMed])
  }

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    const updatedMeds = medications.map((m) => (m.id === id ? { ...m, ...updates } : m))
    saveMedications(updatedMeds)
  }

  const deleteMedication = (id: string) => {
    const updatedMeds = medications.filter((m) => m.id !== id)
    saveMedications(updatedMeds)
  }

  const getMedication = (id: string) => {
    return medications.find((m) => m.id === id)
  }

  const pauseMedication = (id: string) => {
    updateMedication(id, { isPaused: true })
  }

  const resumeMedication = (id: string) => {
    updateMedication(id, { isPaused: false })
  }

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        getMedication,
        pauseMedication,
        resumeMedication,
      }}
    >
      {children}
    </MedicationContext.Provider>
  )
}

export function useMedications() {
  const context = useContext(MedicationContext)
  if (context === undefined) {
    throw new Error("useMedications must be used within a MedicationProvider")
  }
  return context
}
