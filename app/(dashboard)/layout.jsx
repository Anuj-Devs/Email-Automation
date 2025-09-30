"use client"

import { Navbar } from "@/components/navbar"

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-8">{children}</main>
    </div>
  )
}
