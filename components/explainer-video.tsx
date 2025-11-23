"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  RefreshCw,
  Search,
  Shield,
  Bell,
  Check,
  Pill,
  Video,
  Smartphone,
  Activity,
  Lock,
  User,
  FileText,
  Share2,
  Stethoscope,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SCRIPT = [
  {
    start: 0,
    end: 8,
    text: "Welcome to MediBuddy. Your intelligent healthcare companion designed to make managing your health smart, simple, and safe.",
  },
  {
    start: 8,
    end: 18,
    text: "Getting started is effortless. Securely sign in to access your personalized health profile, where your data is protected with enterprise-grade security.",
  },
  {
    start: 18,
    end: 28,
    text: "Need answers fast? Our AI health assistant is available 24/7. Ask about symptoms, drug interactions, or general advice, and get instant, clinically-verified responses.",
  },
  {
    start: 28,
    end: 38,
    text: "Managing medications has never been easier. Search our global database for detailed dosage guidelines, safety precautions, and potential side effects.",
  },
  {
    start: 38,
    end: 48,
    text: "Stay on track with smart reminders. MediBuddy adapts to your routine, sending timely notifications so you never miss a dose, whether you're at home or on the go.",
  },
  {
    start: 48,
    end: 58,
    text: "Your health journey is better shared. Seamlessly connect with your clinician, sharing vital adherence reports and health trends in just one click.",
  },
  {
    start: 58,
    end: 70,
    text: "MediBuddy. Complete health management for the modern patient. Smart. Simple. Safe.",
  },
]

const CHAPTERS = [
  { time: 0, label: "Intro" },
  { time: 8, label: "Login" },
  { time: 18, label: "AI Chat" },
  { time: 28, label: "Search" },
  { time: 38, label: "Mobile" },
  { time: 48, label: "Share" },
  { time: 58, label: "Outro" },
]

const TOTAL_DURATION = 70

export function ExplainerVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [recordingMode, setRecordingMode] = useState(false)
  const requestRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const previousTimeRef = useRef<number>(0)

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
    }
    previousTimeRef.current = time

    if (!startTimeRef.current) startTimeRef.current = time - currentTime * 1000

    const elapsed = (time - startTimeRef.current) / 1000

    if (elapsed >= TOTAL_DURATION) {
      setCurrentTime(TOTAL_DURATION)
      setIsPlaying(false)
      return
    }

    setCurrentTime(elapsed)
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isPlaying) {
      previousTimeRef.current = performance.now()
      startTimeRef.current = performance.now() - currentTime * 1000
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)
  const reset = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const jumpTo = (time: number) => {
    setCurrentTime(time)
    if (!isPlaying) {
      setIsPlaying(true)
    } else {
      startTimeRef.current = performance.now() - time * 1000
    }
  }

  const currentCaption = SCRIPT.find((s) => currentTime >= s.start && currentTime < s.end)?.text || ""

  return (
    <div
      className={cn(
        "relative w-full aspect-video bg-slate-950 overflow-hidden rounded-xl shadow-2xl border border-slate-800 group",
        recordingMode ? "cursor-none rounded-none border-0" : "",
      )}
    >
      {/* SCENES */}
      <div className="absolute inset-0 flex items-center justify-center font-sans antialiased">
        {/* Scene 1: Intro (0-8s) */}
        <Scene active={currentTime >= 0 && currentTime < 8}>
          <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000">
            <div className="mb-8 bg-teal-500/10 p-8 rounded-full animate-pulse">
              <Pill className="w-20 h-20 text-teal-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">MediBuddy</h1>
            <p className="text-xl text-slate-400 font-light">Your Intelligent Healthcare Companion</p>
          </div>
        </Scene>

        {/* Scene 2: Authentication (8-18s) */}
        <Scene active={currentTime >= 8 && currentTime < 18}>
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
              <p className="text-slate-400 text-sm mt-1">Secure Enterprise Login</p>
            </div>

            <div className="space-y-4">
              {/* Email Field Animation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg h-10 w-full flex items-center pl-10 text-slate-300 text-sm">
                    <span className={cn("animate-typewriter", currentTime > 9.5 ? "opacity-100" : "opacity-0")}>
                      alex.taylor@medibuddy.app
                    </span>
                    <span
                      className={cn(
                        "w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse",
                        currentTime > 12 ? "opacity-0" : "opacity-100",
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field Animation */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg h-10 w-full flex items-center pl-10 text-slate-300 text-sm">
                    <div className="flex gap-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full bg-slate-400 transition-opacity duration-100",
                            currentTime > 12.5 + i * 0.1 ? "opacity-100" : "opacity-0",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Animation */}
              <div
                className={cn(
                  "bg-blue-600 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm transition-all duration-300 transform",
                  currentTime > 14.5 ? "scale-95 bg-blue-500" : "scale-100",
                )}
              >
                {currentTime > 15.5 ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Access Granted
                  </span>
                ) : (
                  "Sign In"
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3 h-3 text-green-500" />
              <span>End-to-end Encrypted</span>
            </div>
          </div>
        </Scene>

        {/* Scene 3: AI Chat (18-28s) */}
        <Scene active={currentTime >= 18 && currentTime < 28}>
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-700">
            {/* Chat Header */}
            <div className="bg-slate-800/50 p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">MediBuddy AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">Online • Verified</span>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-indigo-300">Beta 2.0</span>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-6 space-y-6 bg-slate-900/50 min-h-[300px]">
              {/* User Message */}
              <div
                className={cn(
                  "flex justify-end animate-in slide-in-from-right-4 fade-in duration-500",
                  currentTime > 19 ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-lg">
                  <p className="text-sm">Can I take ibuprofen with my current prescription?</p>
                </div>
              </div>

              {/* AI Typing Indicator */}
              <div
                className={cn(
                  "flex items-center gap-2 transition-opacity duration-300",
                  currentTime > 20.5 && currentTime < 23 ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                </div>
              </div>

              {/* AI Response */}
              <div
                className={cn(
                  "flex items-start gap-3 animate-in slide-in-from-left-4 fade-in duration-500",
                  currentTime > 23 ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="space-y-2 max-w-[85%]">
                  <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
                    <p className="text-sm leading-relaxed">
                      Taking <span className="text-teal-400 font-medium">ibuprofen</span> with{" "}
                      <span className="text-teal-400 font-medium">amoxicillin</span> is generally safe. However, ensure
                      you take them with food to avoid stomach upset.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-800">
                      Source: Mayo Clinic API
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scene>

        {/* Scene 4: Medicine Search (28-38s) */}
        <Scene active={currentTime >= 28 && currentTime < 38}>
          <div className="w-full max-w-4xl px-8 flex flex-col gap-8 items-center">
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-700">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl opacity-20 blur-md" />
              <div className="relative bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-xl">
                <Search className="text-teal-400 w-6 h-6" />
                <span className="text-xl text-slate-300 font-light">Amoxicillin...</span>
              </div>
              {/* Floating Text: Search Medicines */}
              <div
                className="absolute -right-4 -top-10 animate-in fade-in slide-in-from-left-4 duration-500 delay-500 fill-mode-forwards opacity-0"
                style={{ animationDelay: "500ms" }}
              >
                <span className="text-teal-400 text-sm font-semibold tracking-wide bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/20">
                  Search Global Database
                </span>
              </div>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mt-4">
              {/* Dosage Card */}
              <div
                className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-lg animate-in zoom-in-95 fade-in duration-700 fill-mode-forwards opacity-0"
                style={{ animationDelay: "2000ms" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Activity className="text-blue-400 w-5 h-5" />
                  </div>
                  <h3 className="text-white font-medium">Standard Dosage</h3>
                </div>
                <div className="text-2xl font-semibold text-blue-100 mb-1">500mg</div>
                <div className="text-sm text-slate-400">Every 8 hours</div>
              </div>

              {/* Precautions Card */}
              <div
                className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-lg animate-in zoom-in-95 fade-in duration-700 fill-mode-forwards opacity-0"
                style={{ animationDelay: "3500ms" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Shield className="text-teal-400 w-5 h-5" />
                  </div>
                  <h3 className="text-white font-medium">Safety Check</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-teal-500" />
                    <span>Take with food</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-teal-500" />
                    <span>Avoid alcohol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scene>

        {/* Scene 5: Mobile App (38-48s) */}
        <Scene active={currentTime >= 38 && currentTime < 48}>
          <div className="flex items-center justify-center gap-12 w-full">
            {/* Phone Mockup */}
            <div className="relative w-[280px] h-[500px] bg-slate-950 border-8 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-right-10 duration-1000">
              <div className="w-full h-full bg-slate-900 relative">
                <div className="bg-slate-800/50 p-6 pb-4">
                  <div className="text-white font-semibold text-lg">My Routine</div>
                  <div className="text-slate-400 text-xs">Today, Oct 24</div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                      <div className="w-0.5 h-12 bg-slate-800" />
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-xl flex-1 border border-slate-700/50">
                      <div className="text-slate-300 text-xs mb-1">8:00 AM</div>
                      <div className="text-white font-medium text-sm">Morning Vitamin</div>
                    </div>
                  </div>

                  {/* Active Notification */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                      <div className="w-0.5 h-12 bg-slate-800" />
                    </div>
                    <div
                      className={cn(
                        "bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-3 rounded-xl flex-1 border border-teal-500/30 transition-all duration-500",
                        currentTime > 44 ? "opacity-50" : "opacity-100",
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-teal-400 text-xs mb-1 font-medium">12:30 PM</div>
                          <div className="text-white font-medium text-sm">Amoxicillin</div>
                        </div>
                        <Bell className={cn("w-4 h-4 text-teal-400", currentTime <= 44 && "animate-pulse")} />
                      </div>

                      {/* Action Button */}
                      <div
                        className={cn(
                          "mt-2 bg-teal-500 text-white text-xs text-center py-1.5 rounded-lg font-medium shadow-lg transition-transform",
                          currentTime > 42 && currentTime < 43 ? "scale-95" : "scale-100",
                          currentTime > 43 ? "bg-green-500" : "",
                        )}
                      >
                        {currentTime > 43 ? "Taken" : "Mark as Taken"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Graphic */}
            <div className="hidden md:block space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl w-56 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-200 font-medium">Smart Notifications</div>
                  <div className="text-xs text-slate-500">Context-aware alerts</div>
                </div>
              </div>
            </div>
          </div>
        </Scene>

        {/* Scene 6: Clinician/Sharing (48-58s) */}
        <Scene active={currentTime >= 48 && currentTime < 58}>
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-700">
            {/* Dashboard Header */}
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/90">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-white">Dr. Smith's Portal</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800" />
                <div className="w-8 h-8 rounded-full bg-slate-800" />
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-8">
              {/* Patient Card */}
              <div className="col-span-1 space-y-6">
                <h2 className="text-xl font-light text-white">Monthly Report</h2>
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Adherence</span>
                    <span className="text-teal-400 font-bold">98%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[98%]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-slate-900 p-2 rounded text-center">
                      <div className="text-xs text-slate-500">Missed</div>
                      <div className="text-white font-medium">1</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded text-center">
                      <div className="text-xs text-slate-500">Taken</div>
                      <div className="text-white font-medium">45</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Action */}
              <div className="col-span-1 flex flex-col justify-center items-center gap-4">
                <div
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
                    currentTime > 53 ? "bg-green-500/20" : "bg-blue-500/10",
                  )}
                >
                  {currentTime > 53 ? (
                    <Check className="w-10 h-10 text-green-500 animate-in zoom-in" />
                  ) : (
                    <FileText className="w-10 h-10 text-blue-400" />
                  )}
                </div>

                <Button
                  size="lg"
                  className={cn(
                    "w-full transition-all duration-300",
                    currentTime > 52 && currentTime < 53 ? "scale-95" : "scale-100",
                    currentTime > 53 ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700",
                  )}
                >
                  {currentTime > 53 ? (
                    <span className="flex items-center gap-2">Sent Successfully</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> Share with Clinician
                    </span>
                  )}
                </Button>

                <p
                  className={cn(
                    "text-xs text-slate-500 transition-opacity",
                    currentTime > 54 ? "opacity-100" : "opacity-0",
                  )}
                >
                  Report sent to Dr. Smith securely.
                </p>
              </div>
            </div>
          </div>
        </Scene>

        {/* Scene 7: Outro (58-70s) */}
        <Scene active={currentTime >= 58}>
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-1000">
            <div className="mb-6 bg-gradient-to-tr from-teal-500 to-blue-600 p-5 rounded-3xl shadow-2xl">
              <Check className="w-16 h-16 text-white stroke-[3px]" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">MediBuddy</h1>

            <div className="flex gap-6 text-xl text-slate-300 font-light">
              <span
                className="animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300 fill-mode-forwards opacity-0"
                style={{ animationDelay: "200ms" }}
              >
                Smart.
              </span>
              <span
                className="animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300 fill-mode-forwards opacity-0"
                style={{ animationDelay: "800ms" }}
              >
                Simple.
              </span>
              <span
                className="animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300 fill-mode-forwards opacity-0 text-teal-400 font-medium"
                style={{ animationDelay: "1400ms" }}
              >
                Safe.
              </span>
            </div>

            <div
              className="mt-12 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000 fill-mode-forwards opacity-0"
              style={{ animationDelay: "2s" }}
            >
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                Documentation
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Get Started <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Scene>

        {/* Subtitles Overlay */}
        <div
          className={cn(
            "absolute bottom-24 left-0 right-0 px-12 text-center z-40 transition-opacity duration-500 pointer-events-none",
            currentTime >= 68 || !currentCaption ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="inline-block bg-slate-950/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/5 shadow-2xl">
            <p className="text-slate-100 text-lg md:text-xl font-medium leading-relaxed tracking-wide">
              {currentCaption}
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 transition-all duration-300 z-50 flex flex-col",
          recordingMode ? "opacity-0 pointer-events-none" : "opacity-0 md:opacity-100 group-hover:opacity-100",
        )}
      >
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-slate-800 relative cursor-pointer group/progress"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pos = (e.clientX - rect.left) / rect.width
            jumpTo(pos * TOTAL_DURATION)
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />

          {/* Chapter Markers */}
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.label}
              className="absolute top-0 w-0.5 h-full bg-slate-950/50 hover:bg-white z-10"
              style={{ left: `${(chapter.time / TOTAL_DURATION) * 100}%` }}
            >
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/progress:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {chapter.label}
              </div>
            </div>
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-teal-400 hover:bg-white/10"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <div className="text-xs font-mono text-slate-400">
              <span>
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
              <span className="mx-1">/</span>
              <span>
                {Math.floor(TOTAL_DURATION / 60)}:
                {Math.floor(TOTAL_DURATION % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Interactive Chapter Links */}
          <div className="hidden md:flex items-center gap-2">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.label}
                onClick={() => jumpTo(chapter.time)}
                className={cn(
                  "text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded transition-colors",
                  currentTime >= chapter.time &&
                    currentTime < (CHAPTERS.find((c) => c.time > chapter.time)?.time || TOTAL_DURATION)
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                {chapter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-teal-400 hover:bg-white/10"
              onClick={reset}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recording Mode Toggle */}
      {!recordingMode && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-400 hover:bg-transparent z-50 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setRecordingMode(true)}
        >
          <Video className="w-3 h-3" />
        </Button>
      )}

      {recordingMode && (
        <div className="absolute top-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="destructive"
            size="sm"
            className="shadow-lg text-xs h-8"
            onClick={() => setRecordingMode(false)}
          >
            Stop Recording
          </Button>
        </div>
      )}
    </div>
  )
}

function Scene({ children, active }: { children: React.ReactNode; active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 animate-in fade-in duration-500">
      {children}
    </div>
  )
}
