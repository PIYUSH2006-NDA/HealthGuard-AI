"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMedications } from "@/lib/medication-context"
import { useNotifications } from "@/lib/notification-context"
import { useGamification } from "@/lib/gamification-context"
import { useOnboarding } from "@/lib/onboarding-context"
import { useTheme } from "next-themes" // Import useTheme hook
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import DropdownMenu components
import {
  Activity,
  Pill,
  Clock,
  User,
  LogOut,
  Bell,
  Calendar,
  AlertCircle,
  Lightbulb,
  Trophy,
  Flame,
  Moon,
  Sun,
  Play,
  Shield,
  Settings,
  HelpCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { ClinicianDashboard } from "@/components/clinician-dashboard"

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const { medications } = useMedications()
  const { unreadCount } = useNotifications()
  const { streakData, achievements, recordDoseTaken } = useGamification()
  const { startOnboarding } = useOnboarding()
  const { theme, setTheme } = useTheme() // Use next-themes hook
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!user) return null

  if (user.role === "clinician") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">MediBuddy</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Clinician Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-2 mr-4 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dr. {user.name}</span>
              </div>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <ClinicianDashboard />
        </main>
      </div>
    )
  }

  const activeMedications = medications.filter((m) => !m.isPaused)
  const upcomingDoses = activeMedications.slice(0, 3)

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300`}
    >
      {/* Header */}
      <header className={`bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">MediBuddy</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={startOnboarding} title="Restart tour">
              <Play className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tour</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#" className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="cursor-pointer">
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user.name}!</h2>
          <p className="text-slate-600 dark:text-slate-400">Here's your medication overview for today</p>
        </div>

        {/* Gamification Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {streakData.currentStreak}
                <span className="text-2xl ml-2">days</span>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200">Longest: {streakData.longestStreak} days</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 bg-orange-200 dark:bg-orange-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 dark:bg-orange-400 transition-all duration-500"
                    style={{ width: `${Math.min((streakData.currentStreak / 30) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-orange-700 dark:text-orange-300">30d goal</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {achievements.length}
                <span className="text-2xl ml-2">/ {ACHIEVEMENTS_LIST.length}</span>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                Total Doses: {streakData.totalDosesTaken}
              </p>
              <div className="flex gap-2 flex-wrap">
                {ACHIEVEMENTS_LIST.map((achievement) => {
                  const isUnlocked = achievements.some((a) => a.id === achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`text-2xl transition-all duration-300 ${
                        isUnlocked ? "scale-110 animate-bounce-once" : "opacity-30 grayscale"
                      }`}
                      title={achievement.name}
                    >
                      {achievement.icon}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeMedications.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {medications.length - activeMedications.length} paused
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Doses</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeMedications.length * 2}</div>
              <p className="text-xs text-muted-foreground mt-1">3 completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Adherence Rate</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your medications and health</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/medications" id="medications-button">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <Pill className="h-4 w-4 mr-2 text-blue-600" />
                  Medications
                </Button>
              </Link>
              <Link href="/schedule" id="schedule-button">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  Schedule
                </Button>
              </Link>
              <Link href="/symptoms" id="symptoms-button">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                  Log Symptom
                </Button>
              </Link>
              <Link href="/advice">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                >
                  <Activity className="h-4 w-4 mr-2 text-green-600" />
                  Ask Doctor
                </Button>
              </Link>
              <Link href="/precautions">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2 text-amber-600" />
                  Precautions
                </Button>
              </Link>
              <Link href="/insights" className="col-span-2" id="insights-button">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent h-auto py-3 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors"
                >
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                  Health Insights
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Doses */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Doses</CardTitle>
              <CardDescription>Next medications to take</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingDoses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No medications scheduled</p>
                  <Link href="/medications">
                    <Button variant="link" size="sm" className="mt-2">
                      Add medication
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDoses.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: med.color }}
                        >
                          <Pill className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{med.name}</div>
                          <div className="text-xs text-muted-foreground">{med.dosage}</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {med.schedule}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Medical Disclaimer:</strong> MediBuddy is a demonstration tool for medication tracking and is
                not a substitute for professional medical advice, diagnosis, or treatment. Always consult your
                healthcare provider for medical decisions.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export const ACHIEVEMENTS_LIST = [
  {
    id: "first-dose",
    name: "First Step",
    description: "Take your first medication dose",
    icon: "🎯",
  },
  {
    id: "week-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
  },
  {
    id: "month-streak",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "💪",
  },
  {
    id: "hundred-doses",
    name: "Century Club",
    description: "Take 100 doses total",
    icon: "💯",
  },
  {
    id: "perfect-week",
    name: "Perfect Week",
    description: "Complete all doses for 7 days",
    icon: "⭐",
  },
]
