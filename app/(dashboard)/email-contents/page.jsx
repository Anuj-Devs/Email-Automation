"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useEmailContents } from "@/hooks/use-local-swr"
import { Trash2, Pencil } from "lucide-react"
import {ConfirmDeleteDialog} from "@/components/ui/Confirmdeletedialog"
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: String(reader.result),
      })
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function sanitizeHtmlContent(html) {
  if (!html) return ""
  const trimmed = html.replace(/(<p><br><\/p>\s*)+$/gi, "").trim()
  if (trimmed === "<p><br></p>" || trimmed === "") return ""
  return trimmed
}

export default function EmailContentsPage() {
  const { data: contents, setValue } = useEmailContents()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")
  const [attachments, setAttachments] = useState([])
  const [active, setActive] = useState(true)

  const [error, setError] = useState(false)

  const isEditing = Boolean(editing)

  const resetForm = () => {
    setSubject("")
    setHtml("")
    setAttachments([])
    setActive(true)
    setEditing(null)
    setError(false)
  }

  const onAddNew = () => {
    resetForm()
    setOpen(true)
  }

  const onEdit = (c) => {
    setEditing(c)
    setSubject(c.title)
    setHtml(c.html)
    setAttachments(c.attachments || [])
    setActive(c.active)
    setOpen(true)
  }

  const onFilesChange = async (files) => {
    if (!files) return
    const arr = await Promise.all(Array.from(files).map(fileToDataUrl))
    setAttachments((prev) => [...prev, ...arr])
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const onSave = async () => {
    if (!subject.trim()) {
      setError(true)
      return
    }
    const now = new Date().toISOString()
    if (isEditing && editing) {
      const updated = contents.map((c) =>
        c.id === editing.id ? { ...c, title: subject, html, attachments, active, updatedAt: now } : c,
      )
      await setValue(updated)
    } else {
      const newC = {
        id: crypto.randomUUID(),
        title: subject,
        html,
        attachments,
        active,
        createdAt: now,
        updatedAt: now,
      }
      await setValue([newC, ...contents])
    }
    setOpen(false)
    resetForm()
  }

  const onDelete = async (id) => {
    await setValue(contents.filter((c) => c.id !== id))
  }

  const list = useMemo(() => contents, [contents])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Email Contents</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onAddNew}>Add New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Email Content" : "Add Email Content"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {/* SUBJECT FIELD */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    if (e.target.value.trim()) setError(false)
                  }}
                  className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {error && <p className="text-xs text-red-500 -mt-1">Subject is required</p>}
              </div>

              <RichTextEditor value={html} onChange={setHtml} label="Email Content" />

              <div className="space-y-2">
                <Label htmlFor="files">Attachments</Label>
                <Input id="files" type="file" multiple onChange={(e) => onFilesChange(e.target.files)} />
                {attachments.length ? (
                  <ul className="mt-2 space-y-2">
                    {attachments.map((a) => (
                      <li key={a.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="truncate">{a.name}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeAttachment(a.id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <button
                  type="button"
                  onClick={() => setActive((v) => !v)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
              >
                Discard
              </Button>
              <Button onClick={onSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST VIEW */}
      {list.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-6 text-sm text-muted-foreground">No Records Found</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-start">
          {list.map((c) => (
            <Card
            key={c.id}
            className={`group shadow transition duration-300 
              hover:z-50 hover:scale-[1.02] group relative rounded-xl hover:bg-gray-900 hover:text-white`}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <CardTitle className="text-base">{c.title}</CardTitle>
              <Badge className="group-hover:bg-white group-hover:text-black" variant={c.active ? "default" : "secondary"}>{c.active ? "Active" : "Inactive"}</Badge>
            </CardHeader>
          
            {/* Expanded Details */}
            <CardContent
              className={`
                transition-all duration-300 space-y-3 
                max-h-0 opacity-0 overflow-hidden
                group-hover:max-h-[800px] group-hover:opacity-100 group-hover:overflow-visible
              `}
            >
              <div className="text-gray-300 text-sm pt-4">Content:</div>
              <div
                className="prose prose-invert max-w-none text-sm -mt-2"
                dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(c.html) }}
              />
          
              <div className="space-y-2">
                <div className="text-gray-300 text-sm">Attachments:</div>
                {c.attachments.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {c.attachments.map((a) => (
                      <li
                        key={a.id}
                        className="relative cursor-pointer px-2 py-1 rounded-md bg-gray-700 text-xs group/att"
                      >
                        {a.name}
                        {/* Preview on hover */}
                        <div className="absolute hidden group-hover/att:block left-0 top-6 z-50 w-40 bg-white p-2 rounded shadow-lg">
                          {a.type.startsWith("image/") ? (
                            <img src={a.dataUrl} alt={a.name} className="w-full h-auto rounded" />
                          ) : (
                            <p className="text-xs text-gray-600">No preview available</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-400">No attachments</div>
                )}
              </div>
          
              <div className="flex items-center justify-end gap-2 pt-2">
              <ConfirmDeleteDialog onConfirm={() => onDelete(c.id)}>
                <Button
                  size="icon"
                  className="bg-red-600/80 hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 size={16} />
                </Button>
              </ConfirmDeleteDialog>
                <Button className="bg-gray-600/80 hover:bg-gray-600 cursor-pointer" size="icon" onClick={() => onEdit(c)}>
                  <Pencil size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          ))}
        </div>
      )}
    </div>
  )
}
