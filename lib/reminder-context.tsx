"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Reminder {
  id: string
  userId: string
  medicationId: string
  medicationName: string
  time: string
  days: string[] // ["mon", "tue", "wed", etc.]
  isEnabled: boolean
  snoozeMinutes?: number
  lastTriggered?: string
  color?: string
}

interface ReminderContextType {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, "id" | "userId">) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
  deleteReminder: (id: string) => void
  snoozeReminder: (id: string, minutes: number) => void
  toggleReminder: (id: string) => void
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined)

const REMINDERS_KEY = "medibuddy_reminders"

export function ReminderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => {
    if (!user) {
      setReminders([])
      return
    }

    const storedReminders = localStorage.getItem(REMINDERS_KEY)
    if (storedReminders) {
      const allReminders = JSON.parse(storedReminders)
      setReminders(allReminders.filter((r: Reminder) => r.userId === user.id))
    }
  }, [user])

  const saveReminders = (rems: Reminder[]) => {
    const storedReminders = localStorage.getItem(REMINDERS_KEY)
    const allReminders = storedReminders ? JSON.parse(storedReminders) : []

    const otherUserReminders = allReminders.filter((r: Reminder) => r.userId !== user?.id)
    const updatedReminders = [...otherUserReminders, ...rems]

    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders))
    setReminders(rems)
  }

  const addReminder = (reminder: Omit<Reminder, "id" | "userId">) => {
    if (!user) return

    const newReminder: Reminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      userId: user.id,
      isEnabled: true,
    }

    saveReminders([...reminders, newReminder])
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map((r) => (r.id === id ? { ...r, ...updates } : r))
    saveReminders(updatedReminders)
  }

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter((r) => r.id !== id)
    saveReminders(updatedReminders)
  }

  const snoozeReminder = (id: string, minutes: number) => {
    updateReminder(id, {
      snoozeMinutes: minutes,
      lastTriggered: new Date().toISOString(),
    })
  }

  const toggleReminder = (id: string) => {
    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      updateReminder(id, { isEnabled: !reminder.isEnabled })
    }
  }

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        snoozeReminder,
        toggleReminder,
      }}
    >
      {children}
    </ReminderContext.Provider>
  )
}

export function useReminders() {
  const context = useContext(ReminderContext)
  if (context === undefined) {
    throw new Error("useReminders must be used within a ReminderProvider")
  }
  return context
}
