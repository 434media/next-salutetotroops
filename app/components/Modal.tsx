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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-50 h-full w-full md:w-1/2 bg-gradient-to-br from-[#1A1E2E] via-[#2A304C] to-[#3A405C] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#749EBF] hover:text-[#ED2020] transition-colors z-10"
          aria-label="Close menu"
        >
          <i className="ri-close-line text-4xl" />
        </button>

        <div className="p-8 md:p-12 space-y-10 min-h-full flex flex-col">
          <motion.div
            className="space-y-8 flex-1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="">
              <h2 className="text-4xl md:text-5xl font-bold text-[#ED2020] leading-tight">Salute to Troops</h2>
            </div>

            <div className="">
              <p className="text-lg md:text-xl text-[#749EBF] leading-relaxed font-medium">
                A unique event marketing platform dedicated to fostering collaboration between Academia, Industry, and
                the Military. Our mission is to drive innovation, build community, and assist the military in overcoming
                historic challenges related to recruitment, retention, and reintegration by creating impactful
                narratives.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#ED2020]">Follow Our Mission</h3>
              <div className="flex gap-8">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 text-[#749EBF] hover:text-[#ED2020] transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="p-4 rounded-lg bg-[#749EBF]/10 group-hover:bg-[#ED2020]/10 transition-colors">
                      <i className={`${link.icon} text-5xl`} />
                    </div>
                    <span className="text-lg font-semibold">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#ED2020]">Support Our Cause</h3>
              <motion.a
                href="https://buy.stripe.com/28o6oSabocgU8jC5kk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#585C2B] text-white text-xl font-bold rounded-lg hover:bg-[#ED2020] transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-heart-fill mr-3 text-2xl" />
                Sponsor the Mission
              </motion.a>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#ED2020]">Stay Informed</h3>
              <Newsletter />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
