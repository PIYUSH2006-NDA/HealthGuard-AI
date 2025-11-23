"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Activity,
  AlertCircle,
  Heart,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Shield,
  ArrowRight,
  Stethoscope,
  Lock,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false) // Initialize as false, will be set by onPlay/onPause
  const videoRef = useRef<HTMLVideoElement>(null)

  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Play failed:", error)
            }
          })
        }
      }
      // State updates are handled by onPlay/onPause event listeners on the video element
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column - Video Section */}
      <div className="relative hidden lg:flex flex-col bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            loop
            muted={isMuted}
            autoPlay // Added autoPlay attribute for better reliability
            playsInline
            className="h-full w-full object-cover opacity-60" // Increased opacity for better visibility
            aria-label="Background video showing medical research and safety"
            poster="https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop" // Added valid poster URL
            onPlay={() => setIsPlaying(true)} // Sync state with actual video events
            onPause={() => setIsPlaying(false)} // Sync state with actual video events
          >
            {/* Primary Source: External reliable URL - High quality medical/tech abstract video */}
            <source src="https://cdn.pixabay.com/video/2020/05/25/40152-424086038_large.mp4" type="video/mp4" />
            {/* Fallback source */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-medical-laboratory-research-4359-large.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-slate-950/90" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12 lg:p-16">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
              <Stethoscope className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white/90">MediBuddy</span>
          </div>

          <div className="space-y-8 max-w-lg">
            <h2 className="text-5xl font-serif leading-tight tracking-tight text-white/90 drop-shadow-lg">
              Why MediBuddy Matters.
            </h2>
            <p className="text-blue-100/90 text-lg font-light leading-relaxed drop-shadow-md">
              Medication errors affect millions every year. MediBuddy acts as your intelligent guardian, ensuring
              safety, adherence, and peace of mind for you and your loved ones.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl shadow-lg">
                <Shield className="h-5 w-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/70 uppercase tracking-wider font-medium">Security</span>
                  <span className="text-sm font-medium text-white/90">HIPAA Compliant</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl shadow-lg">
                <Heart className="h-5 w-5 text-rose-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-white/70 uppercase tracking-wider font-medium">Trusted by</span>
                  <span className="text-sm font-medium text-white/90">10k+ Patients</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md group"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white/80 group-hover:text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white/80 group-hover:text-white" />
                )}
              </button>
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md group"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-white/80 group-hover:text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white/80 group-hover:text-white" />
                )}
              </button>
            </div>
            <div className="text-xs text-white/40 font-mono uppercase tracking-widest">v2.0 System Active</div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Section */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-hidden transition-colors duration-500">
        {/* Background ambient elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-medium text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-lg">Enter your credentials to access your dashboard</p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80 ml-1">
                  Email
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-muted/30 border-input transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary pl-4"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-muted/30 border-input transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary pl-4"
                    disabled={loading}
                  />
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground/50 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {loading ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-11 hover:bg-muted/50 border-input bg-transparent"
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-11 hover:bg-muted/50 border-input bg-transparent"
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4 fill-foreground" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
