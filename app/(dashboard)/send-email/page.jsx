"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEmailConfigs, useEmailContents, useSentEmails } from "@/hooks/use-local-swr"
import { Loader2, PlusCircle, Mail, User, Clock } from "lucide-react"

function toNameFromEmail(email) {
  const name = email.split("@")[0]?.replace(/[._-]/g, " ") || ""
  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ")
}

function formatDateTime(dateString) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function SendEmailPage() {
  const router = useRouter()
  const { data: configs } = useEmailConfigs()
  const { data: contents } = useEmailContents()
  const { data: sent, setValue: setSent } = useSentEmails()

  const [toEmail, setToEmail] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [selectedId, setSelectedId] = useState(null)
  const [sending, setSending] = useState(false)

  const selectedContent = useMemo(
    () => contents.find((c) => c.id === selectedId) || null,
    [contents, selectedId],
  )

  const canSend =
    toEmail.trim().length > 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail) &&
    fromEmail &&
    selectedContent

  const onSend = async () => {
    if (!canSend || !selectedContent) return
    setSending(true)
    const record = {
      id: crypto.randomUUID(),
      toEmail,
      toName: toNameFromEmail(toEmail),
      fromEmail,
      fromName: toNameFromEmail(fromEmail),
      title: selectedContent.title,
      html: selectedContent.html,
      attachments: selectedContent.attachments,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(), // ✅ Added sentAt
    }
    await new Promise((r) => setTimeout(r, 1000))
    await setSent([record, ...sent])
    setSending(false)
    router.push("/email-list")
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-start">
      {/* Left Panel */}
      <Card className="lg:col-span-3 rounded-xl shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Send Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* To Email */}
          <div className="space-y-2">
            <Label htmlFor="toEmail">To Email</Label>
            <Input
              id="toEmail"
              placeholder="jane.doe@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              required
              type="email"
            />
          </div>

          {/* From Email */}
<div className="space-y-2">
  <Label>From Email</Label>
  <Select value={fromEmail} onValueChange={setFromEmail}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select configured email" />
    </SelectTrigger>
    <SelectContent>
      {configs.filter((c) => c.active).length === 0 ? (
        <div className="rounded-md border p-3 text-sm text-muted-foreground flex flex-col items-center gap-2">
          No Records Found
          <Button
            variant="link"
            size="sm"
            className="flex cursor-pointer items-center gap-1"
            onClick={() => router.push("/email-config")}
          >
            <PlusCircle size={16} /> Click Here to add
          </Button>
        </div>
      ) : (
        configs
          .filter((c) => c.active)
          .map((c) => (
            <SelectItem value={c.emailId} key={c.id}>
              {c.emailId}
            </SelectItem>
          ))
      )}
    </SelectContent>
  </Select>
</div>

{/* Select Email Content */}
<div className="space-y-2">
  <Label>Select Email Content</Label>
  <Select value={selectedId || ""} onValueChange={setSelectedId}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select email template" />
    </SelectTrigger>
    <SelectContent>
      {contents.filter((c) => c.active).length === 0 ? (
        <div className="rounded-md border p-3 text-sm text-muted-foreground flex flex-col items-center gap-2">
          No Records Found
          <Button
            variant="link"
            size="sm"
            className="flex cursor-pointer items-center gap-1"
            onClick={() => router.push("/email-contents")}
          >
            <PlusCircle size={16} /> Click Here to add
          </Button>
        </div>
      ) : (
        contents
          .filter((c) => c.active)
          .map((c) => (
            <SelectItem value={c.id} key={c.id}>
              {c.title}
            </SelectItem>
          ))
      )}
    </SelectContent>
  </Select>
</div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={onSend} disabled={!canSend || sending}>
              {sending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </span>
              ) : (
                "Send Email"
              )}
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Panel Preview */}
      <Card className="lg:col-span-2 rounded-xl shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedContent ? (
            <div className="space-y-4">
              {/* ✅ Meta Info Bar */}
              <div className="rounded-md border bg-muted/30 p-3 text-sm grid gap-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground" />
                  <span>
                    <span className="font-medium">To:</span>{" "}
                    {toEmail || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <span>
                    <span className="font-medium">From:</span>{" "}
                    {fromEmail || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDateTime(new Date().toISOString())}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div
                className="prose max-w-none border rounded-md p-3 bg-muted/20"
                dangerouslySetInnerHTML={{ __html: selectedContent.html }}
              />
              {selectedContent.attachments?.length ? (
                <div>
                  <div className="text-sm font-medium">Attachments:</div>
                  <ul className="mt-2 space-y-2">
                    {selectedContent.attachments.map((a) => (
                      <li
                        key={a.id}
                        className="text-sm text-muted-foreground truncate"
                      >
                        {a.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a content to preview
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
