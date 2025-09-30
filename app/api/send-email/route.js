import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req) {
  try {
    const { to_email, to_name, from_email, from_name, title, html, attachments } = await req.json()

    const { rows } = await pool.query(
      `INSERT INTO sent_emails (to_email, to_name, from_email, from_name, title, html, attachments)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, to_email, to_name, from_email, from_name, title, html, attachments, created_at`,
      [to_email, to_name, from_email, from_name, title, html, JSON.stringify(attachments || [])],
    )

    return NextResponse.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
