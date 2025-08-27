import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScroll } from './ui/text-scroll';
import ImageCursorTrail from './ui/image-cursortrail';
import localFont from 'next/font/local';

const mori = localFont({
  src: "../../public/fonts/Mori-Regular.otf"
})

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const images = [
    "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1644141655284-2961181d5a02?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
    "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
    "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
    "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  ];

  useEffect(() => {
    if (!containerRef.current || !heroContainerRef.current) return;

    const container = containerRef.current;
    const heroContainer = heroContainerRef.current;

    // Set initial state - child inherits parent size
    gsap.set(heroContainer, {
      width: '100%',
      height: '100%',
      borderRadius: '0px',
      margin: '0px',
      padding: '0px',
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Animate to rounded corners with margins and padding
    tl.to(heroContainer, {
      width: 'calc(100% - 4rem)', // equivalent to mx-8 (2rem on each side)
      height: 'calc(100% - 4rem)', // equivalent to my-8
      borderRadius: '24px',
      margin: '2rem',
      padding: '3rem',
      duration: 1,
      ease: 'power2.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Main container with white background */}
      <div 
        ref={containerRef}
        className="relative w-full h-screen bg-white overflow-hidden"
      >
        <style jsx>{`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 100% 25%;
            }
            50% {
              background-position: 100% 100%;
            }
            75% {
              background-position: 0% 75%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
        
        <div 
          ref={heroContainerRef}
          className="relative w-full h-full flex flex-col justify-between overflow-hidden"
          style={{ 
            background: `
              linear-gradient(45deg, 
                #E6E6FA,
                #B19CD9,
                #87CEEB,
                #DDA0DD,
                #FFB6C1,
                #E0B4D6,
                #9370DB,
                #87CEFA,
                #FFE4E1
              )`,
            backgroundSize: '600% 600%',
            animation: 'gradientFlow 20s ease-in-out infinite',
            borderRadius: '0px',
            padding: '0px'
          }}
        >
          <ImageCursorTrail
            items={images}
            maxNumberOfImages={5}
            distance={25}
            imgClass="sm:w-40 w-28 sm:h-48 h-36"
          >
            <div className={`${mori.className}`}>
            <h1 className="absolute text-black text-4xl md:text-5xl font-bold leading-tight top-16 left-16 right-16 z-20">
              To put it simply, you can rent our talented experts or an entire team on a short-term or long-term basis to help you design, build, and launch your project.
            </h1>
            
            
            <div className="absolute bottom-8 left-0 w-full h-24">
              <TextScroll 
                text="Designers - Developers - Product Managers - Marketers - Data Analysts - " 
                default_velocity={2} 
                className="text-2xl font-bold bottom-5"
              />
              </div>
            </div>
          </ImageCursorTrail>
        </div>
      </div>

    </>
  );
}