"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Utility function to wrap words in spans
const wrapWordsInSpan = (element: HTMLElement) => {
  const text = element.textContent || "";
  element.innerHTML = text
    .split(" ")
    .map((word) => `<span>${word}</span>`)
    .join(" ");
};

const Intro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paragraphsContainerRef.current || !containerRef.current) return;

    // Get all paragraph wrapper divs
    const paragraphDivs = paragraphsContainerRef.current.querySelectorAll(".paragraph-wrapper");
    
    // Set initial state for each paragraph - invisible and slightly below
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

    // Get all paragraph elements
    const paragraphElements = paragraphsContainerRef.current.querySelectorAll("p");

    // Process each paragraph
    paragraphElements.forEach((paragraph) => {
      // Wrap words in spans
      wrapWordsInSpan(paragraph);

      // Get all word spans
      const words = paragraph.querySelectorAll("span");

      // Randomly assign classes word0, word1, word2, word3 to each word
      words.forEach((word) => {
        const randomClass = "word" + Math.floor(Math.random() * 4);
        word.classList.add(randomClass);
      });
    });

    // Animate word1 elements - from left to correct position
    document.querySelectorAll(".word1").forEach((el) => {
      gsap.fromTo(
        el,
        { x: "-0.8em" },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 65%",
            scrub: 0.05,
          },
        }
      );
    });

    // Animate word2 elements - from right to correct position
    document.querySelectorAll(".word2").forEach((el) => {
      gsap.fromTo(
        el,
        { x: "1.6em" },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 65%",
            scrub: 0.05,
          },
        }
      );
    });

    // Animate word3 elements - from far left to correct position
    document.querySelectorAll(".word3").forEach((el) => {
      gsap.fromTo(
        el,
        { x: "-2.4em" },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "top 65%",
            scrub: 0.05,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const paragraphs = [
    "My cooking is guided by intuition, care, and experience.",
    "I work with the seasons, listening closely to what each ingredient asks for.",
    "Every dish is built with balance and clarity of flavors, so nothing overwhelms anything else.",
    "Each element has its place",
  ];

  return (
    <div ref={containerRef} className="relative text-(--primary-text-color) z-10 w-full px-6 md:px-12 lg:px-24 overflow-x-hidden">
      <div ref={paragraphsContainerRef} className="flex flex-col items-center space-y-12 max-w-4xl mx-auto">
        {paragraphs.map((text, index) => (
          <div key={index} className="paragraph-wrapper relative z-10 text-center">
            <p className="text-[clamp(1.5rem,3vw,3.7rem)] leading-relaxedfont-light font-avantt-medium [&>span]:inline-block [&>span]:whitespace-nowrap">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Intro;
