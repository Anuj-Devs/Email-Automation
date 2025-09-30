import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, email_id, smtp, is_active, created_at, updated_at
       FROM email_configs
       ORDER BY created_at DESC`,
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error fetching email configs:", error)
    return NextResponse.json({ error: "Failed to fetch email configs" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { email_id, password, smtp, is_active } = await req.json()
    const { rows } = await pool.query(
      `INSERT INTO email_configs (email_id, password, smtp, is_active)
       VALUES ($1, $2, $3, COALESCE($4, true))
       RETURNING id, email_id, smtp, is_active, created_at, updated_at`,
      [email_id, password, smtp, is_active],
    )
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error creating email config:", error)
    return NextResponse.json({ error: "Failed to create email config" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, email_id, password, smtp, is_active } = await req.json()
    const { rows } = await pool.query(
      `UPDATE email_configs
       SET email_id = $1, password = $2, smtp = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, email_id, smtp, is_active, created_at, updated_at`,
      [email_id, password, smtp, is_active, id],
    )
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error updating email config:", error)
    return NextResponse.json({ error: "Failed to update email config" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await pool.query(`DELETE FROM email_configs WHERE id = $1`, [id])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Error deleting email config:", error)
    return NextResponse.json({ error: "Failed to delete email config" }, { status: 500 })
  }
}
