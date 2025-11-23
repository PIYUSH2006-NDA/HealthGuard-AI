"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Check, MessageSquare, Clock, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PatientPortal() {
  const [messages, setMessages] = useState([
    { role: "agent", content: "Good morning, Alex! It's time for your 9:00 AM Lisinopril. Have you taken it yet?" },
  ])
  const [input, setInput] = useState("")
  const [meds, setMeds] = useState([
    { id: 1, name: "Lisinopril", dose: "10mg", time: "09:00 AM", taken: false },
    { id: 2, name: "Metformin", dose: "500mg", time: "02:00 PM", taken: false },
    { id: 3, name: "Atorvastatin", dose: "20mg", time: "08:00 PM", taken: false },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    // Mock Agent Response
    setTimeout(() => {
      let response = "I've noted that."
      if (input.toLowerCase().includes("yes") || input.toLowerCase().includes("taken")) {
        response = "Great job! I've logged your adherence for this morning. Keep it up!"
        handleTakeMed(1) // Auto-mark first med for demo
      } else if (input.toLowerCase().includes("side effect") || input.toLowerCase().includes("dizzy")) {
        response =
          "I'm sorry to hear that. I've logged 'dizziness' as a potential side effect and will notify your clinician. Please sit down and rest."
      }
      setMessages([...newMessages, { role: "agent", content: response }])
    }, 1000)
  }

  const handleTakeMed = (id: number) => {
    setMeds(meds.map((m) => (m.id === id ? { ...m, taken: true } : m)))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient Portal</h1>
            <p className="text-slate-600">Welcome back, Alex</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Medications List */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  Today's Meds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meds.map((med) => (
                  <div
                    key={med.id}
                    className={`p-3 rounded-lg border ${med.taken ? "bg-green-50 border-green-100" : "bg-white border-slate-100"} flex items-center justify-between transition-all`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{med.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {med.time} • {med.dose}
                      </div>
                    </div>
                    {med.taken ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Taken</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600 bg-transparent"
                        onClick={() => handleTakeMed(med.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as taken</span>
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Next Reminder</h3>
                    <p className="text-blue-100 text-sm">Metformin (500mg) at 2:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Interface */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col shadow-md">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">MediBuddy Assistant</CardTitle>
                    <CardDescription>Always here to help</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-slate-100 text-slate-800 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-md border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
