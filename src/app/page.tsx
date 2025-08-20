"use client"
import React from "react"
import { motion } from "framer-motion"
import MaskedDiv from "@/components/ui/masked-div"
import { useRevealer } from "@/hooks/useRevealer"

const Page = () => {
  const revealerDone = useRevealer() // ✅ now boolean

  return (
    <>
      {/* Revealer overlay */}
      <div className="revealer fixed inset-0 bg-purple-600 origin-top z-50"></div>

      {/* Render content ONLY after revealer animation */}
      {revealerDone && (
        <>
          {/* Background video */}
          <MaskedDiv
            maskType="type-4"
            size={0.9}
            className="w-full h-screen absolute top-30 overflow-hidden"
          >
            <video autoPlay loop muted className="w-full h-full object-cover">
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </MaskedDiv>

          {/* Floating CTA Button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <motion.button
              initial={{ width: 64, borderRadius: 9999 }}
              whileHover={{ width: 260 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-16 flex items-center justify-center overflow-hidden
                         text-white font-medium shadow-xl 
                         bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                         bg-[length:200%_200%] animate-gradient-move"
            >
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="whitespace-nowrap px-4"
              >
                Get free discovery call
              </motion.span>
            </motion.button>
          </div>
        </>
      )}
    </>
  )
}

export default Page
