import { ExplainerVideo } from "@/components/explainer-video"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VideoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Top nav */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              Generated Source
            </span>
          </div>
        </div>

        {/* Title + short description */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Project Explainer</h1>
          <p className="text-slate-400 max-w-2xl">
            A comprehensive interactive walkthrough of MediBuddy’s ecosystem — from secure onboarding and AI health
            assistance to clinician connectivity.
          </p>
        </div>

        {/* Video player (component handles video src) */}
        <section aria-label="Explainer video" className="rounded-lg overflow-hidden shadow-lg bg-slate-900">
          {/* ExplainerVideo component should implement accessible video playback:
              - <video> tag with controls, playsInline, muted autoplay support
              - a "Recording Mode" toggle inside player if desired
              - poster image and fallback message if video fails
          */}
          <ExplainerVideo />

          {/* Optional caption or short summary under the player */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <p className="text-sm text-slate-400">
              This interactive demo showcases the full patient journey: Authentication, AI-powered health chat, Medicine
              Search, Mobile Adherence, and Clinician Reporting. Click the chapter markers to navigate.
            </p>
          </div>
        </section>

        {/* Info grid — polished, user-facing copy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">What this preview shows</h3>
            <p className="text-sm text-slate-500">
              A 70-second tour of the entire application. See how patients securely log in, get instant answers from AI,
              manage prescriptions, and share data with doctors.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Interactive Controls</h3>
            <p className="text-sm text-slate-500">
              Use the chapter buttons at the bottom of the player to jump directly to features like "AI Chat" or
              "Mobile". Hover over the timeline to see section markers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">Design & accessibility</h3>
            <p className="text-sm text-slate-500">
              The interface uses clear typography, accessible color contrast, and subtle motion to make interactions
              obvious and comfortable for all users.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
