import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider
import { AuthProvider } from "@/lib/auth-context"
import { MedicationProvider } from "@/lib/medication-context"
import { ReminderProvider } from "@/lib/reminder-context"
import { NotificationProvider } from "@/lib/notification-context"
import { SymptomProvider } from "@/lib/symptom-context"
import { ClinicianProvider } from "@/lib/clinician-context"
import { GamificationProvider } from "@/lib/gamification-context"
import { PrecautionProvider } from "@/lib/precaution-context"
import { OnboardingProvider } from "@/lib/onboarding-context"
import { OnboardingOverlay } from "@/components/onboarding-overlay"
import { Toaster } from "@/components/ui/toaster"
import { OpeningAnimation } from "@/components/opening-animation"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "MediBuddy v2 - AI Medication Adherence Assistant",
  description: "Your intelligent companion for medication management and health tracking",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_playfair.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <GamificationProvider>
              <OnboardingProvider>
                <MedicationProvider>
                  <ReminderProvider>
                    <NotificationProvider>
                      <SymptomProvider>
                        <ClinicianProvider>
                          <PrecautionProvider>
                            <OpeningAnimation />
                            {children}
                            <OnboardingOverlay />
                            <Toaster />
                          </PrecautionProvider>
                        </ClinicianProvider>
                      </SymptomProvider>
                    </NotificationProvider>
                  </ReminderProvider>
                </MedicationProvider>
              </OnboardingProvider>
            </GamificationProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
