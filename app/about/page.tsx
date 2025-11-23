import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, ArrowLeft, Users, Shield, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-slate-600 dark:text-slate-400">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            About MediBuddy
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to simplify medication management and empower patients with intelligent, accessible
            healthcare tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Story</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              MediBuddy started with a simple observation: managing multiple medications is stressful, complicated, and
              prone to errors. We realized that patients needed more than just a simple alarm clock—they needed an
              intelligent companion.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Today, MediBuddy serves thousands of patients, caregivers, and clinicians, bridging the gap between daily
              care and medical oversight with AI-driven insights and real-time monitoring.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Users className="h-8 w-8 text-blue-500 mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Shield className="h-8 w-8 text-emerald-500 mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">99.9%</div>
              <div className="text-sm text-slate-500">Uptime Reliability</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Award className="h-8 w-8 text-amber-500 mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">#1</div>
              <div className="text-sm text-slate-500">Health App Award</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Heart className="h-8 w-8 text-rose-500 mb-4" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">4.9</div>
              <div className="text-sm text-slate-500">User Rating</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-12 text-center text-white mb-12">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Whether you're a patient, caregiver, or healthcare provider, MediBuddy is designed to make your life easier.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
