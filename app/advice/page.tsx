"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications } from "@/lib/medication-context"
import { useSymptoms } from "@/lib/symptom-context"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, MessageSquare, Sparkles, Info } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdvicePage() {
  const { user, isAuthenticated } = useAuth()
  const { medications } = useMedications()
  const { symptoms, tickets, createTicket, addReplyToTicket } = useSymptoms()
  const { addNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    selectedSymptoms: [] as string[],
    selectedMedications: [] as string[],
    priority: "medium" as "low" | "medium" | "high",
  })

  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set())
  const [replyMessage, setReplyMessage] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createTicket({
      patientName: user?.name || "Patient",
      subject: formData.subject,
      description: formData.description,
      symptoms: formData.selectedSymptoms,
      medications: formData.selectedMedications,
      priority: formData.priority,
    })

    addNotification({
      type: "doctor_advice",
      title: "Advice Request Submitted",
      message: `Your request "${formData.subject}" has been submitted to your clinician.`,
      severity: "low",
    })

    toast({
      title: "Request submitted",
      description: "Your clinician will review and respond soon.",
    })

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      selectedSymptoms: [],
      selectedMedications: [],
      priority: "medium",
    })
  }

  const toggleSymptom = (symptomId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter((s) => s !== symptomId)
        : [...prev.selectedSymptoms, symptomId],
    }))
  }

  const toggleMedication = (medId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedMedications: prev.selectedMedications.includes(medId)
        ? prev.selectedMedications.filter((m) => m !== medId)
        : [...prev.selectedMedications, medId],
    }))
  }

  const toggleTicket = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets)
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId)
    } else {
      newExpanded.add(ticketId)
    }
    setExpandedTickets(newExpanded)
  }

  const handleReply = (ticketId: string) => {
    const message = replyMessage[ticketId]?.trim()
    if (!message) return

    addReplyToTicket(ticketId, message, "patient")

    toast({
      title: "Reply sent",
      description: "Your message has been added to the conversation.",
    })

    setReplyMessage((prev) => ({ ...prev, [ticketId]: "" }))
  }

  const cannedReplies = [
    "Thank you for your response",
    "Could you provide more details?",
    "The symptoms have improved",
    "The symptoms are still persisting",
    "I have a follow-up question",
  ]

  const insertCannedReply = (ticketId: string, reply: string) => {
    setReplyMessage((prev) => ({ ...prev, [ticketId]: reply }))
  }

  if (!user) return null

  const recentSymptoms = symptoms.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Request Medical Advice
            </CardTitle>
            <CardDescription>Get guidance from your healthcare provider</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Note:</strong> This is not for emergencies. If you're experiencing a medical emergency, call 911
                immediately.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your concern"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about your concern..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                    <SelectItem value="high">High - Urgent attention needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recentSymptoms.length > 0 && (
                <div className="space-y-2">
                  <Label>Related Symptoms (Optional)</Label>
                  <div className="space-y-2">
                    {recentSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`symptom-${symptom.id}`}
                          checked={formData.selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                        />
                        <Label htmlFor={`symptom-${symptom.id}`} className="text-sm font-normal cursor-pointer">
                          {symptom.symptomName} ({symptom.severity}) -{" "}
                          {new Date(symptom.timestamp).toLocaleDateString()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {medications.length > 0 && (
                <div className="space-y-2">
                  <Label>Related Medications (Optional)</Label>
                  <div className="space-y-2">
                    {medications.slice(0, 5).map((med) => (
                      <div key={med.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`med-advice-${med.id}`}
                          checked={formData.selectedMedications.includes(med.id)}
                          onCheckedChange={() => toggleMedication(med.id)}
                        />
                        <Label htmlFor={`med-advice-${med.id}`} className="text-sm font-normal cursor-pointer">
                          {med.name} - {med.dosage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>Track your advice requests and responses</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No advice requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => {
                  const isExpanded = expandedTickets.has(ticket.id)
                  return (
                    <Card key={ticket.id}>
                      <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleTicket(ticket.id)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{ticket.subject}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {new Date(ticket.timestamp).toLocaleString()}
                              {ticket.thread && ticket.thread.length > 1 && (
                                <span className="ml-2 text-blue-600">• {ticket.thread.length} messages</span>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                ticket.status === "resolved"
                                  ? "default"
                                  : ticket.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {ticket.status}
                            </Badge>
                            <Badge
                              variant={
                                ticket.priority === "high"
                                  ? "destructive"
                                  : ticket.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="space-y-3">
                          {ticket.thread && ticket.thread.length > 0 && (
                            <div className="space-y-3 max-h-96 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              {ticket.thread.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                      msg.sender === "patient"
                                        ? "bg-blue-600 text-white"
                                        : msg.sender === "clinician"
                                          ? "bg-green-600 text-white"
                                          : "bg-purple-600 text-white"
                                    }`}
                                  >
                                    <div className="text-xs opacity-90 mb-1">
                                      {msg.senderName} • {new Date(msg.timestamp).toLocaleString()}
                                    </div>
                                    <div className="text-sm">{msg.message}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {ticket.aiSuggestion && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                              <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                  <div className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                                    AI Suggestion
                                  </div>
                                  <div className="text-purple-700 dark:text-purple-300">{ticket.aiSuggestion}</div>
                                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                    Always verify with your clinician - AI suggestions are not medical advice
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {ticket.status !== "resolved" && (
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Quick Replies:</Label>
                              <div className="flex flex-wrap gap-2">
                                {cannedReplies.map((reply) => (
                                  <Button
                                    key={reply}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertCannedReply(ticket.id, reply)}
                                    className="text-xs"
                                  >
                                    {reply}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {ticket.status !== "resolved" && (
                            <div className="flex gap-2">
                              <Input
                                placeholder="Type your message..."
                                value={replyMessage[ticket.id] || ""}
                                onChange={(e) => setReplyMessage((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleReply(ticket.id)
                                  }
                                }}
                              />
                              <Button size="sm" onClick={() => handleReply(ticket.id)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
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
