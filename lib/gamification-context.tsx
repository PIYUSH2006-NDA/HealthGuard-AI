"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastDoseDate?: Date
  totalDosesTaken: number
}

interface GamificationContextType {
  streakData: StreakData
  achievements: Achievement[]
  recordDoseTaken: () => void
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

const ACHIEVEMENTS_LIST: Achievement[] = [
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

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDosesTaken: 0,
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedStreak = localStorage.getItem("medibuddy_streak")
    const savedAchievements = localStorage.getItem("medibuddy_achievements")

    if (savedStreak) {
      setStreakData(JSON.parse(savedStreak))
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  const unlockAchievement = (achievementId: string) => {
    const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId)
    if (!achievement) return

    const alreadyUnlocked = achievements.some((a) => a.id === achievementId)
    if (alreadyUnlocked) return

    const unlockedAchievement = { ...achievement, unlockedAt: new Date() }
    const newAchievements = [...achievements, unlockedAchievement]
    setAchievements(newAchievements)
    localStorage.setItem("medibuddy_achievements", JSON.stringify(newAchievements))

    toast({
      title: `Achievement Unlocked! ${achievement.icon}`,
      description: achievement.name,
      duration: 5000,
    })
  }

  const recordDoseTaken = () => {
    const now = new Date()
    const lastDate = streakData.lastDoseDate ? new Date(streakData.lastDoseDate) : null

    let newStreak = streakData.currentStreak
    const isConsecutiveDay =
      lastDate && now.getTime() - lastDate.getTime() < 48 * 60 * 60 * 1000 && now.getDate() !== lastDate.getDate()

    if (!lastDate || isConsecutiveDay) {
      newStreak += 1
    } else if (lastDate && now.getDate() === lastDate.getDate()) {
      // Same day, don't increment
    } else {
      // Streak broken
      newStreak = 1
    }

    const newTotalDoses = streakData.totalDosesTaken + 1
    const newLongestStreak = Math.max(newStreak, streakData.longestStreak)

    const newStreakData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastDoseDate: now,
      totalDosesTaken: newTotalDoses,
    }

    setStreakData(newStreakData)
    localStorage.setItem("medibuddy_streak", JSON.stringify(newStreakData))

    // Check for achievements
    if (newTotalDoses === 1) unlockAchievement("first-dose")
    if (newStreak === 7) unlockAchievement("week-streak")
    if (newStreak === 30) unlockAchievement("month-streak")
    if (newTotalDoses === 100) unlockAchievement("hundred-doses")
    if (newStreak === 7) unlockAchievement("perfect-week")

    // Show streak celebration for milestones
    if (newStreak % 7 === 0 && newStreak > 0) {
      toast({
        title: `🔥 ${newStreak}-Day Streak!`,
        description: "You're on fire! Keep it up!",
        duration: 4000,
      })
    }
  }

  return (
    <GamificationContext.Provider
      value={{
        streakData,
        achievements,
        recordDoseTaken,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
