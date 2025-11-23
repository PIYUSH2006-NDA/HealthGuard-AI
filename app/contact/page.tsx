"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Send, MessageSquare, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you shortly.",
    })

    setLoading(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
    // Optional: Redirect back to dashboard after a delay
    // setTimeout(() => router.push("/dashboard"), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/dashboard" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Support</h1>
              <p className="text-slate-600">
                Need help? Our support team is here for you. We typically respond within 24 hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-500 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Email Us</h3>
                  <p className="text-sm text-slate-600 mb-1">For general inquiries</p>
                  <a href="mailto:support@medibuddy.com" className="text-blue-600 hover:underline text-sm font-medium">
                    support@medibuddy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-emerald-500 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Call Us</h3>
                  <p className="text-sm text-slate-600 mb-1">Mon-Fri from 9am to 6pm</p>
                  <a href="tel:+15550000000" className="text-blue-600 hover:underline text-sm font-medium">
                    +91 XXXXXXXXXX
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-purple-500 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Office</h3>
                  <p className="text-sm text-slate-600">
                    123 Medical Center Dr
                    <br />
                    ABC 00
                    <br />
                    
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="min-w-[150px]" disabled={loading}>
                      {loading ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
