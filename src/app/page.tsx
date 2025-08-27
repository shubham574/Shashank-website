"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Variants } from "framer-motion";
import { usePathname } from "next/navigation"
import { useTransitionRouter } from "next-view-transitions"
import { useRevealer } from "@/hooks/useRevealer"
import Nav from "@/components/Nav"
import Scroll from "@/components/horizontalScroll";
import Page4 from "@/components/page4";
import Page2 from "@/components/page2";
 import InfiniteCardsPage from "@/components/testimonialCard"
import VideoScrollComponent from "@/components/page3";
import localFont from "next/font/local";

const mori = localFont({
    src:"../../public/fonts/Mori-Regular.otf"
})

const textVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Circular Progress Component
const ScrollCircle = ({ progress, onComplete }: { progress: number, onComplete: () => void }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  
  // Fix: Ensure progress is a valid number, default to 0 if NaN
  const validProgress = isNaN(progress) ? 0 : progress;
  const strokeDashoffset = circumference - (validProgress / 100) * circumference;

  useEffect(() => {
    if (validProgress >= 100) {
      onComplete();
    }
  }, [validProgress, onComplete]);

  return (
    <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-40">
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 70 70"
        >
          {/* Background circle */}
          <circle
            cx="35"
            cy="35"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="2"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="35"
            cy="35"
            r={radius}
            stroke="#8b5cf6"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />
        </svg>
        {/* Center number - Fixed to handle NaN */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-purple-600">
            {Math.round(validProgress)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const revealerDone = useRevealer();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);

  const lines = [
    "Welcome!",
    "From designers to",
    "developers, we've",
    "got you covered.",
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Fix: Prevent division by zero which causes NaN
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100));
    };

    // Initial call to set progress
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exact same transition function from Nav component
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

  // Navigation handler using the same logic as Nav component
  const handleNavigation = (path: string) => {
    if (pathname === path) {
      return;
    }
    router.push(path, { onTransitionReady: triggerPageTransition });
  };

  const handleCircleComplete = () => {
    // Use the same navigation handler as Nav component
    handleNavigation('/work');
  };

  return (
    <>
      {/* Revealer overlay */}
      <div className="revealer fixed inset-0 bg-purple-600 origin-top z-50"></div>

      {/* Navigation Component */}
      <Nav />

      {/* Render content ONLY after revealer animation */}
      {revealerDone && (
        <>
          {/* Scroll Progress Circle */}
          <ScrollCircle 
            progress={scrollProgress} 
            onComplete={handleCircleComplete}
          />
          
          <div className="overflow-x-hidden">
            <main className="h-[70vh] flex flex-col bg-white text-black">
              {/* Header */}
              <section className="flex flex-col justify-center flex-1 px-12 ml-12">
                <div className="ml-16">    
                  <div className={`font-extrabold text-[4rem] leading-[1.1] tracking-tight ${mori.className}`}>
                    {lines.map((line, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </main>

            {/* Page Sections */}
            <Page2 />
            <InfiniteCardsPage />
            <Page4 />
            <Scroll />   
            <VideoScrollComponent/>
          </div>
        </>
      )}
    </>
  )
}

export default Page
