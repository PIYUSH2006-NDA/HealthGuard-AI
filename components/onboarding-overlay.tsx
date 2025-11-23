"use client"

import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export function OnboardingOverlay() {
  const { isOnboardingActive, currentStep, steps, nextStep, prevStep, skipOnboarding } = useOnboarding()
  const router = useRouter()

  if (!isOnboardingActive) return null

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (step.action) {
      router.push(step.action)
    }
    nextStep()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" />

      {/* Tour Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-md pointer-events-auto animate-in zoom-in duration-300 shadow-2xl">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  {step.title}
                </CardTitle>
                <CardDescription className="mt-2">{step.description}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={skipOnboarding} className="flex-shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Step {currentStep + 1} of {steps.length}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipOnboarding}>
                Skip Tour
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? (
                  "Get Started"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
