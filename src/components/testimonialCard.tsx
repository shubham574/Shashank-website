import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Their creative vision transformed our brand into something extraordinary. The attention to detail is unmatched.",
    name: "Sarah Chen",
    role: "Creative Director",
    company: "Pixel Studios"
  },
  {
    id: 2,
    quote: "Working with them felt like having a creative partner who truly understood our vision and elevated it beyond expectations.",
    name: "Marcus Johnson",
    role: "Brand Manager",
    company: "Flux Digital"
  },
  {
    id: 3,
    quote: "The innovative approach and flawless execution made our campaign a huge success. Simply phenomenal work.",
    name: "Emma Rodriguez",
    role: "Marketing Lead",
    company: "Nova Brands"
  },
  {
    id: 4,
    quote: "Every project delivered with precision, creativity, and that special touch that sets great agencies apart.",
    name: "David Kim",
    role: "CEO",
    company: "Apex Creative"
  },
  {
    id: 5,
    quote: "Their ability to translate complex ideas into beautiful, functional designs is what makes them industry leaders.",
    name: "Lisa Thompson",
    role: "Product Director",
    company: "Zenith Labs"
  }
];

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated SVG shapes */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        initial={{ x: '20vw', y: '10vh' }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.02) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        initial={{ x: '60vw', y: '60vh' }}
      />
      
      <motion.div
        className="absolute w-64 h-64"
        style={{
          background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.02) 0%, transparent 70%)',
          filter: 'blur(30px)',
          borderRadius: '40% 60% 70% 30%',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        initial={{ x: '80vw', y: '20vh' }}
      />
    </div>
  );
};

const TestimonialCard: React.FC<{ 
  testimonial: Testimonial; 
  position: 'center' | 'side';
  index: number;
  activeIndex: number;
}> = ({ testimonial, position, index, activeIndex }) => {
  const isCenter = position === 'center';
  const distance = Math.abs(index - activeIndex);
  const opacity = isCenter ? 1 : Math.max(0.3, 1 - distance * 0.2);
  const scale = isCenter ? 1 : Math.max(0.8, 1 - distance * 0.1);
  
  return (
    <motion.div
      className="flex-shrink-0 relative"
      style={{
        width: '500px',
        height: '350px',
      }}
      animate={{
        opacity,
        scale,
        filter: isCenter ? 'blur(0px)' : 'blur(1px)',
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 },
        filter: { duration: 0.3 }
      }}
    >
      <div 
        className={`w-full h-full p-8 rounded-2xl backdrop-blur-sm transition-all duration-500 ${
          isCenter 
            ? 'bg-white/95 shadow-2xl shadow-black/20 border border-white/20' 
            : 'bg-white/60 shadow-lg shadow-black/10'
        }`}
      >
        <div className="h-full flex flex-col justify-between">
          <blockquote className={`text-gray-900 font-medium leading-relaxed mb-8 ${
            isCenter ? 'text-2xl' : 'text-lg'
          }`}>
            <span className="text-purple-600 text-6xl font-serif leading-none">"</span>
            <span className="ml-2">{testimonial.quote}</span>
          </blockquote>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className={`font-bold text-gray-900 mb-1 ${
                isCenter ? 'text-xl' : 'text-lg'
              }`}>
                {testimonial.name}
              </div>
              <div className={`text-gray-600 font-medium ${
                isCenter ? 'text-base' : 'text-sm'
              }`}>
                {testimonial.role}
              </div>
              <div className={`text-gray-500 ${
                isCenter ? 'text-sm' : 'text-xs'
              }`}>
                {testimonial.company}
              </div>
            </div>
            
            {isCenter && (
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfiniteTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  
  const cardWidth = 520; // 500px + 20px margin
  const centerOffset = (typeof window !== 'undefined' ? window.innerWidth : 1200) / 2 - cardWidth / 2;
  
  // Auto scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (!isDragging && !isHovering) {
        autoScrollRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % testimonials.length);
        }, 4000); // Change every 4 seconds
      }
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();
    return stopAutoScroll;
  }, [isDragging, isHovering]);

  // Update x position based on current index
  useEffect(() => {
    x.set(-currentIndex * cardWidth + centerOffset);
  }, [currentIndex, x, centerOffset, cardWidth]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const currentX = x.get();
    const velocity = info.velocity.x;
    
    // Calculate which card should be centered based on drag
    const targetIndex = Math.round((centerOffset - currentX) / cardWidth);
    const clampedIndex = Math.max(0, Math.min(testimonials.length - 1, targetIndex));
    
    // Add velocity-based adjustment for natural feel
    let finalIndex = clampedIndex;
    if (Math.abs(velocity) > 500) {
      finalIndex = velocity > 0 ? Math.max(0, clampedIndex - 1) : Math.min(testimonials.length - 1, clampedIndex + 1);
    }
    
    setCurrentIndex(finalIndex);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + testimonials.length) % testimonials.length;
      visible.push({
        ...testimonials[index],
        displayIndex: currentIndex + i,
        actualIndex: index
      });
    }
    return visible;
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <AnimatedBackground />
      
      {/* Section header */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-10">
        <motion.h2 
          className="text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Clients Say
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Trusted by leading brands worldwide to deliver exceptional creative solutions
        </motion.p>
      </div>
      
      {/* Testimonials container */}
      <div 
        className="flex items-center justify-center h-full w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="flex items-center cursor-grab active:cursor-grabbing"
          style={{ x: springX }}
          drag="x"
          dragConstraints={{ left: -cardWidth * (testimonials.length - 1) + centerOffset, right: centerOffset }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        >
          {getVisibleTestimonials().map((testimonial) => {
            const position = testimonial.displayIndex === currentIndex ? 'center' : 'side';
            return (
              <TestimonialCard
                key={`${testimonial.id}-${testimonial.displayIndex}`}
                testimonial={testimonial}
                position={position}
                index={testimonial.displayIndex}
                activeIndex={currentIndex}
              />
            );
          })}
        </motion.div>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-500 text-sm mb-4">Drag to explore or click to navigate</p>
        <div className="flex items-center justify-center space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                index === currentIndex 
                  ? 'bg-purple-600 scale-125 shadow-lg shadow-purple-600/30' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-white"
      >
        <svg 
          className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentIndex + 1) % testimonials.length)}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-white"
      >
        <svg 
          className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default InfiniteTestimonials;