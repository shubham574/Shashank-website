"use client"
import React from "react"
import { motion } from "framer-motion"
import { Variants } from "framer-motion";


import { useRevealer } from "@/hooks/useRevealer"
import Scroll from "@/components/horizontalScroll";
import Page2 from "@/components/page2";
import Page4 from "@/components/page4";



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


const Page = () => {
  const revealerDone = useRevealer() 


  const lines = [
    "Welcome!",
    "From designers to",
    "developers, we've",
    "got you covered.",
  ];


  return (
    <>
      {/* Revealer overlay */}
      <div className="revealer fixed inset-0 bg-purple-600 origin-top z-50"></div>


      {/* Render content ONLY after revealer animation */}
      {revealerDone && (
        <div>
      <main className="h-[60vh] flex flex-col bg-white text-black">
        {/* Header */}
   
        <section className="flex flex-col justify-center flex-1 px-12 ml-12">
          <div className="ml-16">    
           <div className=" font-mori font-bold text-[4rem] leading-[1.1] tracking-tight ">
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

           {/* Horizontal Scroll Section */}
      <Scroll />   

     </div>
     
      )}
      
    </>
  )
}


export default Page