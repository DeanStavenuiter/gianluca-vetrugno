"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BridgeLine = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 85%",
        //   toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={textRef} className="max-w-sm px-4 md:px-0 md:max-w-lg mx-auto mt-10 text-center opacity-0 mb-50">
      <p className="text-(--primary-text-color) text-[clamp(0.875rem,1vw,1rem)] leading-relaxed font-avantt-regular">
        This approach shapes everything I do, from intimate private dinners to
        collaborations and large-scale events.
      </p>
    </div>
  );
};

export default BridgeLine;
