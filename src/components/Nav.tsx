"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransitionRouter } from "next-view-transitions"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const Nav = () => {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowNav(true), 500)
    return () => clearTimeout(timer)
  }, [])

  function triggerPageTransition() {
    document.documentElement.animate(
      [
        {
          clipPath: "polygon(25% 75%, 75% 75%, 75% 75%, 25% 75%)",
        },
        {
          clipPath: "polygon(0 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    if (pathname === path) {
      e.preventDefault()
      return
    }
    router.push(path, { onTransitionReady: triggerPageTransition })
  }

  return (
    <AnimatePresence>
      <motion.nav
        initial={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={
          showNav
            ? {
                width: 400,
                height: 60,
                borderRadius: "9999px",
                top: "2rem",
                left: "50%",
                x: "-50%",
                y: 0,
              }
            : {}
        }
        transition={{ duration: 2.1, ease: [0.76, 0, 0.24, 1] }}
        className="fixed z-50 flex items-center justify-center gap-8 
                   bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 
                   text-white font-medium shadow-xl"
      >
        <Link href="/" onClick={handleNavigation("/")}>
          Home
        </Link>
        <Link href="/work" onClick={handleNavigation("/work")}>
          Work
        </Link>
        <Link href="/studio" onClick={handleNavigation("/studio")}>
          Studio
        </Link>
      </motion.nav>
    </AnimatePresence>
  )
}

export default Nav
