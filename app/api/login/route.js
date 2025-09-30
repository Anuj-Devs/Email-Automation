import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    const { rows } = await pool.query(`SELECT id, email, name FROM users WHERE email = $1 AND password = $2`, [
      email,
      password,
    ])

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: rows[0] })
  } catch (error) {
    console.error("[v0] Error during login:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
