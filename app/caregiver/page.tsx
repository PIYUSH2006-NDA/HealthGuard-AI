"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Heart, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface CaregiverRequest {
  id: string
  patientId: string
  patientName: string
  status: "pending" | "accepted" | "declined"
  message?: string
  timestamp: string
}

export default function CaregiverPage() {
  const { user, isAuthenticated } = useAuth()
  const { addNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<CaregiverRequest[]>([])
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "caregiver") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" as const } : r)))
    toast({ title: "Request accepted", description: "You are now monitoring this patient." })
  }

  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "declined" as const } : r)))
    toast({ title: "Request declined", description: "The patient has been notified." })
  }

  const handleSendComment = () => {
    if (!comment.trim()) return

    addNotification({
      type: "caregiver_request",
      title: "Caregiver Comment",
      message: comment,
      severity: "low",
    })

    toast({ title: "Comment sent", description: "Your comment has been sent to the patient." })
    setComment("")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Caregiver Dashboard
            </CardTitle>
            <CardDescription>Monitor and support your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">3</div>
                <div className="text-sm text-muted-foreground">Active Patients</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-900">2</div>
                <div className="text-sm text-muted-foreground">Pending Alerts</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">94%</div>
                <div className="text-sm text-muted-foreground">Avg Adherence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monitoring Requests</CardTitle>
            <CardDescription>Accept or decline patient monitoring requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{request.patientName}</div>
                      <div className="text-sm text-muted-foreground">
                        Requested {new Date(request.timestamp).toLocaleDateString()}
                      </div>
                      {request.message && <div className="text-sm mt-2 text-slate-700">{request.message}</div>}
                    </div>
                    <div className="flex gap-2">
                      {request.status === "pending" ? (
                        <>
                          <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeclineRequest(request.id)}>
                            Decline
                          </Button>
                        </>
                      ) : (
                        <Badge variant={request.status === "accepted" ? "default" : "secondary"}>
                          {request.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Alerts</CardTitle>
            <CardDescription>High-priority notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-red-900">Missed Dose Alert</div>
                  <div className="text-sm text-red-700">John Doe missed Warfarin (5mg) at 8:00 AM</div>
                  <div className="text-xs text-red-600 mt-1">2 hours ago</div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Heart className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-amber-900">Symptom Report</div>
                  <div className="text-sm text-amber-700">Jane Smith reported dizziness</div>
                  <div className="text-xs text-amber-600 mt-1">5 hours ago</div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Comment to Patient</CardTitle>
            <CardDescription>Add notes or advice for your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Type your message here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSendComment} disabled={!comment.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
