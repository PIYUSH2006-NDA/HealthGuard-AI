"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  action?: string
}

interface OnboardingContextType {
  isOnboardingActive: boolean
  currentStep: number
  steps: OnboardingStep[]
  startOnboarding: () => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to MediBuddy!",
    description: "Let's take a quick tour to help you get started with managing your medications.",
    target: "dashboard",
  },
  {
    id: "add-medication",
    title: "Add Your Medications",
    description: "Start by adding your first medication. Click the Medications button to get started.",
    target: "medications-button",
    action: "/medications",
  },
  {
    id: "set-reminders",
    title: "Set Up Reminders",
    description: "Never miss a dose! Set up reminders for each medication.",
    target: "schedule-button",
    action: "/schedule",
  },
  {
    id: "track-symptoms",
    title: "Log Symptoms",
    description: "Keep track of any side effects or symptoms you experience.",
    target: "symptoms-button",
    action: "/symptoms",
  },
  {
    id: "view-insights",
    title: "Learn & Stay Informed",
    description: "Explore health insights and educational content about medication safety.",
    target: "insights-button",
    action: "/insights",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "You're ready to start your medication adherence journey. We're here to help every step of the way.",
    target: "dashboard",
  },
]

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isOnboardingActive, setIsOnboardingActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!user) return

    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`)
    if (!hasCompletedOnboarding && user.role === "patient") {
      // Auto-start onboarding for new users after a short delay
      setTimeout(() => {
        setIsOnboardingActive(true)
      }, 1000)
    }
  }, [user])

  const startOnboarding = () => {
    setIsOnboardingActive(true)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    setIsOnboardingActive(false)
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, "true")
    }
  }

  const completeOnboarding = () => {
    setIsOnboardingActive(false)
    setCurrentStep(0)
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, "true")
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingActive,
        currentStep,
        steps: ONBOARDING_STEPS,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
