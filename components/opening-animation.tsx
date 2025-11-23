"use client"

import { useEffect, useState } from "react"
import { Pill, Bell, Shield, Check } from 'lucide-react'

export function OpeningAnimation() {
  const [show, setShow] = useState(true)
  const [stage, setStage] = useState(0) // 0: Pill, 1: Split/Morph, 2: Logo Reveal

  useEffect(() => {
    // Sequence
    // 0ms: Start (Pill visible)
    // 800ms: Split/Morph start
    // 1600ms: Logo Reveal
    // 2400ms: Fade out
    // 3000ms: Remove

    const timer1 = setTimeout(() => setStage(1), 800)
    const timer2 = setTimeout(() => setStage(2), 1600)
    const timer3 = setTimeout(() => setStage(3), 2400) // Fade out
    const timer4 = setTimeout(() => setShow(false), 3000)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStage(3)
        setTimeout(() => setShow(false), 300)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl transition-opacity duration-700 ${
        stage >= 3 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Opening Animation"
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Glowing Ring Effect */}
        <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-3xl transition-all duration-1000 ${stage === 2 ? 'scale-150 opacity-50' : 'scale-50 opacity-0'}`} />

        <div className="relative h-32 w-32 flex items-center justify-center">
          {/* Stage 0: Pill */}
          <div
            className={`absolute transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${
              stage === 0 ? "opacity-100 scale-100 rotate-45" : "opacity-0 scale-150 rotate-180"
            }`}
          >
            <div className="bg-blue-600 p-5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              <Pill className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Stage 1: Split into Shield and Bell */}
          <div
            className={`absolute flex gap-12 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${
              stage === 1
                ? "opacity-100 scale-100 translate-x-0"
                : stage > 1
                  ? "opacity-0 scale-75"
                  : "opacity-0 scale-50"
            }`}
          >
            <div className="bg-indigo-500 p-4 rounded-2xl shadow-xl animate-bounce-once">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div
              className="bg-amber-500 p-4 rounded-2xl shadow-xl animate-bounce-once"
              style={{ animationDelay: "150ms" }}
            >
              <Bell className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Stage 2: Final Logo */}
          <div
            className={`absolute transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${
              stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50 translate-y-8"
            }`}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.4)] ring-4 ring-white/20 dark:ring-white/10">
              <Check className="h-20 w-20 text-white stroke-[3px]" />
            </div>
          </div>
        </div>

        {/* Text Reveal */}
        <div
          className={`mt-12 text-center transition-all duration-1000 delay-300 ${
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight font-serif">MediBuddy</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">Your Health Companion</p>
        </div>
      </div>
    </div>
  )
}
