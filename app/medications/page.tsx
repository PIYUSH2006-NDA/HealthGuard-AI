"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications, COMMON_MEDICATIONS } from "@/lib/medication-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Pause, Play, Pill, Clock, AlertTriangle, Calendar, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function MedicationsPage() {
  const { user, isAuthenticated } = useAuth()
  const { medications, addMedication, updateMedication, deleteMedication, pauseMedication, resumeMedication } =
    useMedications()
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMed, setEditingMed] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    schedule: "08:00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
    color: "#3b82f6",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMeds, setFilteredMeds] = useState(COMMON_MEDICATIONS)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // ... existing useEffect for search ...
  useEffect(() => {
    const filtered = COMMON_MEDICATIONS.filter((med) => med.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredMeds(filtered)
  }, [searchTerm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMed) {
      updateMedication(editingMed, formData)
      toast({ title: "Medication updated", description: "Your medication has been updated successfully." })
    } else {
      addMedication(formData)
      toast({ title: "Medication added", description: "Your medication has been added successfully." })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      frequency: "daily",
      schedule: "08:00",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
      color: "#3b82f6",
    })
    setEditingMed(null)
    setSearchTerm("")
  }

  const handleEdit = (medId: string) => {
    const med = medications.find((m) => m.id === medId)
    if (med) {
      setFormData({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        schedule: med.schedule,
        startDate: med.startDate,
        endDate: med.endDate || "",
        notes: med.notes || "",
        color: med.color || "#3b82f6",
      })
      setEditingMed(medId)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (medId: string) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      deleteMedication(medId)
      toast({ title: "Medication deleted", description: "Your medication has been removed." })
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="shadow-md shadow-blue-500/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMed ? "Edit Medication" : "Add New Medication"}</DialogTitle>
                <DialogDescription>
                  {editingMed ? "Update your medication details" : "Add a new medication to your schedule"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medication Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        setSearchTerm(e.target.value)
                      }}
                      placeholder="Start typing..."
                      required
                      list="medication-suggestions"
                      className="pl-9"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  {searchTerm && filteredMeds.length > 0 && (
                    <div className="border rounded-md bg-popover shadow-md max-h-32 overflow-y-auto z-50">
                      {filteredMeds.slice(0, 5).map((med) => (
                        <button
                          key={med}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, name: med })
                            setSearchTerm("")
                          }}
                        >
                          {med}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 10mg, 2 tablets"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice-daily">Twice Daily</SelectItem>
                      <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Preferred Time</Label>
                  <div className="relative">
                    <Input
                      id="schedule"
                      type="time"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      required
                      className="pl-9"
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color Tag</Label>
                  <div className="flex gap-2">
                    {["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === color ? "border-slate-900 dark:border-white scale-110 ring-2 ring-offset-2 ring-offset-background ring-blue-500" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Special instructions, side effects to watch for, etc."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingMed ? "Update" : "Add"} Medication</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Medications</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your current prescriptions and schedule</p>
        </div>

        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards">
          {medications.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <Pill className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">No medications yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
                  Add your first medication to start tracking your daily doses and adherence.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} size="lg" className="shadow-lg shadow-blue-500/20">
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            medications.map((med) => (
              <Card
                key={med.id}
                className={`group hover:shadow-md transition-all duration-300 border-l-4 overflow-hidden ${med.isPaused ? "opacity-70 grayscale-[0.5]" : ""}`}
                style={{ borderLeftColor: med.color }}
              >
                <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: med.color }}
                      >
                        <Pill className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {med.name}
                          {med.isPaused && (
                            <Badge variant="secondary" className="text-xs font-normal">
                              Paused
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 font-medium text-slate-500 dark:text-slate-400">
                          {med.dosage}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => (med.isPaused ? resumeMedication(med.id) : pauseMedication(med.id))}
                        title={med.isPaused ? "Resume" : "Pause"}
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        {med.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(med.id)}
                        title="Edit"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(med.id)}
                        title="Delete"
                        className="h-8 w-8 text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{med.frequency}</div>
                        <div className="text-muted-foreground text-xs">at {med.schedule}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">Duration</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(med.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} -{" "}
                          {med.endDate
                            ? new Date(med.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            : "Ongoing"}
                        </div>
                      </div>
                    </div>
                    {med.interactions && med.interactions.length > 0 && (
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <div>
                          <div className="font-medium text-amber-900 dark:text-amber-200">Interaction</div>
                          <div
                            className="text-amber-700 dark:text-amber-400 text-xs truncate max-w-[120px]"
                            title={med.interactions.join(", ")}
                          >
                            {med.interactions.join(", ")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {med.notes && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800/50">
                      <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{med.notes}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
