"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { X } from "lucide-react"

// Extend the Window interface to include the turnstile property
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
        },
      ) => string
      getResponse: (widgetId: string) => string | null
      reset: (widgetId: string) => void
    }
  }
}

const isDevelopment = process.env.NODE_ENV === "development"

interface NewsletterPopupProps {
  showModal: boolean
  onClose: () => void
}

export default function NewsletterPopup({ showModal, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // Load Turnstile script only when needed
  useEffect(() => {
    if (isDevelopment || turnstileWidget || !showModal) return

    const loadTurnstile = () => {
      if (document.getElementById("turnstile-script")) return

      const script = document.createElement("script")
      script.id = "turnstile-script"
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        if (window.turnstile && turnstileRef.current) {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
            callback: () => {
              // Token received, no action needed here
            },
          })
          setTurnstileWidget(widgetId)
        }
      }
    }

    loadTurnstile()

    return () => {
      // Clean up widget when component unmounts
      if (turnstileWidget && window.turnstile) {
        try {
          window.turnstile.reset(turnstileWidget)
        } catch (error) {
          console.error("Error resetting Turnstile widget:", error)
        }
      }
    }
  }, [turnstileWidget, showModal])

  const validateEmail = (email: string): boolean => {
    return emailPattern.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset previous states
    setError(null)

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address")
      inputRef.current?.focus()
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      inputRef.current?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      let turnstileResponse = undefined

      if (!isDevelopment) {
        if (!window.turnstile || !turnstileWidget) {
          throw new Error("Security verification not loaded. Please refresh and try again.")
        }

        turnstileResponse = window.turnstile.getResponse(turnstileWidget)
        if (!turnstileResponse) {
          throw new Error("Please complete the security verification")
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

      const responseData = await response.json()

      if (response.ok) {
        setEmail("")
        setIsSuccess(true)
        // Reset form
        formRef.current?.reset()

        // Reset success state and close modal after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          onClose()
        }, 3000)

        // Reset Turnstile if needed
        if (!isDevelopment && turnstileWidget && window.turnstile) {
          window.turnstile.reset(turnstileWidget)
        }
      } else {
        throw new Error(responseData.error || "Failed to subscribe to newsletter")
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(`${error instanceof Error ? error.message : "An unexpected error occurred"}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showModal) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1 md:p-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Close newsletter signup"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col lg:flex-row min-h-[500px] md:min-h-[600px]">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-slate-900/40 z-10" />
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/recap+poster.png"
                alt="Newsletter Recap Poster"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right Side - Newsletter Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                  >
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">Join our Community</h2>
                    <div className="w-16 h-1 bg-linear-to-r from-blue-400 to-cyan-300 mx-auto mb-6"></div>
                  </motion.div>

                  {/* Value Proposition */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-lg text-slate-300 leading-relaxed font-medium">
                      Get updates on unique events fostering collaboration between Academia, Industry, and the Military. Subscribe to our newsletter to stay connected.
                    </p>
                  </motion.div>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      ref={formRef}
                      key="subscribe-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      aria-label="Newsletter subscription form"
                    >
                      <div className="relative">
                        <label htmlFor="newsletter-email" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="newsletter-email"
                          ref={inputRef}
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-lg rounded-lg backdrop-blur-sm"
                          aria-describedby={error ? "newsletter-error" : undefined}
                          disabled={isSubmitting}
                          autoComplete="email"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-8 font-semibold text-lg rounded-lg transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] transform shadow-lg"
                        aria-label="Subscribe to newsletter"
                      >
                        <motion.div
                          animate={isSubmitting ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                          transition={isSubmitting ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : {}}
                          className="flex items-center justify-center"
                        >
                          {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                        </motion.div>
                      </button>

                      {!isDevelopment && (
                        <div
                          ref={turnstileRef}
                          data-theme="dark"
                          data-size="flexible"
                          className="w-full flex justify-center mt-6"
                          aria-label="Security verification"
                        />
                      )}

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          id="newsletter-error"
                          className="text-red-400 text-sm text-center font-medium bg-red-900/20 border border-red-400/30 p-3 rounded-lg"
                          role="alert"
                        >
                          {error}
                        </motion.div>
                      )}
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-6"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 rounded-full">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                          >
                            <CheckIcon className="h-8 w-8 text-white" />
                          </motion.div>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">Welcome Aboard!</h3>
                        <p className="text-slate-300 text-base leading-relaxed font-medium">
                          You're now subscribed to our newsletter. Get ready for exclusive updates and content!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
