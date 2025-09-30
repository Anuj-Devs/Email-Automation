"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-local-swr"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: auth, setValue: setAuth } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const logout = () => {
    setAuth(null)
    setDropdownOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  const links = [
    { href: "/", label: "Home" },
    { href: "/send-email", label: "Send Email" },
    { href: "/email-list", label: "Send Email List" },
    { href: "/email-contents", label: "Add Email Contents" },
    { href: "/email-config", label: "Email Configuration" },
  ]

  return (
    <header className="glass fixed top-0 left-0 right-0 z-40 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center bg-gray-300/60 justify-between px-4">
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="font-semibold text-balance">
            Email Automation
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("rounded-md px-3 py-1.5 text-sm hover:bg-muted", pathname === l.href && "bg-white font-semibold")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: Avatar / Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 w-9 rounded-full p-0 hover:opacity-80 transition"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-popover text-popover-foreground shadow-lg glass-popover animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Anuj Katariya</span>
                    <span className="text-xs text-muted-foreground">anujkatariya1400@gmail.com</span>
                  </div>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      router.push("/")
                      setDropdownOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-destructive transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-In */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
            ref={mobileMenuRef}
            className={cn(
              "fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-in-out",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-lg">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm hover:bg-muted transition",
                  pathname === l.href && "bg-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
