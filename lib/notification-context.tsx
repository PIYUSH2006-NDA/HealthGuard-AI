"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export type NotificationType =
  | "reminder"
  | "missed_dose"
  | "interaction_alert"
  | "triage_escalation"
  | "caregiver_request"
  | "doctor_advice"
  | "system"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  isRead: boolean
  isAcknowledged: boolean
  severity: "low" | "medium" | "high"
  actionUrl?: string
  metadata?: {
    medicationId?: string
    medicationName?: string
    caregiverId?: string
    ticketId?: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (
    notification: Omit<Notification, "id" | "userId" | "timestamp" | "isRead" | "isAcknowledged">,
  ) => void
  markAsRead: (id: string) => void
  markAsAcknowledged: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const NOTIFICATIONS_KEY = "medibuddy_notifications"

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY)
    if (storedNotifications) {
      const allNotifications = JSON.parse(storedNotifications)
      setNotifications(allNotifications.filter((n: Notification) => n.userId === user.id))
    }
  }, [user])

  const saveNotifications = (notifs: Notification[]) => {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY)
    const allNotifications = storedNotifications ? JSON.parse(storedNotifications) : []

    const otherUserNotifications = allNotifications.filter((n: Notification) => n.userId !== user?.id)
    const updatedNotifications = [...otherUserNotifications, ...notifs]

    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications))
    setNotifications(notifs)
  }

  const addNotification = (
    notification: Omit<Notification, "id" | "userId" | "timestamp" | "isRead" | "isAcknowledged">,
  ) => {
    if (!user) return

    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      userId: user.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      isAcknowledged: false,
    }

    saveNotifications([newNotification, ...notifications])
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    saveNotifications(updatedNotifications)
  }

  const markAsAcknowledged = (id: string) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, isAcknowledged: true, isRead: true } : n,
    )
    saveNotifications(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }))
    saveNotifications(updatedNotifications)
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((n) => n.id !== id)
    saveNotifications(updatedNotifications)
  }

  const clearAll = () => {
    saveNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAsAcknowledged,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
