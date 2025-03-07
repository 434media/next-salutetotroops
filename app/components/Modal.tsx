"use client"

import { motion } from "motion/react"
import "remixicon/fonts/remixicon.css"
import { Newsletter } from "./Newsletter"
import { useCallback, useEffect } from "react"

interface ModalProps {
  onClose: () => void
}

const socialLinks = [
  { icon: "ri-facebook-fill", href: "https://www.facebook.com/milcityusa/", label: "Facebook" },
  { icon: "ri-instagram-fill", href: "https://www.instagram.com/milcityusa/", label: "Instagram" },
]

export function Modal({ onClose }: ModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full h-full p-8 md:p-12 bg-gradient-to-br from-[#1A1E2E] via-[#2A304C] to-[#3A405C]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#749EBF] hover:text-[#ED2020] transition-colors"
          aria-label="Close modal"
        >
          <i className="ri-close-line text-3xl" />
        </button>

        <div className="max-w-5xl mx-auto space-y-8">
          <motion.h2
            className="text-3xl md:text-6xl font-bold text-[#749EBF] text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Connect with <span className="text-[#ED2020]">Salute to Troops</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto text-[#749EBF] text-center leading-relaxed"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <strong className="font-bold text-xl text-[#ED2020]">Salute to Troops</strong> is a unique event marketing
            platform dedicated to fostering collaboration between Academia, Industry, and the Military. Our mission is
            to drive innovation, build community, and assist the military in overcoming historic challenges related to
            recruitment, retention, and reintegration by creating impactful narratives.
          </motion.p>

          <motion.div
            className="flex justify-center space-x-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#749EBF] hover:text-[#ED2020] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`${link.icon} text-4xl`} />
                <span className="sr-only">{link.label}</span>
              </motion.a>
            ))}
          </motion.div>

          <motion.a
            href="https://buy.stripe.com/28o6oSabocgU8jC5kk"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md mx-auto text-center bg-[#585C2B] text-white py-3 rounded-full text-lg font-semibold hover:bg-[#ED2020] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sponsor the Mission
          </motion.a>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Newsletter />
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  )
}

