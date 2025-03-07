"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { Modal } from "./Modal"

const gradientAnimation = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 10,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0 mt-1">
            <Link href="/" passHref>
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/troops-darkbg.svg"
                alt="Salute to Troops"
                width={160}
                height={40}
                className="w-32 md:w-40 h-auto"
                priority
              />
            </Link>
          </div>
          <motion.div
            className="relative p-[2px] rounded-full bg-gradient-to-r from-[#ED2020] via-[#749EBF] to-[#585C2B]"
            variants={gradientAnimation}
            animate="animate"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(237, 32, 32, 0.5)" }}
          >
            <motion.button
              onClick={handleOpenModal}
              className="p-1 rounded-full bg-[#2A304C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#749EBF] transition-colors hover:bg-[#3A405C] aria-expanded:bg-[#3A405C]"
              aria-label="Open menu"
              aria-expanded={isModalOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src="/mcu.png" alt="Menu" width={32} height={32} className="rounded-full" />
            </motion.button>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>{isModalOpen && <Modal onClose={handleCloseModal} />}</AnimatePresence>
    </nav>
  )
}

