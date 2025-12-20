"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const content = contentRef.current;

    const ctx = gsap.context(() => {
      // Get all paragraph wrapper divs
      const paragraphDivs = content.querySelectorAll(".paragraph-wrapper");

      // Set initial state for each paragraph
      gsap.set(paragraphDivs, { opacity: 0, y: 30 });

      // Animate each paragraph individually as it scrolls into view
      paragraphDivs.forEach((div) => {
        gsap.to(div, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: div,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const paragraphs = [
    <>
      I&apos;m <span className="text-(--header-text-color)">Gianluca Vetrugno</span> — Italo‑Belgian chef.
    </>,
    <>
      I&apos;ve spent the past 15 years working in the HoReCa industry, gaining experience across kitchens, private dining, and restaurant projects.
    </>,
    <>
      Over the last decade, I trained and worked in <span className="text-(--header-text-color)">Michelin‑starred restaurants</span>, including The Jane (★★) under Nick Bril and Sergio Herman, becoming Sous Chef.
    </>,
    <>
      In the last five years, I worked as <span className="text-(--header-text-color)">Head Chef</span> at Le Pristine (★) with Sergio Herman.
    </>,
    <>
      Today I am working as Assistant Executive Chef at J&M Catering, part of Compass Group Belgium.
    </>,
    <>
      I&apos;m also the founder of <Link href="https://naturaleantwerp.com/" target="_blank" className="text-(--header-text-color) hover:underline"><span className="text-(--header-text-color)">Naturale</span></Link>, a culinary event in Antwerp dedicated to natural wines, artisan drinks, and authentic food.
    </>,
    <>
      Alongside these projects, I continue to work as a <span className="text-(--header-text-color)">freelance chef</span>, focusing on private dinners, collaborations, and pop‑up events.
    </>,
  ];

  return (
    <div
      ref={containerRef}
      className="relative text-(--primary-text-color) z-10 w-full py-20 px-6 md:px-12 lg:px-24 overflow-x-hidden"
    >
      <div ref={contentRef} className="flex flex-col items-center space-y-12 max-w-4xl mx-auto">
        {paragraphs.map((text, index) => (
          <div key={index} className="paragraph-wrapper relative z-10 text-center">
            <p className="text-[clamp(1.5rem,3vw,4rem)] leading-[1.1] font-avantt-medium">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
