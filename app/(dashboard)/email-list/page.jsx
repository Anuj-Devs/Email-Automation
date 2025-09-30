"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useSentEmails } from "@/hooks/use-local-swr"
import { Paperclip, ChevronDown, ChevronRight, File, Clock } from "lucide-react"

function AttachmentIcon({ has }) {
  return (
    <span
      aria-label={has ? "Has attachments" : "No attachments"}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition ${
        has ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      <Paperclip size={12} />
    </span>
  )
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function EmailListPage() {
  const { data: sent } = useSentEmails()
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Sent Emails</h1>

      {sent.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-6 text-sm text-muted-foreground text-center">
            No Records Found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sent.map((s) => {
            const expanded = expandedId === s.id
            return (
              <Card
                key={s.id}
                className={`rounded-xl shadow transition-all duration-300 py-0 ${
                  expanded ? "ring-2 ring-primary" : "hover:shadow-lg"
                }`}
              >
                {/* Header Row */}
                <button
                  className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition"
                  onClick={() => setExpandedId(expanded ? null : s.id)}
                >
                  <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-6 sm:gap-4 w-full">
                    <div>
                      <div className="text-muted-foreground">To</div>
                      <div className="font-medium truncate">{s.toName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">From</div>
                      <div className="font-medium truncate">{s.fromName}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Subject</div>
                      <div className="line-clamp-1 font-medium">{s.title}</div>
                    </div>
                    <div className="hidden items-center sm:flex">
                      <AttachmentIcon has={s.attachments?.length > 0} />
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-medium">{s.sentAt ? formatDateTime(s.sentAt) : '--'}</div>
                    </div>
                  </div>
                  <span className="ml-3 text-muted-foreground">
                    {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                </button>

                {/* Expanded Section */}
                {expanded ? (
                  <CardContent
                    className="space-y-4 border-t bg-muted/30 animate-in fade-in slide-in-from-top-1"
                  >
                    {/* Meta Info */}
                    {s.sentAt ? (
                      <div className="flex pt-4 items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>Sent on {formatDateTime(s.sentAt)}</span>
                      </div>

                    ) : null}

                    {/* Email Content */}
                    <div className="rounded-md border my-2 bg-background p-4 prose max-w-none text-sm">
                      <div dangerouslySetInnerHTML={{ __html: s.html }} />
                    </div>

                    {/* Attachments */}
                    {s.attachments?.length ? (
                      <div>
                        <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Paperclip size={14} /> Attachments
                        </div>
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {s.attachments.map((a) => (
                            <li
                              key={a.id}
                              className="rounded-md border bg-background p-3 hover:shadow-md transition"
                            >
                              <div className="text-sm font-medium truncate">{a.name}</div>
                              <div className="mt-2 overflow-hidden rounded-md border bg-muted/20 flex items-center justify-center">
                                {a.type.startsWith("image/") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={a.dataUrl || "/placeholder.svg"}
                                    alt={a.name}
                                    className="h-40 w-full object-contain"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center p-6 text-xs text-muted-foreground">
                                    <File size={20} className="mb-1" />
                                    No preview available
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                ) : null}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
