import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, html, attachments, is_active, created_at, updated_at
       FROM email_contents
       ORDER BY created_at DESC`,
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error fetching email contents:", error)
    return NextResponse.json({ error: "Failed to fetch email contents" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { title, html, attachments, is_active } = await req.json()
    const { rows } = await pool.query(
      `INSERT INTO email_contents (title, html, attachments, is_active)
       VALUES ($1, $2, $3, COALESCE($4, true))
       RETURNING id, title, html, attachments, is_active, created_at, updated_at`,
      [title, html, JSON.stringify(attachments || []), is_active],
    )
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error creating email content:", error)
    return NextResponse.json({ error: "Failed to create email content" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { id, title, html, attachments, is_active } = await req.json()
    const { rows } = await pool.query(
      `UPDATE email_contents
       SET title = $1, html = $2, attachments = $3, is_active = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, title, html, attachments, is_active, created_at, updated_at`,
      [title, html, JSON.stringify(attachments || []), is_active, id],
    )
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error updating email content:", error)
    return NextResponse.json({ error: "Failed to update email content" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await pool.query(`DELETE FROM email_contents WHERE id = $1`, [id])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Error deleting email content:", error)
    return NextResponse.json({ error: "Failed to delete email content" }, { status: 500 })
  }
}
