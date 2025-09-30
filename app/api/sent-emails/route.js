import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, to_email, to_name, from_email, from_name, title, html, attachments, created_at
       FROM sent_emails
       ORDER BY created_at DESC`,
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error fetching sent emails:", error)
    return NextResponse.json({ error: "Failed to fetch sent emails" }, { status: 500 })
  }
}
