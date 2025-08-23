"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const Page2 = ()=>{


    gsap.registerPlugin(ScrollTrigger);
    useGSAP(function(){
        gsap.from(".rotatetext", {
            transform:'rotateX(-80deg)',
            opacity: 0,
            duration: 1,
            stagger: 1,
            scrollTrigger:{
                trigger: ".rotatetext",
                start: "top 60%",
                end: "top -200%",
                scrub: 2
            }
    })
})

    return(
        <>
        
        <div id='section2' className=  "bg-white text-center -top-20 text-black object-cover width-full">
                
            <div  className=" rotatetext mt-20">
            <h1 className="text-[20vw] tracking-tight text-black  font-anzo uppercase leading-[25vw]"> IMPACTFUL</h1>
            </div>
            <div className="rotatetext">
            <h1 className="text-[20vw] tracking-tight text-black  font-anzo uppercase leading-[25vw]"> Design</h1>
            </div>
            <div className="rotatetext">
            <h1 className="text-[20vw] tracking-tight text-black  font-anzo uppercase leading-[25vw]"> Is the</h1>
            </div>
            <div className="rotatetext">
            <h1 className="text-[20vw] tracking-tight text-black  font-anzo uppercase leading-[25vw]"> Design</h1>
            </div>
            <div className="rotatetext">
            <h1 className="text-[20vw] tracking-tight text-black font-anzo uppercase leading-[25vw] ">That </h1>
            </div>
            <div className="rotatetext">
            <h1 className="text-[20vw] tracking-tight text-black font-anzo uppercase leading-[25vw] ">Work </h1>
            </div>
            
        </div>
        </>
    )
}

export default Page2;