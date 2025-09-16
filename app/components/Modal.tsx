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
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 z-50 h-full w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto shadow-2xl border-l border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-all duration-300 z-10 p-2 rounded-full hover:bg-slate-800/50"
          aria-label="Close menu"
        >
          <i className="ri-close-line text-3xl" />
        </button>

        <div className="min-h-full">
          {/* Header Section */}
          <motion.div
            className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-8 lg:p-12 border-b border-slate-600/30"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 leading-tight">
                Salute to Troops
              </h1>
              <p className="text-lg lg:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mt-6">
                A unique event marketing platform fostering collaboration between Academia, Industry, and the Military.
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="p-8 lg:p-12 space-y-12">
            {/* Mission Section */}
            <motion.section
              className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-400 mb-4 flex items-center">
                <i className="ri-flag-line mr-3 text-3xl" />
                Our Mission
              </h3>
              <p className="text-base lg:text-lg text-slate-300 leading-relaxed font-medium">
                Drive innovation, build community, and assist the military in overcoming historic challenges related to
                recruitment, retention, and reintegration by creating impactful narratives.
              </p>
            </motion.section>

            {/* Social Media Section */}
            <motion.section
              className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-8 rounded-2xl border border-blue-500/20"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-400 mb-2 flex items-center">
                <i className="ri-share-line mr-3 text-3xl" />
                MilCityUSA
              </h3>
              <p className="text-lg text-blue-200 font-semibold mb-6">
                MilCityUSA is a news and media hub promoting federal and military entrepreneurialism and innovation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 bg-slate-800/50 hover:bg-blue-900/30 rounded-xl border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300">
                      <i className={`${link.icon} text-3xl text-blue-400 group-hover:text-blue-300`} />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300">Follow us on {link.label}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.section>

            {/* Sponsor Section */}
            <motion.section
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-8 rounded-2xl border border-green-500/20"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-green-400 mb-2 flex items-center">
                <i className="ri-heart-fill mr-3 text-3xl" />
                Support Our Cause
              </h3>
              <p className="text-lg text-green-200 font-semibold mb-6">
                Help us make a difference in military communities
              </p>
              <motion.a
                href="https://buy.stripe.com/28o6oSabocgU8jC5kk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="ri-heart-fill mr-3 text-xl" />
                Sponsor the Mission
              </motion.a>
            </motion.section>

            {/* Newsletter Section */}
            <motion.section
              className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-8 rounded-2xl border border-red-500/20"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-red-400 mb-2 flex items-center">
                <i className="ri-mail-line mr-3 text-3xl" />
                Stay Informed
              </h3>
              <p className="text-lg text-red-200 font-semibold mb-6">
                Get updates on our latest initiatives and events
              </p>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-600/30">
                <Newsletter />
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </>
  )
}
