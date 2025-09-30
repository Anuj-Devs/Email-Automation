"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ButtonWithLoader from "@/components/button-with-loader"
import LoaderModal from "@/components/loader-modal"

export default function ClientLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      router.replace("/")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-(--muted) px-3 py-2 outline-none"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-(--muted) px-3 py-2 outline-none"
        />
        <ButtonWithLoader type="submit" className="justify-center">
          Sign in
        </ButtonWithLoader>
      </form>
      <LoaderModal open={loading} />
    </>
  )
}
