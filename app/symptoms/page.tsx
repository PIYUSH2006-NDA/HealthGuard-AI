"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications } from "@/lib/medication-context"
import { useSymptoms, COMMON_SYMPTOMS } from "@/lib/symptom-context"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, Plus, Activity } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function SymptomsPage() {
  const { user, isAuthenticated } = useAuth()
  const { medications } = useMedications()
  const { symptoms, addSymptom } = useSymptoms()
  const { addNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    symptomName: "",
    severity: "mild" as "mild" | "moderate" | "severe",
    description: "",
    relatedMedications: [] as string[],
    temperature: "",
    bloodPressure: "",
    heartRate: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSymptoms, setFilteredSymptoms] = useState(COMMON_SYMPTOMS)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const filtered = COMMON_SYMPTOMS.filter((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredSymptoms(filtered)
  }, [searchTerm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const symptom = {
      symptomName: formData.symptomName,
      severity: formData.severity,
      description: formData.description,
      relatedMedications: formData.relatedMedications,
      vitalSigns: {
        temperature: formData.temperature || undefined,
        bloodPressure: formData.bloodPressure || undefined,
        heartRate: formData.heartRate || undefined,
      },
    }

    addSymptom(symptom)

    // Create notification for high severity symptoms
    if (formData.severity === "severe") {
      addNotification({
        type: "triage_escalation",
        title: "Severe Symptom Reported",
        message: `${formData.symptomName} - ${formData.description}`,
        severity: "high",
        metadata: {
          medicationName: formData.symptomName,
        },
      })
    }

    toast({
      title: "Symptom logged",
      description:
        formData.severity === "severe"
          ? "Your symptom has been logged and a high-priority alert has been created."
          : "Your symptom has been logged successfully.",
    })

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      symptomName: "",
      severity: "mild",
      description: "",
      relatedMedications: [],
      temperature: "",
      bloodPressure: "",
      heartRate: "",
    })
    setSearchTerm("")
  }

  const toggleMedication = (medId: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedMedications: prev.relatedMedications.includes(medId)
        ? prev.relatedMedications.filter((m) => m !== medId)
        : [...prev.relatedMedications, medId],
    }))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{symptoms.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  symptoms.filter((s) => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return new Date(s.timestamp) > weekAgo
                  }).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Severe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {symptoms.filter((s) => s.severity === "severe").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Log New Symptom</CardTitle>
            <CardDescription>Track your symptoms to help your healthcare provider</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptom">Symptom</Label>
                <Input
                  id="symptom"
                  value={formData.symptomName}
                  onChange={(e) => {
                    setFormData({ ...formData, symptomName: e.target.value })
                    setSearchTerm(e.target.value)
                  }}
                  placeholder="Start typing..."
                  required
                />
                {searchTerm && filteredSymptoms.length > 0 && (
                  <div className="border rounded-md bg-white shadow-sm max-h-32 overflow-y-auto">
                    {filteredSymptoms.slice(0, 5).map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm"
                        onClick={() => {
                          setFormData({ ...formData, symptomName: symptom })
                          setSearchTerm("")
                        }}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild - Minor discomfort</SelectItem>
                    <SelectItem value="moderate">Moderate - Noticeable but manageable</SelectItem>
                    <SelectItem value="severe">Severe - Requires immediate attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your symptom in detail..."
                  rows={3}
                  required
                />
              </div>

              {medications.length > 0 && (
                <div className="space-y-2">
                  <Label>Related Medications (Optional)</Label>
                  <div className="space-y-2">
                    {medications.slice(0, 5).map((med) => (
                      <div key={med.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`med-${med.id}`}
                          checked={formData.relatedMedications.includes(med.id)}
                          onCheckedChange={() => toggleMedication(med.id)}
                        />
                        <Label htmlFor={`med-${med.id}`} className="text-sm font-normal cursor-pointer">
                          {med.name} - {med.dosage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Vital Signs (Optional)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Input
                      placeholder="Temp (°F)"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="BP (120/80)"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="HR (bpm)"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Symptom
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Symptom History</CardTitle>
            <CardDescription>Your recently logged symptoms</CardDescription>
          </CardHeader>
          <CardContent>
            {symptoms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No symptoms logged yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {symptoms.slice(0, 10).map((symptom) => (
                  <div key={symptom.id} className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          className={`h-5 w-5 ${
                            symptom.severity === "severe"
                              ? "text-red-600"
                              : symptom.severity === "moderate"
                                ? "text-amber-600"
                                : "text-blue-600"
                          }`}
                        />
                        <h3 className="font-semibold">{symptom.symptomName}</h3>
                      </div>
                      <Badge
                        variant={
                          symptom.severity === "severe"
                            ? "destructive"
                            : symptom.severity === "moderate"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {symptom.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{symptom.description}</p>
                    {symptom.vitalSigns && (
                      <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                        {symptom.vitalSigns.temperature && <span>Temp: {symptom.vitalSigns.temperature}°F</span>}
                        {symptom.vitalSigns.bloodPressure && <span>BP: {symptom.vitalSigns.bloodPressure}</span>}
                        {symptom.vitalSigns.heartRate && <span>HR: {symptom.vitalSigns.heartRate} bpm</span>}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">{new Date(symptom.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
