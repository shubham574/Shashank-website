"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardDemo from "./cards-demo-1";

gsap.registerPlugin(ScrollTrigger);

export default function Scroll() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardWrapper = cardWrapperRef.current;
    if (!section || !cardWrapper) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // ✅ Dynamic scroll width calculation
    const getTotalWidth = () => {
      const children = Array.from(cardWrapper.children) as HTMLElement[];
      if (children.length === 0) return 0;

      const last = children[children.length - 1];
      const totalWidth = cardWrapper.scrollWidth;

      // Extra distance so last card fully enters the viewport
      const extra = Math.max(0, window.innerWidth - last.offsetWidth);

      return Math.max(0, totalWidth - window.innerWidth + extra);
    };

    const ctx = gsap.context(() => {
      const tween = gsap.to(cardWrapper, {
        x: () => -getTotalWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 20%", // pin when section hits top
          end: () => "+=" + getTotalWidth(),
          pin: true,
          scrub: 1,
          markers: true, // ❌ remove in production
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      const onResize = () => tween.scrollTrigger?.refresh();
      window.addEventListener("resize", onResize);
      setTimeout(() => ScrollTrigger.refresh(), 0); // refresh after images load

      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full">
      <section
        ref={sectionRef}
        className="relative h-[70vh] bg-gray-100 overflow-hidden"
      >
        <div
          ref={cardWrapperRef}
          className="flex h-full items-center gap-8 will-change-transform ml-16"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="min-w-[65vw] h-[70vh] flex items-center justify-center"
            >
              <CardDemo
                image="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1600"
                video="https://www.w3schools.com/html/mov_bbb.mp4"
                text={i % 2 === 0 ? "Built to deliver." : "Made by humans."}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
