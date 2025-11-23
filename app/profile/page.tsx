"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  User,
  Bell,
  Shield,
  LogOut,
  Phone,
  Globe,
  Clock,
  Moon,
  Sun,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    emergencyContact: "",
    timezone: "",
    language: "en",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    updates: false,
  })

  const [privacy, setPrivacy] = useState({
    shareData: false,
    publicProfile: false,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age?.toString() || "",
        contact: user.contact || "",
        emergencyContact: user.emergencyContact || "",
        timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: user.language || "en",
      })
    }
  }, [user, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      await updateProfile({
        name: formData.name,
        age: formData.age ? Number.parseInt(formData.age) : undefined,
        contact: formData.contact,
        emergencyContact: formData.emergencyContact,
        timezone: formData.timezone,
        language: formData.language,
      })

      setSuccess(true)
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      })

      // Reset success state after a moment
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-secondary/30 transition-colors duration-300 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Profile Card */}
          <Card className="h-fit border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-card animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl opacity-90"></div>
            <CardContent className="pt-0 text-center relative">
              <div className="mb-4 relative inline-block -mt-12">
                <Avatar className="h-24 w-24 mx-auto border-[6px] border-background shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    {getInitials(user.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute bottom-1 right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-background"
                  title="Online"
                />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-1 tracking-tight">{user.name}</h2>
              <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
              <div className="flex justify-center gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100"
                >
                  Patient
                </Badge>
                <Badge variant="outline" className="border-border">
                  Premium
                </Badge>
              </div>
              <Separator className="mb-6" />
              <div className="text-sm text-muted-foreground text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span>Member Since</span>
                  <span className="font-medium text-foreground">Nov 2023</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Login</span>
                  <span className="font-medium text-foreground">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full bg-background border border-border p-1 h-auto grid grid-cols-3 mb-6 rounded-xl">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-secondary py-3 rounded-lg gap-2 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-secondary py-3 rounded-lg gap-2 transition-all"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="data-[state=active]:bg-secondary py-3 rounded-lg gap-2 transition-all"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Personal Information</CardTitle>
                    <CardDescription>Manage your personal details and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid gap-6">
                        <div className="grid gap-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="pl-10 h-11 bg-secondary/30 border-transparent hover:border-border focus:border-primary transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="age"
                              className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                            >
                              Age
                            </Label>
                            <Input
                              id="age"
                              type="number"
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              min="0"
                              max="150"
                              className="h-11 bg-secondary/30 border-transparent hover:border-border focus:border-primary transition-colors"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="language"
                              className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                            >
                              Language
                            </Label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                              <Select
                                value={formData.language}
                                onValueChange={(value) => setFormData({ ...formData, language: value })}
                              >
                                <SelectTrigger
                                  id="language"
                                  className="pl-10 h-11 bg-secondary/30 border-transparent hover:border-border focus:border-primary transition-colors"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="contact"
                            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            Contact Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="contact"
                              type="tel"
                              value={formData.contact}
                              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                              className="pl-10 h-11 bg-secondary/30 border-transparent hover:border-border focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="emergencyContact"
                            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            Emergency Contact
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-red-400" />
                            <Input
                              id="emergencyContact"
                              type="tel"
                              value={formData.emergencyContact}
                              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                              className="pl-10 h-11 bg-red-50 dark:bg-red-950/20 border-transparent hover:border-red-200 focus:border-red-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor="timezone"
                            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                          >
                            Timezone
                          </Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="timezone"
                              value={formData.timezone}
                              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                              className="pl-10 h-11 bg-secondary/30 border-transparent hover:border-border focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={loading || success}
                          className={`w-full sm:w-auto h-11 px-8 rounded-lg transition-all duration-300 ${success ? "bg-green-600 hover:bg-green-700" : ""}`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : success ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Saved Successfully
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-card">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Notification Preferences</CardTitle>
                    <CardDescription>Control how we communicate with you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive daily summaries</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(c) => setNotifications({ ...notifications, email: c })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Real-time medication alerts</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(c) => setNotifications({ ...notifications, push: c })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div className="space-y-0.5">
                          <Label className="text-base font-medium">Medication Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get reminded when it's time to take meds</p>
                        </div>
                        <Switch
                          checked={notifications.reminders}
                          onCheckedChange={(c) => setNotifications({ ...notifications, reminders: c })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        toast({
                          title: "Preferences Saved",
                          description: "Your notification settings have been updated.",
                        })
                      }
                    >
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">System Settings</CardTitle>
                    <CardDescription>Customize your app experience.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex flex-col space-y-1">
                        <Label className="font-medium leading-none">Theme Preference</Label>
                        <span className="text-xs text-muted-foreground">Switch between light and dark mode</span>
                      </div>
                      <div className="flex items-center gap-2 bg-background p-1 rounded-full border border-border">
                        <Button
                          variant={theme === "light" ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "ghost"}
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Privacy & Data</CardTitle>
                    <CardDescription>Manage your data privacy settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                          <Label htmlFor="share-data" className="font-medium leading-none">
                            Share Usage Data
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            Help us improve by sharing anonymous usage stats
                          </span>
                        </div>
                        <Switch
                          checked={privacy.shareData}
                          onCheckedChange={(c) => setPrivacy({ ...privacy, shareData: c })}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                          <Label htmlFor="public-profile" className="font-medium leading-none">
                            Public Profile
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            Allow other users to find you (Clinicians only)
                          </span>
                        </div>
                        <Switch
                          checked={privacy.publicProfile}
                          onCheckedChange={(c) => setPrivacy({ ...privacy, publicProfile: c })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/30 dark:hover:bg-red-950/30 bg-transparent"
                        >
                          Export Data
                        </Button>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
