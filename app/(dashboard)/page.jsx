"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  { title: "Send Email", href: "/send-email", desc: "Compose and send an email" },
  { title: "Send Email List", href: "/email-list", desc: "View all sent emails" },
  { title: "Add Email Contents", href: "/email-contents", desc: "Manage reusable templates" },
  { title: "Email Configuration", href: "/email-config", desc: "Manage sending accounts" },
]

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {features.map((f) => (
        <Link key={f.href} href={f.href}>
          <Card className="group rounded-xl shadow hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-balance">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
