"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  CheckCircle2,
  Video,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useRef, useEffect } from "react"

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const p = (video.currentTime / video.duration) * 100
      setProgress(p)
    }

    const handlePlay = () => {
      setIsVideoPlaying(true)
      setIsVideoLoading(false)
    }
    const handlePause = () => setIsVideoPlaying(false)
    const handleEnded = () => setIsVideoPlaying(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    // Existing code here
  }, [])

  const handlePlayVideo = async () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        setIsVideoLoading(true)
        try {
          await videoRef.current.play()
        } catch (error: any) {
          if (!isMounted.current) return
          if (error.name !== "AbortError") {
            console.error("Video playback failed:", error)
          }
          setIsVideoLoading(false)
        }
      } else {
        videoRef.current.pause()
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 glass-panel">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-foreground text-background p-2 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">MediBuddy</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="#demo"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Experience
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full px-6 shadow-glow">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.07]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Intelligent Healthcare Companion 2.0
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 tracking-tight text-balance leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Optimal health <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300">
                meets exquisite design.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed text-pretty font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Transform your daily health routine into a seamless experience. Smart adherence tracking, real-time
              insights, and clinician connectivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                >
                  Start your journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/video">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/50"
                >
                  <Video className="mr-2 h-4 w-4 text-blue-500" />
                  Watch Explainer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="py-12 border-y border-border/50 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-serif font-bold mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Adherence Rate</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold mb-1">20k+</div>
              <div className="text-sm text-muted-foreground">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">AI Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold mb-1">HIPAA</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group p-8 rounded-2xl glass-card hover:bg-secondary/50 transition-colors duration-500">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Precision Timing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI analyzes your routine to suggest the optimal medication schedule, minimizing missed doses and
                maximizing efficacy.
              </p>
            </div>
            <div className="group p-8 rounded-2xl glass-card hover:bg-secondary/50 transition-colors duration-500">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Clinical Safety</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time interaction checking against a global database ensures your regimen is safe and effective at
                all times.
              </p>
            </div>
            <div className="group p-8 rounded-2xl glass-card hover:bg-secondary/50 transition-colors duration-500">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">Care Ecosystem</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bridge the gap between patient and provider. Share vital statistics and adherence reports securely in
                one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-32 bg-foreground text-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6 text-background border-background/20 px-4 py-1">
                The Experience
              </Badge>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                Designed for <br />
                the modern patient.
              </h2>
              <p className="text-lg text-background/70 mb-8 leading-relaxed max-w-md">
                Experience the fluidity of MediBuddy. From intuitive logging to smart dashboarding, every interaction is
                crafted for delight and utility.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Smart intake logging with one tap",
                  "Visual adherence analytics",
                  "Direct clinician messaging channel",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-background/80">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-8">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 bg-black group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-90"
                playsInline
                loop
                poster="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
              >
                <source src="https://cdn.pixabay.com/video/2021/04/17/71336-538415535_large.mp4" type="video/mp4" />
                <source src="./assets/demo.mp4" type="video/mp4" />
              </video>

              {/* Play Overlay */}
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isVideoPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
                onClick={handlePlayVideo}
              >
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 border border-white/20">
                  {isVideoPlaying ? (
                    <Pause className="h-8 w-8 text-white fill-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  )}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full space-y-2">
                  {/* Progress */}
                  <div
                    className="w-full h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Seek logic could go here
                    }}
                  >
                    <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <button onClick={handlePlayVideo} className="text-white hover:text-blue-400 transition-colors">
                        {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-2xl font-serif font-bold">MediBuddy</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                Pioneering the future of personal health management through intelligent design and compassionate
                technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Enterprise
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="/about" className="hover:text-foreground">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-xs text-muted-foreground">
            <p>© 2025 MediBuddy Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
