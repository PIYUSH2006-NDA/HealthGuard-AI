"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useMedications } from "./medication-context"

export interface Precaution {
  id: string
  medicationId: string
  medicationName: string
  type: "food" | "activity" | "other"
  description: string
  severity: "low" | "medium" | "high"
}

interface PrecautionContextType {
  precautions: Precaution[]
  addPrecaution: (precaution: Omit<Precaution, "id">) => void
  deletePrecaution: (id: string) => void
  getPrecautionsByMedication: (medicationId: string) => Precaution[]
}

const PrecautionContext = createContext<PrecautionContextType | undefined>(undefined)

const PRECAUTIONS_KEY = "medibuddy_precautions"

// Default precautions database for common medications
const DEFAULT_PRECAUTIONS: Omit<Precaution, "id" | "medicationId" | "medicationName">[] = [
  {
    type: "food",
    description: "Avoid grapefruit and grapefruit juice",
    severity: "high",
  },
  {
    type: "activity",
    description: "May cause drowsiness, avoid driving",
    severity: "medium",
  },
  {
    type: "food",
    description: "Take with food to prevent stomach upset",
    severity: "low",
  },
  {
    type: "other",
    description: "Avoid prolonged sun exposure",
    severity: "medium",
  },
  {
    type: "food",
    description: "Avoid alcohol",
    severity: "high",
  },
]

export function PrecautionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { medications } = useMedications()
  const [precautions, setPrecautions] = useState<Precaution[]>([])

  // Load precautions from localStorage
  useEffect(() => {
    if (!user) {
      setPrecautions([])
      return
    }

    const storedPrecautions = localStorage.getItem(PRECAUTIONS_KEY)
    if (storedPrecautions) {
      try {
        const parsedPrecautions = JSON.parse(storedPrecautions)
        if (Array.isArray(parsedPrecautions)) {
          setPrecautions(parsedPrecautions)
        } else {
          setPrecautions([])
        }
      } catch (error) {
        console.error("Failed to parse precautions:", error)
        setPrecautions([])
      }
    } else {
      // Initialize with some defaults for existing medications if empty
      const initialPrecautions: Precaution[] = []
      medications.forEach((med) => {
        // Add a random precaution for demo purposes
        const randomPrecaution = DEFAULT_PRECAUTIONS[Math.floor(Math.random() * DEFAULT_PRECAUTIONS.length)]
        initialPrecautions.push({
          ...randomPrecaution,
          id: `prec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          medicationId: med.id,
          medicationName: med.name,
        })
      })

      if (initialPrecautions.length > 0) {
        localStorage.setItem(PRECAUTIONS_KEY, JSON.stringify(initialPrecautions))
        setPrecautions(initialPrecautions)
      }
    }
  }, [user, medications.length]) // Re-run when medications change to ensure sync

  const savePrecautions = (newPrecautions: Precaution[]) => {
    localStorage.setItem(PRECAUTIONS_KEY, JSON.stringify(newPrecautions))
    setPrecautions(newPrecautions)
  }

  const addPrecaution = (precaution: Omit<Precaution, "id">) => {
    const newPrecaution: Precaution = {
      ...precaution,
      id: `prec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    savePrecautions([...precautions, newPrecaution])
  }

  const deletePrecaution = (id: string) => {
    const updatedPrecautions = precautions.filter((p) => p.id !== id)
    savePrecautions(updatedPrecautions)
  }

  const getPrecautionsByMedication = (medicationId: string) => {
    return precautions.filter((p) => p.medicationId === medicationId)
  }

  return (
    <PrecautionContext.Provider
      value={{
        precautions,
        addPrecaution,
        deletePrecaution,
        getPrecautionsByMedication,
      }}
    >
      {children}
    </PrecautionContext.Provider>
  )
}

export function usePrecautions() {
  const context = useContext(PrecautionContext)
  if (context === undefined) {
    throw new Error("usePrecautions must be used within a PrecautionProvider")
  }
  return context
}
