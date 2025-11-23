"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "patient" | "caregiver" | "clinician"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  age?: number
  contact?: string
  emergencyContact?: string
  timezone?: string
  language?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user storage (in production, this would be in a database)
const MOCK_USERS_KEY = "medibuddy_users"
const CURRENT_USER_KEY = "medibuddy_current_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Failed to parse user data", e)
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
  }, [])

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // Get existing users
    const usersStr = localStorage.getItem(MOCK_USERS_KEY) || "[]"
    let users: any[] = []
    try {
      users = JSON.parse(usersStr)
    } catch (e) {
      console.error("Failed to parse users list", e)
      users = []
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    if (users.find((u: any) => u.email === normalizedEmail)) {
      throw new Error("User already exists")
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: normalizedEmail, // store normalized email
      name,
      role,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: "en",
    }

    // Store password separately (in production, hash this!)
    users.push({ ...newUser, password })
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))

    // Set as current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
    setUser(newUser)
    setIsAuthenticated(true)
  }

  const login = async (email: string, password: string) => {
    const usersStr = localStorage.getItem(MOCK_USERS_KEY) || "[]"
    let users: any[] = []
    try {
      users = JSON.parse(usersStr)
    } catch (e) {
      console.error("Failed to parse users list", e)
      users = []
    }

    const normalizedEmail = email.toLowerCase().trim()
    const foundUser = users.find((u: any) => u.email === normalizedEmail && u.password === password)

    if (!foundUser) {
      throw new Error("Invalid credentials")
    }

    const { password: _, ...userWithoutPassword } = foundUser
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    setUser(userWithoutPassword)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
    setUser(updatedUser)

    // Update in users list too
    const usersStr = localStorage.getItem(MOCK_USERS_KEY) || "[]"
    let users: any[] = []
    try {
      users = JSON.parse(usersStr)
    } catch (e) {
      console.error("Failed to parse users list", e)
      users = []
    }

    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
