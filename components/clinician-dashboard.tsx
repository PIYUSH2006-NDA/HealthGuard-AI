"use client"

import { useState } from "react"
import { useClinician, type PatientProfile } from "@/lib/clinician-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  AlertTriangle,
  Search,
  Activity,
  FileText,
  Clock,
  MoreVertical,
  Filter,
  Mail,
  Stethoscope,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ClinicianDashboard() {
  const { patients, events, notes, addClinicianNote, updatePatientRisk } = useClinician()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState("")
  const { toast } = useToast()

  const safePatients = Array.isArray(patients) ? patients : []
  const filteredPatients = safePatients.filter(
    (p) =>
      (p?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const highRiskPatients = safePatients.filter((p) => p.riskLevel === "high")
  const mediumRiskPatients = safePatients.filter((p) => p.riskLevel === "medium")

  const handleAddNote = () => {
    if (!selectedPatient || !newNote.trim()) return

    addClinicianNote({
      patientId: selectedPatient.id,
      note: newNote,
      category: "general",
    })

    toast({
      title: "Note added",
      description: "Clinical note has been saved successfully.",
    })

    setNewNote("")
    setIsNoteDialogOpen(false)
  }

  const safeEvents = Array.isArray(events) ? events : []

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <h3 className="text-2xl font-bold">{safePatients.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Risk</p>
              <h3 className="text-2xl font-bold text-red-600">{highRiskPatients.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
              <h3 className="text-2xl font-bold text-amber-600">{mediumRiskPatients.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Reports</p>
              <h3 className="text-2xl font-bold">
                {
                  safeEvents.filter(
                    (e) =>
                      e.type === "symptom_report" && new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000),
                  ).length
                }
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Manage and monitor your assigned patients</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                      <AvatarFallback>{(patient.name || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name || "Unknown Patient"}</div>
                      <div className="text-sm text-muted-foreground">
                        {Array.isArray(patient.conditions) ? patient.conditions.join(", ") : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <div className="text-sm font-medium">Adherence</div>
                      <div
                        className={`text-sm ${
                          patient.adherenceRate >= 90
                            ? "text-green-600"
                            : patient.adherenceRate >= 75
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {patient.adherenceRate}%
                      </div>
                    </div>

                    <Badge
                      variant={
                        patient.riskLevel === "high"
                          ? "destructive"
                          : patient.riskLevel === "medium"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize w-20 justify-center"
                    >
                      {patient.riskLevel} Risk
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPatient(patient)
                            setIsNoteDialogOpen(true)
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Add Clinical Note
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Risk Level</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updatePatientRisk(patient.id, "low")}>
                          Set Low Risk
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updatePatientRisk(patient.id, "medium")}>
                          Set Medium Risk
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updatePatientRisk(patient.id, "high")}>
                          Set High Risk
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {safeEvents.slice(0, 5).map((event) => {
                  const patient = safePatients.find((p) => p.id === event.patientId)
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div
                        className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                          event.type === "med_missed"
                            ? "bg-red-100 text-red-600"
                            : event.type === "symptom_report"
                              ? "bg-amber-100 text-amber-600"
                              : event.type === "advice_request"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {event.type === "med_missed" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : event.type === "symptom_report" ? (
                          <Activity className="h-4 w-4" />
                        ) : event.type === "advice_request" ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {patient?.name || "Unknown Patient"}
                          <span className="font-normal text-muted-foreground ml-1">
                            {event.type === "med_missed"
                              ? "missed a dose"
                              : event.type === "symptom_report"
                                ? "reported a symptom"
                                : event.type === "advice_request"
                                  ? "requested advice"
                                  : "updated status"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.details}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900">Clinician Tips</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Regularly review high-risk patients' adherence trends. Early intervention prevents complications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Clinical Note</DialogTitle>
            <DialogDescription>
              Add a note to {selectedPatient?.name}'s record. This is visible to other clinicians.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Input value={selectedPatient?.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter clinical observations or treatment notes..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
