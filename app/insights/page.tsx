"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lightbulb, ExternalLink, Bookmark, Share2, AlertTriangle, Shield, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface HealthInsight {
  id: string
  slug: string
  title: string
  summary: string
  category: "safety" | "adherence" | "interactions" | "lifestyle"
  icon: any
  color: string
}

const HEALTH_INSIGHTS: HealthInsight[] = [
  {
    id: "1",
    slug: "medication-safety-tips",
    title: "Medication Safety Tips",
    summary: "Essential guidelines for safe medication use and storage",
    category: "safety",
    icon: Shield,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    slug: "recognizing-side-effects",
    title: "Recognizing Side Effects",
    summary: "Learn to identify and respond to common medication side effects",
    category: "safety",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "3",
    slug: "missed-dose-actions",
    title: "What To Do If You Miss a Dose",
    summary: "Best practices for handling missed medication doses",
    category: "adherence",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "4",
    slug: "drug-interaction-watchlist",
    title: "Drug Interaction Watchlist",
    summary: "Common medication combinations to watch and foods to avoid",
    category: "interactions",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "5",
    slug: "when-to-seek-care",
    title: "When to Seek Immediate Care",
    summary: "Warning signs that require urgent medical attention",
    category: "safety",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
]

export default function HealthInsightsPage() {
  const { toast } = useToast()
  const [savedInsights, setSavedInsights] = useState<string[]>([])

  const toggleSave = (insightId: string) => {
    if (savedInsights.includes(insightId)) {
      setSavedInsights(savedInsights.filter((id) => id !== insightId))
      toast({
        title: "Removed from saved",
        description: "Insight removed from your saved list",
      })
    } else {
      setSavedInsights([...savedInsights, insightId])
      toast({
        title: "Saved for later",
        description: "Insight added to your saved list",
      })
    }
  }

  const shareInsight = async (insight: HealthInsight) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: insight.title,
          text: insight.summary,
          url: `/insights/${insight.slug}`,
        })
        toast({
          title: "Shared successfully",
          description: "Insight shared via your device",
        })
      } catch (error) {
        // User cancelled or share failed - fallback to clipboard
        if (error instanceof Error && error.name !== "AbortError") {
          try {
            await navigator.clipboard.writeText(`${window.location.origin}/insights/${insight.slug}`)
            toast({
              title: "Link copied",
              description: "Insight link copied to clipboard instead",
            })
          } catch {
            toast({
              title: "Share failed",
              description: "Unable to share this insight",
              variant: "destructive",
            })
          }
        }
      }
    } else {
      // Fallback for browsers without share API
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/insights/${insight.slug}`)
        toast({
          title: "Link copied",
          description: "Insight link copied to clipboard",
        })
      } catch {
        toast({
          title: "Copy failed",
          description: "Unable to copy link to clipboard",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health Insights</h1>
            <p className="text-slate-600">Educational resources for better medication management</p>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Educational Content:</strong> These insights are for informational purposes only and do not
                constitute medical advice. Always consult your healthcare provider for personalized guidance.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {HEALTH_INSIGHTS.map((insight) => {
            const Icon = insight.icon
            const isSaved = savedInsights.includes(insight.id)

            return (
              <Card
                key={insight.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.open(`/insights/${insight.slug}`, "_blank")
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${insight.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {insight.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{insight.title}</CardTitle>
                  <CardDescription>{insight.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Link href={`/insights/${insight.slug}`} target="_blank">
                      <Button variant="default" size="sm" className="flex-1">
                        Read More
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSave(insight.id)
                      }}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareInsight(insight)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
