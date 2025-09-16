"use client"

import { BackgroundVideo } from "./components/BackgroundVideo"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import NewsletterPopup from "./components/NewsletterPopup"
import { useState, useEffect } from "react"

export default function Home() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletterPopup(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        <BackgroundVideo />
      </div>
      <Footer />

      <NewsletterPopup showModal={showNewsletterPopup} onClose={() => setShowNewsletterPopup(false)} />
    </>
  )
}
