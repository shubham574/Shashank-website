"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import localFont from "next/font/local";

const anzo = localFont({
  src: "../../../public/anzo.woff2"
});

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  client: string;
  year: string;
}

const CaseStudiesPage = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showTags, setShowTags] = useState(false);
  gsap.registerPlugin(ScrollTrigger);

  // Sample case studies data
  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      title: "E-commerce Revolution",
      description: "Transforming online shopping experience with innovative design and seamless user journey that increased conversion rates by 340%.",
      image: "https://images.unsplash.com/photo-1714974528737-3e6c7e4d11af?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/case-studies/ecommerce",
      category: "E-commerce",
      client: "RetailCorp",
      year: "2024"
    },
    {
      id: 2,
      title: "FinTech Innovation",
      description: "Building trust through intuitive financial technology solutions and user-centric design that simplified complex banking processes.",
      image: "https://images.unsplash.com/photo-1651764731778-b9c40c51334f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/case-studies/fintech",
      category: "Finance",
      client: "NeoBank",
      year: "2024"
    },
    {
      id: 3,
      title: "Healthcare Platform",
      description: "Improving patient care with accessible and user-friendly healthcare technology that connects patients with doctors seamlessly.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/case-studies/healthcare",
      category: "Healthcare",
      client: "MediTech",
      year: "2023"
    },
    {
      id: 4,
      title: "Education Portal",
      description: "Revolutionizing learning experiences through modern educational technology that makes learning interactive and engaging.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/case-studies/education",
      category: "Education",
      client: "EduFlow",
      year: "2023"
    },
    {
      id: 5,
      title: "Social Impact App",
      description: "Creating meaningful connections and driving social change through innovative mobile app design and community-focused features.",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      link: "/case-studies/social-impact",
      category: "Social Impact",
      client: "ConnectGood",
      year: "2024"
    }
  ];

  useGSAP(() => {
    gsap.from(".case-title", {
      transform: "rotateX(-80deg)",
      opacity: 0,
      duration: 1,
      stagger: 0.5,
      scrollTrigger: {
        trigger: ".case-title",
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    gsap.to(".scroll-text", {
      opacity: 0,
      scale: 0.8,
      scrollTrigger: {
        trigger: ".scroll-text",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });

    ScrollTrigger.create({
      trigger: ".cards-container",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => setShowTags(true),
      onLeave: () => setShowTags(false),
      onEnterBack: () => setShowTags(true),
      onLeaveBack: () => setShowTags(false),
    });

    const cards = gsap.utils.toArray(".case-card");
    cards.forEach((card: any, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentIndex(index),
        onEnterBack: () => setCurrentIndex(index),
        onLeave: () => {
          if (index === cards.length - 1) {
            setCurrentIndex(-1);
          }
        },
        onLeaveBack: () => {
          if (index === 0) {
            setCurrentIndex(-1);
          }
        },
      });
    });

    gsap.from(".case-card", {
      transform: "rotateX(-70deg)",
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 1,
      scrollTrigger: {
        trigger: ".case-card",
        start: "top 80%",
        end: "top -300%",
        scrub: 2,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Get visible categories for curved navigation
  const getVisibleCategories = () => {
    if (currentIndex === -1) return [];
    
    const categories = [];
    
    // Show previous category
    if (currentIndex > 0) {
      categories.push({
        category: caseStudies[currentIndex - 1].category,
        type: 'prev',
        index: currentIndex - 1
      });
    }
    
    // Show current category
    categories.push({
      category: caseStudies[currentIndex].category,
      type: 'current',
      index: currentIndex
    });
    
    // Show next category
    if (currentIndex < caseStudies.length - 1) {
      categories.push({
        category: caseStudies[currentIndex + 1].category,
        type: 'next',
        index: currentIndex + 1
      });
    }
    
    return categories;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      {/* Vertical Curved Category Navigation */}
      <div 
        className={`fixed left-8 md:left-12 top-1/2 z-30 transition-all duration-700 select-none pointer-events-none ${
          showTags && currentIndex !== -1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}
        style={{ transform: "translateY(-50%)" }}
      >
        <div className="relative">
          {/* Curved Line SVG */}
          <svg 
            width="4" 
            height="200" 
            viewBox="0 0 4 200" 
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
            style={{ zIndex: 1 }}
          >
            <path
              d="M2 0 Q20 50 2 100 Q20 150 2 200"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Category Labels */}
          <div className="relative pl-8" style={{ zIndex: 2 }}>
            {getVisibleCategories().map(({ category, type, index }) => {
              const yPosition = type === 'prev' ? -60 : type === 'next' ? 60 : 0;
              
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-500 ease-out ${anzo.className}`}
                  style={{
                    top: `calc(50% + ${yPosition}px)`,
                    transform: 'translateY(-50%)',
                    left: type === 'current' ? '8px' : type === 'prev' ? '20px' : '20px'
                  }}
                >
                  <div className={`whitespace-nowrap transition-all duration-500 ${
                    type === 'current'
                      ? 'text-2xl font-bold text-gray-900 opacity-100'
                      : 'text-base font-medium text-gray-400 opacity-60'
                  }`}>
                    {category.split(' ').map((word, i) => (
                      <div key={i} className="leading-tight">
                        {word}
                      </div>
                    ))}
                  </div>
                  
                  {/* Current category indicator dot */}
                  {type === 'current' && (
                    <div 
                      className="absolute left-0 top-1/2 w-3 h-3 bg-gray-900 rounded-full transform -translate-y-1/2 -translate-x-6 animate-pulse"
                      style={{ zIndex: 3 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          {currentIndex !== -1 && (
            <div className="absolute right-0 top-1/2 transform translate-x-8 -translate-y-1/2">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-xs font-semibold text-gray-500 mb-2">
                  {String(currentIndex + 1).padStart(2, '0')}
                </div>
                <div className="w-px h-16 bg-gray-300 relative">
                  <div 
                    className="w-px bg-gray-900 absolute top-0 transition-all duration-500"
                    style={{ 
                      height: `${((currentIndex + 1) / caseStudies.length) * 100}%` 
                    }}
                  />
                </div>
                <div className="text-xs font-semibold text-gray-300 mt-2">
                  {String(caseStudies.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Instruction Section */}
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className={`scroll-text text-center ${anzo.className}`}>
          <h2 className="text-[8vw] md:text-[6vw] lg:text-[4vw] font-bold text-gray-900 uppercase leading-tight">
            Scroll
          </h2>
          <h2 className="text-[8vw] md:text-[6vw] lg:text-[4vw] font-bold text-gray-900 uppercase leading-tight">
            For Case
          </h2>
          <h2 className="text-[8vw] md:text-[6vw] lg:text-[4vw] font-bold text-gray-900 uppercase leading-tight">
            Studies
          </h2>
          <div className="mt-8">
            <div className="animate-bounce">
              <svg className="w-8 h-8 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="cards-container bg-white text-center text-black w-full">
        {caseStudies.map((caseStudy, index) => (
          <div key={caseStudy.id} className="case-card-container min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-24 py-20">
            <div className="case-card w-full max-w-4xl">
              <div 
                onClick={() => router.push(caseStudy.link)}
                className="relative bg-white rounded-[2.5rem] shadow-2xl cursor-pointer overflow-hidden group hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] mx-auto"
              >
                <div className="grid lg:grid-cols-2 gap-0 min-h-[480px]">
                  <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-4">
                      <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                        {caseStudy.category}
                      </span>
                    </div>
                    
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight ${anzo.className}`}>
                      {caseStudy.title}
                    </h2>
                    
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                      {caseStudy.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Client</p>
                        <p className="text-base font-bold text-gray-900">{caseStudy.client}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Year</p>
                        <p className="text-base font-bold text-gray-900">{caseStudy.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-blue-600 font-bold text-base mr-3">View Case Study</span>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative min-h-[300px] lg:min-h-[480px] overflow-hidden lg:rounded-r-[2.5rem] rounded-b-[2.5rem] lg:rounded-bl-none">
                    <Image
                      src={caseStudy.image}
                      alt={caseStudy.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                      <span className="text-sm font-bold text-gray-900">0{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-br-[2.5rem]" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-tl-[1.5rem]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseStudiesPage;
