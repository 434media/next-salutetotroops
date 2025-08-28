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
    <footer className="fixed bottom-0 left-0 right-0 bg-[#1A1F35]/90 backdrop-blur-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-[#749EBF] sm:text-base order-2 sm:order-1"
          >
            © {currentYear} 434 MEDIA. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
