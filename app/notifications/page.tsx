"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  AlertCircle,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const NOTIFICATION_ICONS = {
  reminder: Bell,
  missed_dose: AlertCircle,
  interaction_alert: AlertTriangle,
  triage_escalation: Heart,
  caregiver_request: Info,
  doctor_advice: Info,
  system: Info,
}

const SEVERITY_COLORS = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const { notifications, markAsRead, markAsAcknowledged, markAllAsRead, deleteNotification, clearAll } =
    useNotifications()
  const router = useRouter()
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead
    if (filter === "high") return n.severity === "high"
    return true
  })

  const handleAcknowledge = (id: string) => {
    markAsAcknowledged(id)
    toast({ title: "Acknowledged", description: "Notification has been acknowledged." })
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    toast({ title: "Deleted", description: "Notification has been removed." })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to clear all notifications?")) {
                  clearAll()
                  toast({ title: "Cleared", description: "All notifications have been removed." })
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Stay updated on your medications and health alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({notifications.filter((n) => !n.isRead).length})</TabsTrigger>
                <TabsTrigger value="high">
                  High Priority ({notifications.filter((n) => n.severity === "high").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread" ? "You're all caught up!" : "You don't have any notifications yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type]
              return (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? "border-l-4 border-l-blue-600 bg-blue-50/50" : ""
                  }`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_COLORS[notification.severity]}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{notification.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            {notification.isAcknowledged && (
                              <Badge variant="outline" className="text-xs">
                                Acknowledged
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>

                          <div className="flex gap-2">
                            {!notification.isAcknowledged && notification.severity !== "low" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAcknowledge(notification.id)
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            {notification.actionUrl && (
                              <Link href={notification.actionUrl}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(notification.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {notification.metadata?.medicationName && (
                          <div className="mt-2 p-2 bg-slate-100 rounded text-xs">
                            <strong>Medication:</strong> {notification.metadata.medicationName}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
