"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(`${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
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
                className="w-full px-4 py-3 bg-[#1E2235] rounded-lg text-white placeholder-[#4A5069] focus:outline-none focus:ring-2 focus:ring-[#749EBF] transition-all duration-300 text-sm md:text-base"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 bottom-1 px-6 bg-[#585C2B] text-white rounded-lg hover:bg-[#ED2020] transition-colors disabled:opacity-50 disabled:hover:bg-[#585C2B] text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </div>
            {error && <p className="text-[#ED2020] text-sm text-center">{error}</p>}
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#585C2B] px-6 py-3 rounded-lg text-white text-center text-sm md:text-base"
          >
            Thanks for subscribing! Check your email to confirm.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

