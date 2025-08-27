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
  const [showHellos, setShowHellos] = useState(false)
  const [showNavItems, setShowNavItems] = useState(false)
  const [currentHelloIndex, setCurrentHelloIndex] = useState(0)

  // Different "hello" greetings in various languages
  const hellos = [
    { text: "Hello", lang: "English" },
    { text: "Hola", lang: "Spanish" },
    { text: "Bonjour", lang: "French" },
    { text: "Ciao", lang: "Italian" }
  ]

  useEffect(() => {
    // Show hellos immediately when nav appears in circle form
    const showNavTimer = setTimeout(() => {
      setShowNav(true)
      setShowHellos(true)
    }, 500)
    
    // Start transitioning to nav items as the capsule animation begins
    const showNavItemsTimer = setTimeout(() => {
      setShowHellos(false)
      setShowNavItems(true)
    }, 1800) // Start transition during capsule formation
    
    return () => {
      clearTimeout(showNavTimer)
      clearTimeout(showNavItemsTimer)
    }
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
                   text-white font-medium shadow-xl overflow-hidden"
      >
        {/* Hello animations - cycle through languages in circle form */}
        <AnimatePresence mode="wait">
          {showHellos && !showNavItems && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHelloIndex}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.7,
                    rotateY: 90
                  }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    rotateY: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.7,
                    rotateY: -90
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.76, 0, 0.24, 1]
                  }}
                  className="text-white font-medium text-lg"
                >
                  {hellos[currentHelloIndex].text}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation items */}
        <AnimatePresence>
          {showNavItems && (
            <div className="flex items-center justify-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
              >
                <Link href="/" onClick={handleNavigation("/")}>
                  Home
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Link href="/work" onClick={handleNavigation("/work")}>
                  Case Studies
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/studio" onClick={handleNavigation("/studio")}>
                  Contact Me
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/testimonial" onClick={handleNavigation("/testimonial")}>
                  Testimonial
                </Link>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  )
}

export default Nav
