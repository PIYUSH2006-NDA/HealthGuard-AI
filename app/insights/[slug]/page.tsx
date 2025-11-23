"use client"

import Link from "next/link"
import { ArrowLeft, Shield, AlertTriangle, Clock, Users, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface InsightContent {
  [key: string]: {
    title: string
    category: string
    icon: any
    color: string
    content: {
      introduction: string
      sections: { title: string; content: string }[]
      actions: string[]
      references: { title: string; url: string }[]
    }
  }
}

const INSIGHT_CONTENT: InsightContent = {
  "medication-safety-tips": {
    title: "Medication Safety Tips",
    category: "safety",
    icon: Shield,
    color: "bg-blue-100 text-blue-600",
    content: {
      introduction:
        "Safe medication use is essential for effective treatment and preventing adverse events. Follow these evidence-based guidelines to ensure you're taking your medications safely.",
      sections: [
        {
          title: "Proper Storage",
          content:
            "Store medications in a cool, dry place away from direct sunlight. Most medications should be kept at room temperature (68-77°F). Keep medications in their original containers with labels intact. Store medications out of reach of children and pets.",
        },
        {
          title: "Taking Medications Correctly",
          content:
            "Always take medications exactly as prescribed by your healthcare provider. Follow instructions about timing, food requirements, and dosage. Use measuring devices provided or pharmacy-approved measuring tools. Never adjust your dose without consulting your doctor.",
        },
        {
          title: "Managing Multiple Medications",
          content:
            "Keep an updated list of all medications, including over-the-counter drugs and supplements. Use a pill organizer to prevent missed or duplicate doses. Set reminders using MediBuddy or other tools. Inform all healthcare providers about all medications you're taking.",
        },
      ],
      actions: [
        "Review your medication list with your doctor regularly",
        "Check expiration dates monthly and dispose of expired medications properly",
        "Use MediBuddy to track doses and set reminders",
        "Create an advice ticket if you have questions about your medications",
      ],
      references: [
        { title: "FDA: Using Medicines Safely", url: "https://www.fda.gov/drugs" },
        { title: "CDC: Medication Safety Program", url: "https://www.cdc.gov/medicationsafety" },
      ],
    },
  },
  "recognizing-side-effects": {
    title: "Recognizing Side Effects",
    category: "safety",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
    content: {
      introduction:
        "Understanding and recognizing medication side effects is crucial for your health. While most side effects are mild and temporary, some require immediate medical attention.",
      sections: [
        {
          title: "Common Side Effects",
          content:
            "Mild side effects may include nausea, drowsiness, dry mouth, or minor headaches. These often improve as your body adjusts to the medication. Document side effects in MediBuddy and report them to your healthcare provider at your next visit.",
        },
        {
          title: "Serious Side Effects - Seek Immediate Care",
          content:
            "Contact emergency services (911) immediately if you experience: difficulty breathing or swallowing, severe allergic reactions (hives, swelling, rash), chest pain or irregular heartbeat, severe dizziness or fainting, sudden vision changes, or unusual bleeding. These symptoms require urgent medical evaluation.",
        },
        {
          title: "Managing Side Effects",
          content:
            "Keep a detailed log of when side effects occur and their severity. Note what you were doing when symptoms appeared. Never stop taking prescribed medications without consulting your doctor. Use MediBuddy's symptom tracker to document patterns. Contact your healthcare provider if side effects interfere with daily activities.",
        },
      ],
      actions: [
        "Log all side effects in MediBuddy's symptom tracker",
        "Create an advice ticket for concerning symptoms",
        "Call your doctor if side effects persist or worsen",
        "Seek emergency care for severe symptoms listed above",
      ],
      references: [
        { title: "MedlinePlus: Drug Side Effects", url: "https://medlineplus.gov" },
        { title: "FDA MedWatch: Report Side Effects", url: "https://www.fda.gov/medwatch" },
      ],
    },
  },
  "missed-dose-actions": {
    title: "What To Do If You Miss a Dose",
    category: "adherence",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-600",
    content: {
      introduction:
        "Missing a medication dose occasionally happens to everyone. The key is knowing what to do when it occurs and how to prevent it in the future.",
      sections: [
        {
          title: "General Guidelines",
          content:
            "If you remember within a few hours of your scheduled dose, take it as soon as possible. If it's almost time for your next dose, skip the missed dose and resume your regular schedule. Never double up doses to make up for a missed one unless specifically instructed by your doctor. Each medication may have specific instructions, so check with your pharmacist.",
        },
        {
          title: "Time-Sensitive Medications",
          content:
            "Some medications require strict adherence to timing, including: antibiotics (maintain consistent blood levels), anticoagulants like warfarin (risk of clotting), insulin and diabetes medications (blood sugar control), heart medications (blood pressure management). Contact your healthcare provider immediately if you miss doses of these medications.",
        },
        {
          title: "Prevention Strategies",
          content:
            "Use MediBuddy's smart reminders to get notifications before each dose. Set multiple alarms if needed. Link medication times to daily routines (e.g., brushing teeth). Use a pill organizer to visually track doses. Keep medications visible in a safe, consistent location. Enlist family or caregivers for backup reminders.",
        },
      ],
      actions: [
        "Enable MediBuddy reminders for all medications",
        "Contact your doctor if you miss multiple doses",
        "Review your medication schedule if you frequently miss doses",
        "Set up caregiver notifications through MediBuddy",
      ],
      references: [{ title: "American Pharmacists Association", url: "https://www.pharmacist.com" }],
    },
  },
  "drug-interaction-watchlist": {
    title: "Drug Interaction Watchlist",
    category: "interactions",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-600",
    content: {
      introduction:
        "Drug interactions occur when medications affect each other's performance or increase side effects. Understanding potential interactions helps keep you safe.",
      sections: [
        {
          title: "Common Drug Interactions",
          content:
            "Blood thinners (warfarin) interact with many medications, including NSAIDs and certain antibiotics. Statins and certain antibiotics can increase muscle damage risk. Diabetes medications may interact with beta-blockers. SSRIs and NSAIDs together increase bleeding risk. Always inform all your healthcare providers about every medication you take.",
        },
        {
          title: "Food and Medication Interactions",
          content:
            "Grapefruit juice affects many medications, including statins and some heart medications. Vitamin K-rich foods (leafy greens) can reduce warfarin effectiveness. Dairy products can interfere with some antibiotics. Alcohol can interact dangerously with many medications. Always ask your pharmacist about food restrictions with new medications.",
        },
        {
          title: "Supplement Interactions",
          content:
            "Herbal supplements and vitamins can interact with prescription medications. St. John's Wort interacts with many drugs including antidepressants and birth control. Vitamin E and fish oil can increase bleeding risk with blood thinners. Always disclose all supplements to your healthcare team. MediBuddy will flag known interactions when you add medications.",
        },
      ],
      actions: [
        "Review MediBuddy's interaction warnings when adding medications",
        "Inform all providers about supplements and over-the-counter drugs",
        "Consult your pharmacist before starting new medications or supplements",
        "Create an advice ticket if you have interaction concerns",
      ],
      references: [
        { title: "NIH: Drug Interactions", url: "https://www.nih.gov" },
        { title: "FDA: Drug Interactions", url: "https://www.fda.gov" },
      ],
    },
  },
  "when-to-seek-care": {
    title: "When to Seek Immediate Care",
    category: "safety",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    content: {
      introduction:
        "Knowing when to seek immediate medical care can be life-saving. Some medication-related symptoms require urgent evaluation, while others can be addressed during regular office visits.",
      sections: [
        {
          title: "Emergency Situations - Call 911",
          content:
            "Seek immediate emergency care for: signs of allergic reaction (difficulty breathing, throat swelling, severe rash), chest pain or pressure, severe abdominal pain, confusion or altered mental status, seizures, loss of consciousness, severe bleeding that won't stop, signs of stroke (facial drooping, arm weakness, speech difficulty). Do not drive yourself to the hospital - call 911.",
        },
        {
          title: "Urgent But Not Emergency",
          content:
            "Contact your doctor's office immediately or visit urgent care for: persistent vomiting or diarrhea, moderate allergic reactions, severe headache without other emergency signs, unexplained fever above 101°F, significant swelling or rash, medication side effects interfering with function. Use MediBuddy to create a high-priority advice ticket with detailed symptoms.",
        },
        {
          title: "Schedule Regular Appointment",
          content:
            "These situations warrant a scheduled doctor visit: questions about medication effectiveness, mild side effects that persist, need for medication adjustment, routine medication reviews, new symptoms that develop gradually. Use MediBuddy's advice request feature to communicate with your care team and schedule appropriately.",
        },
      ],
      actions: [
        "Save emergency contact numbers in your phone",
        "Keep a list of your medications and allergies accessible",
        "Use MediBuddy to escalate concerns to your care team",
        "Inform caregivers about warning signs to watch for",
      ],
      references: [
        { title: "American College of Emergency Physicians", url: "https://www.acep.org" },
        { title: "CDC: When to Seek Medical Care", url: "https://www.cdc.gov" },
      ],
    },
  },
}

export default function InsightDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const insight = INSIGHT_CONTENT[slug]

  if (!insight) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insight Not Found</h2>
          <p className="text-slate-600 mb-6">The requested health insight could not be found.</p>
          <Link href="/insights">
            <Button>Back to Insights</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const Icon = insight.icon

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/insights" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <Badge variant="outline" className="capitalize">
            {insight.category}
          </Badge>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-4 rounded-lg ${insight.color}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{insight.title}</h1>
                <p className="text-lg text-slate-600">{insight.content.introduction}</p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 mt-8">
              {insight.content.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
                  <p className="text-slate-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Suggested Actions */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended Actions</h3>
              <ul className="space-y-2">
                {insight.content.actions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Create Advice Ticket CTA */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Have Questions?</h3>
              <p className="text-slate-700 mb-4">
                If you have concerns about your medications or symptoms, create an advice ticket to connect with your
                healthcare team.
              </p>
              <Link href="/advice">
                <Button>
                  Create Advice Request
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* References */}
            {insight.content.references.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">References & Resources</h3>
                <ul className="space-y-2">
                  {insight.content.references.map((ref, index) => (
                    <li key={index}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        {ref.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">
                <strong>Disclaimer:</strong> This information is for educational purposes only and does not constitute
                medical advice. Always consult your healthcare provider for diagnosis and treatment. In case of
                emergency, call 911 immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
