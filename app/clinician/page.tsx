"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, AlertTriangle, TrendingUp, Activity, Search, Filter, ChevronRight, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useClinician } from "@/lib/clinician-context"
import { useSymptoms } from "@/lib/symptom-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClinicianDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { patients, getPatientEvents, getPatientNotes, addClinicianNote } = useClinician()
  const { tickets, updateTicketStatus } = useSymptoms()

  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "high_risk" | "low_adherence" | "recent_tickets">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newNote, setNewNote] = useState("")
  const [noteCategory, setNoteCategory] = useState<"observation" | "treatment_plan" | "follow_up" | "general">(
    "general",
  )

  if (user?.role !== "clinician") {
    router.push("/dashboard")
    return null
  }

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "high_risk") return matchesSearch && p.riskLevel === "high"
    if (filter === "low_adherence") return matchesSearch && p.adherenceRate < 70
    if (filter === "recent_tickets") {
      const patientTickets = tickets.filter((t) => t.userId === p.id)
      return matchesSearch && patientTickets.length > 0
    }

    return matchesSearch
  })

  const stats = {
    totalPatients: patients.length,
    avgAdherence: Math.round(patients.reduce((sum, p) => sum + p.adherenceRate, 0) / patients.length),
    highRiskAlerts: patients.filter((p) => p.riskLevel === "high").length,
    openTickets: tickets.filter((t) => t.status === "open").length,
  }

  const selectedPatientData = selectedPatient ? patients.find((p) => p.id === selectedPatient) : null
  const patientEvents = selectedPatient ? getPatientEvents(selectedPatient) : []
  const patientNotes = selectedPatient ? getPatientNotes(selectedPatient) : []
  const patientTickets = selectedPatient ? tickets.filter((t) => t.userId === selectedPatient) : []

  const adherenceChartData = [
    { day: "Mon", rate: 95 },
    { day: "Tue", rate: 88 },
    { day: "Wed", rate: 92 },
    { day: "Thu", rate: 100 },
    { day: "Fri", rate: 94 },
    { day: "Sat", rate: 85 },
    { day: "Sun", rate: 90 },
  ]

  const handleAddNote = () => {
    if (!selectedPatient || !newNote.trim()) return

    addClinicianNote({
      patientId: selectedPatient,
      note: newNote,
      category: noteCategory,
    })

    toast({
      title: "Note Added",
      description: "Clinician note has been saved to patient record.",
    })

    setNewNote("")
  }

  const handleRespondToTicket = (ticketId: string, response: string) => {
    updateTicketStatus(ticketId, "resolved", response)

    toast({
      title: "Response Sent",
      description: "Your response has been sent to the patient.",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Filters & Patient List */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Clinician Portal</h1>
                <p className="text-sm text-slate-600">Dr. {user?.name}</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "high_risk" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("high_risk")}
              >
                High Risk
              </Button>
              <Button
                variant={filter === "low_adherence" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("low_adherence")}
              >
                Low Adherence
              </Button>
              <Button
                variant={filter === "recent_tickets" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("recent_tickets")}
              >
                Recent Tickets
              </Button>
            </div>
          </div>

          {/* Patient List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id)}
                  className={`w-full p-4 rounded-lg text-left transition-colors mb-2 ${
                    selectedPatient === patient.id
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-white border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-500">{patient.age} years old</p>
                    </div>
                    <Badge
                      variant={
                        patient.riskLevel === "high"
                          ? "destructive"
                          : patient.riskLevel === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {patient.riskLevel}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Adherence: {patient.adherenceRate}%</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {patient.conditions.map((condition) => (
                      <span key={condition} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {condition}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!selectedPatient ? (
            // Stats Overview
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Patients</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.totalPatients}</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Avg Adherence</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.avgAdherence}%</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">High Risk Alerts</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.highRiskAlerts}</h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                      <Activity className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Open Tickets</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.openTickets}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Select a patient to view details</CardTitle>
                  <CardDescription>Click on a patient from the left sidebar to see their full profile</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : (
            // Patient Detail View
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">{selectedPatientData?.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-slate-600">{selectedPatientData?.email}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{selectedPatientData?.phone}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="events">Events Timeline</TabsTrigger>
                  <TabsTrigger value="tickets">Advice Tickets</TabsTrigger>
                  <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Adherence Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={adherenceChartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="day" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: "#3b82f6" }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-2xl font-bold text-slate-900">{selectedPatientData?.adherenceRate}%</p>
                          <p className="text-sm text-slate-500">Current adherence rate</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-500">Conditions</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatientData?.conditions.map((condition) => (
                              <Badge key={condition} variant="outline">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Active Medications</p>
                          <p className="text-lg font-semibold text-slate-900">{selectedPatientData?.medicationCount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Risk Level</p>
                          <Badge
                            variant={
                              selectedPatientData?.riskLevel === "high"
                                ? "destructive"
                                : selectedPatientData?.riskLevel === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {selectedPatientData?.riskLevel}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">Last Active</p>
                          <p className="text-sm text-slate-700">
                            {new Date(selectedPatientData?.lastActive || "").toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Events Timeline</CardTitle>
                      <CardDescription>All medication and symptom events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patientEvents.length === 0 ? (
                          <p className="text-slate-500 text-center py-8">No events recorded yet</p>
                        ) : (
                          patientEvents.map((event) => (
                            <div key={event.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                              <div
                                className={`p-2 h-10 w-10 rounded-full ${
                                  event.type === "med_taken"
                                    ? "bg-green-100 text-green-600"
                                    : event.type === "med_missed"
                                      ? "bg-red-100 text-red-600"
                                      : event.type === "symptom_report"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : event.type === "advice_request"
                                          ? "bg-blue-100 text-blue-600"
                                          : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                <Activity className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">{event.details}</p>
                                <p className="text-sm text-slate-500">{new Date(event.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tickets">
                  <Card>
                    <CardHeader>
                      <CardTitle>Advice Tickets</CardTitle>
                      <CardDescription>Patient questions and doctor responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patientTickets.length === 0 ? (
                          <p className="text-slate-500 text-center py-8">No tickets submitted yet</p>
                        ) : (
                          patientTickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 border border-slate-200 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-slate-900">{ticket.subject}</h4>
                                <Badge variant={ticket.status === "resolved" ? "secondary" : "default"}>
                                  {ticket.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>

                              {ticket.aiSuggestion && (
                                <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
                                  <p className="text-xs font-medium text-blue-700 mb-1">AI Suggestion</p>
                                  <p className="text-sm text-slate-700">{ticket.aiSuggestion}</p>
                                </div>
                              )}

                              {ticket.clinicianResponse && (
                                <div className="mb-3 p-3 bg-green-50 rounded border border-green-100">
                                  <p className="text-xs font-medium text-green-700 mb-1">Your Response</p>
                                  <p className="text-sm text-slate-700">{ticket.clinicianResponse}</p>
                                </div>
                              )}

                              {ticket.status !== "resolved" && (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Enter your response..."
                                    id={`response-${ticket.id}`}
                                    className="min-h-[80px]"
                                  />
                                  <Button
                                    onClick={() => {
                                      const textarea = document.getElementById(
                                        `response-${ticket.id}`,
                                      ) as HTMLTextAreaElement
                                      if (textarea?.value) {
                                        handleRespondToTicket(ticket.id, textarea.value)
                                        textarea.value = ""
                                      }
                                    }}
                                    size="sm"
                                  >
                                    Send Response
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes">
                  <Card>
                    <CardHeader>
                      <CardTitle>Clinical Notes</CardTitle>
                      <CardDescription>Add observations and treatment plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                          <Select value={noteCategory} onValueChange={(value: any) => setNoteCategory(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="observation">Observation</SelectItem>
                              <SelectItem value="treatment_plan">Treatment Plan</SelectItem>
                              <SelectItem value="follow_up">Follow-up</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          placeholder="Enter clinical note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {patientNotes.length === 0 ? (
                          <p className="text-slate-500 text-center py-8">No clinical notes yet</p>
                        ) : (
                          patientNotes.map((note) => (
                            <div key={note.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-slate-900">{note.clinicianName}</p>
                                  <p className="text-xs text-slate-500">{new Date(note.timestamp).toLocaleString()}</p>
                                </div>
                                <Badge variant="outline">{note.category}</Badge>
                              </div>
                              <p className="text-sm text-slate-700">{note.note}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
