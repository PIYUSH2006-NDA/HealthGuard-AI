import { NextResponse } from "next/server"
import precautionsData from "@/lib/data/medicine_precautions.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")?.toLowerCase()

  if (!name) {
    return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
  }

  // Simple search implementation
  // In a real app, this would be a database query
  const medication = Object.values(precautionsData).find(
    (m) => m.name.toLowerCase() === name || m.name.toLowerCase().includes(name),
  )

  if (!medication) {
    return NextResponse.json({ error: "Medication not found" }, { status: 404 })
  }

  return NextResponse.json(medication)
}
