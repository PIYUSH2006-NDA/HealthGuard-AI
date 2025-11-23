"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications } from "@/lib/medication-context"
import { useReminders } from "@/lib/reminder-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  Clock,
  Bell,
  BellOff,
  Edit,
  Trash2,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pause,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const DAYS = [
  { short: "sun", full: "Sunday" },
  { short: "mon", full: "Monday" },
  { short: "tue", full: "Tuesday" },
  { short: "wed", full: "Wednesday" },
  { short: "thu", full: "Thursday" },
  { short: "fri", full: "Friday" },
  { short: "sat", full: "Saturday" },
]

const PRESET_TIMES = [
  { label: "Morning (8:00 AM)", value: "08:00" },
  { label: "Noon (12:00 PM)", value: "12:00" },
  { label: "Afternoon (3:00 PM)", value: "15:00" },
  { label: "Evening (6:00 PM)", value: "18:00" },
  { label: "Night (9:00 PM)", value: "21:00" },
]

export default function SchedulePage() {
  const { user, isAuthenticated } = useAuth()
  const { medications } = useMedications()
  const { reminders, addReminder, updateReminder, deleteReminder, toggleReminder } = useReminders()
  const router = useRouter()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "day">("week")
  const [snoozedReminders, setSnoozedReminders] = useState<Record<string, Date>>({})

  const [formData, setFormData] = useState({
    medicationId: "",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const medication = medications.find((m) => m.id === formData.medicationId)
    if (!medication) return

    if (editingReminder) {
      updateReminder(editingReminder, {
        medicationId: formData.medicationId,
        medicationName: medication.name,
        time: formData.time,
        days: formData.days,
        color: medication.color,
      })
      toast({ title: "Reminder updated", description: "Your reminder has been updated successfully." })
    } else {
      addReminder({
        medicationId: formData.medicationId,
        medicationName: medication.name,
        time: formData.time,
        days: formData.days,
        isEnabled: true,
        color: medication.color,
      })
      toast({ title: "Reminder created", description: "Your reminder has been created successfully." })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      medicationId: "",
      time: "08:00",
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    })
    setEditingReminder(null)
  }

  const handleEdit = (reminderId: string) => {
    const reminder = reminders.find((r) => r.id === reminderId)
    if (reminder) {
      setFormData({
        medicationId: reminder.medicationId,
        time: reminder.time,
        days: reminder.days,
      })
      setEditingReminder(reminderId)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (reminderId: string) => {
    if (confirm("Are you sure you want to delete this reminder?")) {
      deleteReminder(reminderId)
      toast({ title: "Reminder deleted", description: "Your reminder has been removed." })
    }
  }

  const handleSnooze = (reminderId: string, minutes: number) => {
    const snoozeUntil = new Date()
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes)
    setSnoozedReminders((prev) => ({ ...prev, [reminderId]: snoozeUntil }))
    toast({
      title: "Reminder snoozed",
      description: `Snoozed for ${minutes} minutes`,
    })
  }

  const handleReschedule = (reminderId: string, newTime: string) => {
    const reminder = reminders.find((r) => r.id === reminderId)
    if (!reminder) return

    updateReminder(reminderId, {
      ...reminder,
      time: newTime,
    })
    toast({
      title: "Reminder rescheduled",
      description: `Updated to ${newTime}`,
    })
  }

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const getRemindersForDay = (dayIndex: number) => {
    const dayShort = DAYS[dayIndex].short
    return reminders
      .filter((r) => r.days.includes(dayShort) && r.isEnabled)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView(view === "week" ? "day" : "week")}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {view === "week" ? "Day View" : "Week View"}
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingReminder ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
                  <DialogDescription>
                    {editingReminder ? "Update your reminder settings" : "Set up a new medication reminder"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Select
                      value={formData.medicationId}
                      onValueChange={(value) => setFormData({ ...formData, medicationId: value })}
                      required
                    >
                      <SelectTrigger id="medication">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {medications
                          .filter((m) => !m.isPaused)
                          .map((med) => (
                            <SelectItem key={med.id} value={med.id}>
                              {med.name} - {med.dosage}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger id="time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRESET_TIMES.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Repeat on</Label>
                    <div className="flex gap-2">
                      {DAYS.map((day) => (
                        <button
                          key={day.short}
                          type="button"
                          onClick={() => toggleDay(day.short)}
                          className={`h-10 w-10 rounded-full text-xs font-medium transition-colors ${
                            formData.days.includes(day.short)
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                          }`}
                        >
                          {day.short.charAt(0).toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.medicationId || formData.days.length === 0}>
                      {editingReminder ? "Update" : "Create"} Reminder
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medication Schedule</CardTitle>
                <CardDescription>
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentDate)
                    newDate.setDate(currentDate.getDate() - 7)
                    setCurrentDate(newDate)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(currentDate)
                    newDate.setDate(currentDate.getDate() + 7)
                    setCurrentDate(newDate)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const dayReminders = getRemindersForDay(date.getDay())
                const isToday = date.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${isToday ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : "bg-white dark:bg-slate-800"}`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-xs font-medium text-muted-foreground">
                        {DAYS[date.getDay()].full.slice(0, 3)}
                      </div>
                      <div
                        className={`text-2xl font-bold ${isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"}`}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {dayReminders.map((reminder) => {
                        const isSnoozed = snoozedReminders[reminder.id]
                        return (
                          <Popover key={reminder.id}>
                            <PopoverTrigger asChild>
                              <div
                                className={`p-2 rounded text-xs cursor-pointer hover:shadow-md transition-all ${isSnoozed ? "opacity-50" : ""}`}
                                style={{
                                  backgroundColor: reminder.color + "20",
                                  borderLeft: `3px solid ${reminder.color}`,
                                }}
                              >
                                <div className="font-medium truncate">{reminder.medicationName}</div>
                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {reminder.time}
                                  {isSnoozed && <Pause className="h-3 w-3 ml-1" />}
                                </div>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2">
                              <div className="space-y-2">
                                <div className="font-medium text-sm">{reminder.medicationName}</div>
                                <div className="space-y-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full justify-start text-xs bg-transparent"
                                    onClick={() => handleSnooze(reminder.id, 15)}
                                  >
                                    <Pause className="h-3 w-3 mr-2" />
                                    Snooze 15 min
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full justify-start text-xs bg-transparent"
                                    onClick={() => handleSnooze(reminder.id, 30)}
                                  >
                                    <Pause className="h-3 w-3 mr-2" />
                                    Snooze 30 min
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full justify-start text-xs bg-transparent"
                                    onClick={() => handleEdit(reminder.id)}
                                  >
                                    <Edit className="h-3 w-3 mr-2" />
                                    Edit reminder
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reminder List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reminders</CardTitle>
            <CardDescription>Manage your medication reminders</CardDescription>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reminders set</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first reminder to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => {
                  const isSnoozed = snoozedReminders[reminder.id]
                  return (
                    <div
                      key={reminder.id}
                      className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${isSnoozed ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: reminder.color }}
                        >
                          {reminder.isEnabled ? (
                            <Bell className="h-5 w-5 text-white" />
                          ) : (
                            <BellOff className="h-5 w-5 text-white opacity-50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {reminder.medicationName}
                            {isSnoozed && (
                              <span className="text-xs text-orange-600 dark:text-orange-400">
                                (Snoozed until{" "}
                                {snoozedReminders[reminder.id].toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                )
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {reminder.time}
                            <span className="text-xs">•</span>
                            {reminder.days.map((d) => d.toUpperCase()).join(", ")}
                          </div>
                        </div>
                        <Switch checked={reminder.isEnabled} onCheckedChange={() => toggleReminder(reminder.id)} />
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" title="Quick actions">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="space-y-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full justify-start text-xs"
                                onClick={() => handleSnooze(reminder.id, 15)}
                              >
                                <Pause className="h-3 w-3 mr-2" />
                                Snooze 15 min
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full justify-start text-xs"
                                onClick={() => handleEdit(reminder.id)}
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-full justify-start text-xs text-destructive"
                                onClick={() => handleDelete(reminder.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
