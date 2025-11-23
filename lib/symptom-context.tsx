"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Symptom {
  id: string
  userId: string
  symptomName: string
  severity: "mild" | "moderate" | "severe"
  description: string
  timestamp: string
  relatedMedications?: string[]
  vitalSigns?: {
    temperature?: string
    bloodPressure?: string
    heartRate?: string
  }
}

export interface AdviceTicket {
  id: string
  userId: string
  patientName: string
  subject: string
  description: string
  symptoms: string[]
  medications: string[]
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  timestamp: string
  clinicianResponse?: string
  aiSuggestion?: string
  thread?: TicketMessage[]
}

export interface TicketMessage {
  id: string
  sender: "patient" | "clinician" | "ai"
  senderName: string
  message: string
  timestamp: string
}

interface SymptomContextType {
  symptoms: Symptom[]
  tickets: AdviceTicket[]
  addSymptom: (symptom: Omit<Symptom, "id" | "userId" | "timestamp">) => void
  createTicket: (ticket: Omit<AdviceTicket, "id" | "userId" | "timestamp" | "status">) => void
  updateTicketStatus: (id: string, status: AdviceTicket["status"], response?: string) => void
  addReplyToTicket: (ticketId: string, message: string, sender: "patient" | "clinician") => void
}

const SymptomContext = createContext<SymptomContextType | undefined>(undefined)

const SYMPTOMS_KEY = "medibuddy_symptoms"
const TICKETS_KEY = "medibuddy_tickets"

export const COMMON_SYMPTOMS = [
  "Headache",
  "Dizziness",
  "Nausea",
  "Fatigue",
  "Fever",
  "Chest Pain",
  "Shortness of Breath",
  "Abdominal Pain",
  "Rash",
  "Muscle Pain",
  "Joint Pain",
  "Insomnia",
  "Anxiety",
  "Depression",
]

export function SymptomProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [tickets, setTickets] = useState<AdviceTicket[]>([])

  useEffect(() => {
    if (!user) {
      setSymptoms([])
      setTickets([])
      return
    }

    const storedSymptoms = localStorage.getItem(SYMPTOMS_KEY)
    if (storedSymptoms) {
      try {
        const allSymptoms = JSON.parse(storedSymptoms)
        if (Array.isArray(allSymptoms)) {
          setSymptoms(allSymptoms.filter((s: Symptom) => s.userId === user.id))
        } else {
          setSymptoms([])
        }
      } catch (error) {
        console.error("Failed to parse symptoms:", error)
        setSymptoms([])
      }
    }

    const storedTickets = localStorage.getItem(TICKETS_KEY)
    if (storedTickets) {
      try {
        const allTickets = JSON.parse(storedTickets)
        if (Array.isArray(allTickets)) {
          setTickets(allTickets.filter((t: AdviceTicket) => t.userId === user.id || user.role === "clinician"))
        } else {
          setTickets([])
        }
      } catch (error) {
        console.error("Failed to parse tickets:", error)
        setTickets([])
      }
    }
  }, [user])

  const saveSymptoms = (symp: Symptom[]) => {
    const storedSymptoms = localStorage.getItem(SYMPTOMS_KEY)
    let allSymptoms: Symptom[] = []
    try {
      allSymptoms = storedSymptoms ? JSON.parse(storedSymptoms) : []
      if (!Array.isArray(allSymptoms)) allSymptoms = []
    } catch (error) {
      console.error("Failed to parse stored symptoms:", error)
      allSymptoms = []
    }

    const otherUserSymptoms = allSymptoms.filter((s: Symptom) => s.userId !== user?.id)
    const updatedSymptoms = [...otherUserSymptoms, ...symp]

    localStorage.setItem(SYMPTOMS_KEY, JSON.stringify(updatedSymptoms))
    setSymptoms(symp)
  }

  const saveTickets = (tix: AdviceTicket[]) => {
    const storedTickets = localStorage.getItem(TICKETS_KEY)
    let allTickets: AdviceTicket[] = []
    try {
      allTickets = storedTickets ? JSON.parse(storedTickets) : []
      if (!Array.isArray(allTickets)) allTickets = []
    } catch (error) {
      console.error("Failed to parse stored tickets:", error)
      allTickets = []
    }

    const otherUserTickets = allTickets.filter((t: AdviceTicket) => t.userId !== user?.id)
    const updatedTickets = [...otherUserTickets, ...tix]

    localStorage.setItem(TICKETS_KEY, JSON.stringify(updatedTickets))
    setTickets(updatedTickets)
  }

  const addSymptom = (symptom: Omit<Symptom, "id" | "userId" | "timestamp">) => {
    if (!user) return

    const newSymptom: Symptom = {
      ...symptom,
      id: `symptom_${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
    }

    saveSymptoms([newSymptom, ...symptoms])
  }

  const createTicket = (ticket: Omit<AdviceTicket, "id" | "userId" | "timestamp" | "status">) => {
    if (!user) return

    const newTicket: AdviceTicket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      status: "open",
      aiSuggestion:
        "AI Suggestion: Based on your symptoms and medication history, consider monitoring these symptoms closely. If they persist or worsen, contact your healthcare provider immediately.",
      thread: [
        {
          id: `msg_${Date.now()}`,
          sender: "patient",
          senderName: user.name,
          message: ticket.description,
          timestamp: new Date().toISOString(),
        },
      ],
    }

    const allTickets = [...tickets, newTicket]
    saveTickets(allTickets)
  }

  const addReplyToTicket = (ticketId: string, message: string, sender: "patient" | "clinician") => {
    if (!user) return

    const updatedTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        const newMessage: TicketMessage = {
          id: `msg_${Date.now()}`,
          sender,
          senderName: sender === "patient" ? user.name : "Dr. Smith",
          message,
          timestamp: new Date().toISOString(),
        }

        return {
          ...t,
          thread: [...(t.thread || []), newMessage],
          status: sender === "clinician" ? ("in-progress" as const) : t.status,
        }
      }
      return t
    })

    saveTickets(updatedTickets)
  }

  const updateTicketStatus = (id: string, status: AdviceTicket["status"], response?: string) => {
    if (!user) return

    const updatedTickets = tickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status,
          clinicianResponse: response,
        }
      }
      return t
    })

    saveTickets(updatedTickets)
  }

  return (
    <SymptomContext.Provider
      value={{
        symptoms,
        tickets,
        addSymptom,
        createTicket,
        updateTicketStatus,
        addReplyToTicket,
      }}
    >
      {children}
    </SymptomContext.Provider>
  )
}

export function useSymptoms() {
  const context = useContext(SymptomContext)
  if (context === undefined) {
    throw new Error("useSymptoms must be used within a SymptomProvider")
  }
  return context
}
