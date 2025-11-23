"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications } from "@/lib/medication-context"
import { usePrecautions } from "@/lib/precaution-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Shield,
  Plus,
  Trash2,
  AlertTriangle,
  Utensils,
  Activity,
  Info,
  Search,
  Pill,
  AlertCircle,
  Loader2,
  Baby,
  User,
  UserPlus,
  Stethoscope,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface MedPrecautionData {
  name: string
  precautions: string[]
  dosage_by_age: {
    child: string
    adult: string
    elderly: string
  }
  purpose: string
  warnings: string[]
  side_effects?: string[]
  interactions?: string[]
}

export default function PrecautionsPage() {
  const { user, isAuthenticated } = useAuth()
  const { medications, addMedication } = useMedications()
  const { precautions, addPrecaution, deletePrecaution } = usePrecautions()
  const router = useRouter()
  const { toast } = useToast()

  // Existing state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    medicationId: "",
    type: "food" as "food" | "activity" | "other",
    description: "",
    severity: "medium" as "low" | "medium" | "high",
  })

  // New search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResult, setSearchResult] = useState<MedPrecautionData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setSearchResult(null)
    setSearchError("")

    try {
      const response = await fetch(`/api/medicine/precautions?name=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError("Medication not found. Try 'Aspirin', 'Ibuprofen', 'Lisinopril', etc.")
        } else {
          setSearchError("An error occurred while searching.")
        }
        return
      }
      const data = await response.json()
      setSearchResult(data)
    } catch (error) {
      setSearchError("Failed to search for medication.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddToMeds = () => {
    if (!searchResult) return

    addMedication({
      name: searchResult.name,
      dosage: searchResult.dosage_by_age.adult, // Default to adult dosage
      frequency: "Daily", // Default
      schedule: "09:00", // Default
      startDate: new Date().toISOString().split("T")[0],
      notes: `Purpose: ${searchResult.purpose}`,
      interactions: searchResult.warnings,
    })

    toast({
      title: "Medication Added",
      description: `${searchResult.name} has been added to your medications list.`,
    })

    router.push("/medications")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const medication = medications.find((m) => m.id === formData.medicationId)
    if (!medication) return

    addPrecaution({
      medicationId: formData.medicationId,
      medicationName: medication.name,
      type: formData.type,
      description: formData.description,
      severity: formData.severity,
    })

    toast({
      title: "Precaution added",
      description: "New safety precaution has been added successfully.",
    })

    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      medicationId: "",
      type: "food",
      description: "",
      severity: "medium",
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this precaution?")) {
      deletePrecaution(id)
      toast({
        title: "Precaution deleted",
        description: "Safety precaution has been removed.",
      })
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "food":
        return <Utensils className="h-4 w-4" />
      case "activity":
        return <Activity className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getColorForSeverity = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          {/* ... existing dialog code ... */}
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
                Add Custom Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Safety Precaution</DialogTitle>
                <DialogDescription>Add a new safety warning or precaution for your medications.</DialogDescription>
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
                      {medications.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="activity">Activity / Lifestyle</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value: any) => setFormData({ ...formData, severity: value })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Informational</SelectItem>
                      <SelectItem value="medium">Medium - Caution</SelectItem>
                      <SelectItem value="high">High - Important Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Avoid grapefruit juice while taking this medication"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!formData.medicationId}>
                    Add Precaution
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Medicine Precautions & Dosage</h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Search for medications to check safety guidelines, dosage recommendations, and warnings before adding
                them to your schedule.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto overflow-hidden border-blue-100 dark:border-blue-900 shadow-md">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter medication name (e.g., Aspirin, Ibuprofen)..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </Button>
                </form>

                {searchError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {searchError}
                  </div>
                )}

                {searchResult && (
                  <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start justify-between border-b pb-4 mb-6">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                          <Pill className="h-8 w-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {searchResult.name}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="mt-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 border-blue-200 dark:border-blue-800"
                          >
                            {searchResult.purpose}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={handleAddToMeds}
                        className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add to Schedule
                      </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        {/* Warnings Section - High Priority */}
                        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/50 shadow-none">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center text-amber-700 dark:text-amber-500">
                              <AlertTriangle className="h-5 w-5 mr-2" />
                              Key Warnings & Precautions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {searchResult.warnings.map((item, i) => (
                                <div
                                  key={`w-${i}`}
                                  className="flex items-start gap-2 p-2 rounded bg-white/60 dark:bg-black/20 border border-amber-100 dark:border-amber-900/30"
                                >
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item}</span>
                                </div>
                              ))}
                              {searchResult.precautions.map((item, i) => (
                                <div
                                  key={`p-${i}`}
                                  className="flex items-start gap-2 p-2 rounded bg-white/60 dark:bg-black/20 border border-amber-100 dark:border-amber-900/30"
                                >
                                  <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Dosage Guidelines */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                            <Stethoscope className="h-5 w-5 text-blue-500" /> Dosage Guidelines
                          </h3>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm">
                              <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white">
                                <Baby className="h-4 w-4 text-cyan-500" /> Children
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {searchResult.dosage_by_age.child}
                              </p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                              <div className="flex items-center gap-2 mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                <User className="h-4 w-4 text-blue-600" /> Adults
                              </div>
                              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                                {searchResult.dosage_by_age.adult}
                              </p>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm">
                              <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 dark:text-white">
                                <UserPlus className="h-4 w-4 text-purple-500" /> Elderly
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {searchResult.dosage_by_age.elderly}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Side Effects */}
                        {searchResult.side_effects && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-orange-500" />
                                Possible Side Effects
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {searchResult.side_effects.map((effect, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                                  {effect}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {/* Interactions */}
                        {searchResult.interactions && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center">
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Known Interactions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-xs text-muted-foreground mb-2">Avoid taking with:</p>
                              <div className="flex flex-wrap gap-2">
                                {searchResult.interactions.map((interaction, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50"
                                  >
                                    {interaction}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-6 text-xs text-muted-foreground flex gap-2 items-start">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <p>
                        This information is for educational purposes only and does not constitute medical advice. Always
                        consult your healthcare provider before starting or changing any medication. Individual dosage
                        requirements may vary based on health status, weight, and other factors.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <div className="border-t my-8"></div>

          {/* Existing Precautions List Section */}
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            My Saved Precautions
          </h2>

          {medications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No medications found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add medications to your profile to see safety precautions.
                </p>
                <Link href="/medications">
                  <Button>Go to Medications</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {medications.map((med) => {
                const medPrecautions = precautions.filter((p) => p.medicationId === med.id)

                return (
                  <Card
                    key={med.id}
                    className="overflow-hidden hover:shadow-md transition-all duration-300 border-t-4"
                    style={{ borderTopColor: med.color || "#3b82f6" }}
                  >
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm bg-white dark:bg-slate-700">
                            <Shield className="h-5 w-5" style={{ color: med.color || "#3b82f6" }} />
                          </div>
                          <CardTitle className="text-lg">{med.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-white dark:bg-slate-900">
                          {medPrecautions.length} Notes
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {medPrecautions.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                          No specific precautions listed.
                          <br />
                          <Button
                            variant="link"
                            className="mt-2 h-auto p-0"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, medicationId: med.id }))
                              setIsDialogOpen(true)
                            }}
                          >
                            Add one now
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {medPrecautions.map((precaution) => (
                            <div
                              key={precaution.id}
                              className={`p-3 rounded-lg border text-sm flex items-start gap-3 group hover:shadow-sm transition-shadow ${getColorForSeverity(precaution.severity)}`}
                            >
                              <div className="mt-0.5 flex-shrink-0">{getIconForType(precaution.type)}</div>
                              <div className="flex-1">
                                <div className="font-semibold capitalize mb-0.5">{precaution.type} Warning</div>
                                <div className="opacity-90 leading-relaxed">{precaution.description}</div>
                              </div>
                              <button
                                onClick={() => handleDelete(precaution.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
