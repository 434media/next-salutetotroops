"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string
      getResponse: (widgetId: string) => string | null
      reset: (widgetId: string) => void
    }
  }
}

const isDevelopment = process.env.NODE_ENV === "development"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null)

  useEffect(() => {
    if (!isDevelopment && !window.turnstile) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        if (window.turnstile && turnstileRef.current && !turnstileWidget) {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
            callback: (token: string) => {
              console.log("Turnstile token:", token)
            },
          })
          setTurnstileWidget(widgetId)
        }
      }

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [turnstileWidget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let turnstileResponse = undefined

      if (!isDevelopment) {
        if (!window.turnstile || !turnstileWidget) {
          throw new Error("Turnstile is not initialized")
        }

        turnstileResponse = window.turnstile.getResponse(turnstileWidget)
        if (!turnstileResponse) {
          throw new Error("Failed to get Turnstile response")
        }
      }

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(turnstileResponse && { "cf-turnstile-response": turnstileResponse }),
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Newsletter subscription failed")
        } else {
          const errorText = await response.text()
          console.error("Server response:", errorText)
          throw new Error("An unexpected error occurred. Please try again later.")
        }
      }

      setEmail("")
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 5000) // Reset success state after 5 seconds
      if (!isDevelopment && turnstileWidget) {
        if (window.turnstile) {
          window.turnstile.reset(turnstileWidget)
        }
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(`${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="subscribe-form"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-semibold text-[#749EBF] text-center mb-4">Subscribe to our Newsletter</h3>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#1E2235] rounded-full text-white placeholder-[#4A5069] focus:outline-none focus:ring-2 focus:ring-[#749EBF] transition-all duration-300 text-sm md:text-base"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 bottom-1 px-6 bg-[#585C2B] text-white rounded-full hover:bg-[#ED2020] transition-colors disabled:opacity-50 disabled:hover:bg-[#585C2B] text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </div>
            {!isDevelopment && <div ref={turnstileRef} data-size="compact" className="w-full" />}
            {error && <p className="text-[#ED2020] text-sm text-center">{error}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#585C2B] px-6 py-3 rounded-full text-white text-center text-sm md:text-base"
          >
            Thanks for subscribing! Check your email to confirm.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

