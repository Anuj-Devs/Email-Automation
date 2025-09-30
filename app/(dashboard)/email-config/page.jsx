"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useEmailConfigs } from "@/hooks/use-local-swr"
import { ConfirmDeleteDialog } from "@/components/ui/Confirmdeletedialog"
export default function EmailConfigPage() {
  const { data: configs, setValue } = useEmailConfigs()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [smtp, setSmtp] = useState("")
  const [active, setActive] = useState(true)

  const isEditing = Boolean(editing)

  const [errors, setErrors] = useState({
    emailId: "",
    password: "",
    smtp: "",
  })
  

  const resetForm = () => {
    setEmailId("")
    setPassword("")
    setSmtp("")
    setActive(true)
    setEditing(null)
    setErrors({ emailId: "", password: "", smtp: "" })
  }

  const onAddNew = () => {
    resetForm()
    setOpen(true)
  }

  const onEdit = (c) => {
    setEditing(c)
    setEmailId(c.emailId)
    setPassword(c.password)
    setSmtp(c.smtp)
    setActive(c.active)
    setOpen(true)
  }

  const onSave = async () => {
    let hasError = false
    const newErrors = { emailId: "", password: "", smtp: "" }
  
    if (!emailId.trim()) {
      newErrors.emailId = "Email is required."
      hasError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId.trim())) {
      newErrors.emailId = "Enter a valid email."
      hasError = true
    }
  
    if (!password.trim()) {
      newErrors.password = "Password is required."
      hasError = true
    }
  
    if (!smtp.trim()) {
      newErrors.smtp = "SMTP/Server is required."
      hasError = true
    }
  
    setErrors(newErrors)
    if (hasError) return
  
    const now = new Date().toISOString()
    if (isEditing && editing) {
      const updated = configs.map((c) =>
        c.id === editing.id ? { ...c, emailId, password, smtp, active, updatedAt: now } : c
      )
      await setValue(updated)
    } else {
      const newC = {
        id: crypto.randomUUID(),
        emailId,
        password,
        smtp,
        active,
        createdAt: now,
        updatedAt: now,
      }
      await setValue([newC, ...configs])
    }
  
    setOpen(false)
    resetForm()
  }
  

  const onDelete = async (id) => {
    await setValue(configs.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-balance">Email Configuration</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={onAddNew}>Add New</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => {e.preventDefault()}}>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Configuration" : "Add Configuration"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
            <div className="space-y-2">
                  <Label htmlFor="emailId">Email ID</Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={emailId}
                    onChange={(e) => {
                      setEmailId(e.target.value)
                      if (errors.emailId) {
                        setErrors((prev) => ({ ...prev, emailId: "" }))
                      }
                    }}
                    className={errors.emailId ? "border-red-500" : ""}
                  />
                  {errors.emailId && <p className="text-red-500 text-xs -mt-1">{errors.emailId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }))
                      }
                    }}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-xs -mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp">SMTP / Server</Label>
                  <Input
                    id="smtp"
                    placeholder="smtp.example.com:587"
                    value={smtp}
                    onChange={(e) => {
                      setSmtp(e.target.value)
                      if (errors.smtp) {
                        setErrors((prev) => ({ ...prev, smtp: "" }))
                      }
                    }}
                    className={errors.smtp ? "border-red-500" : ""}
                  />
                  {errors.smtp && <p className="text-red-500 text-xs -mt-1">{errors.smtp}</p>}
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
                Close
              </Button>
              <Button onClick={onSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {configs.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-6 text-sm text-muted-foreground">No Records Found</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {configs.map((c) => (
            <Card
              key={c.id}
              className={`rounded-xl shadow transition hover:shadow-lg ${c.active ? "" : "card-inactive"}`}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 relative">
                {/* <CardTitle className="text-base">{c.emailId}</CardTitle> */}
                <div className="flex flex-col items-end gap-2 absolute right-2 top-0">
                  <Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Active" : "Inactive"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span> {c.emailId || "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Password:</span> xxxxxxx
                </div>
                <div>
                  <span className="text-muted-foreground">SMTP:</span> {c.smtp || "—"}
                </div>
                <div className="flex justify-end">
                <ConfirmDeleteDialog onConfirm={() => onDelete(c.id)}>
                  <Button
                    className="mr-2 bg-red-600/80 hover:bg-red-600 cursor-pointer"
                    size="sm"
                  >
                    Delete
                  </Button>
                </ConfirmDeleteDialog>
                  <Button className="cursor-pointer" size="sm" onClick={() => onEdit(c)}>
                    Edit
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
