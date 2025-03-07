"use client"

import { motion } from "motion/react"
import "remixicon/fonts/remixicon.css"

const socialLinks = [
  { iconClass: "ri-facebook-fill", href: "https://www.facebook.com/milcityusa/", label: "Facebook" },
  { iconClass: "ri-instagram-line", href: "https://www.instagram.com/milcityusa/", label: "Instagram" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#2A304C]/80 backdrop-blur-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-[#749EBF] sm:text-sm order-2 sm:order-1"
          >
            © {currentYear} 434 MEDIA. All rights reserved.
          </motion.p>

          <motion.div
            className="flex space-x-4 order-1 sm:order-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
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
                <i className={`${link.iconClass} text-2xl sm:text-3xl`} aria-hidden="true"></i>
                <span className="sr-only">{link.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

