"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Outro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !paragraph1Ref.current || !paragraph2Ref.current) return;

    const ctx = gsap.context(() => {
      // Split text into words (preserving spaces for natural wrapping)
      const splitTextIntoWords = (element: HTMLElement) => {
        const text = element.textContent || "";
        element.innerHTML = "";
        
        // Split by spaces but keep track of words
        const words = text.split(/(\s+)/);
        
        words.forEach((word) => {
          if (word.match(/^\s+$/)) {
            // It's whitespace - add as text node to allow natural wrapping
            element.appendChild(document.createTextNode(word));
          } else if (word) {
            // It's a word - wrap each character in a span
            const wordWrapper = document.createElement("span");
            wordWrapper.style.display = "inline";
            wordWrapper.style.whiteSpace = "nowrap";
            
            word.split("").forEach((char) => {
              const span = document.createElement("span");
              span.textContent = char;
              span.style.color = "rgba(255, 232, 205, 0.15)";
              span.style.display = "inline";
              wordWrapper.appendChild(span);
            });
            
            element.appendChild(wordWrapper);
          }
        });
        
        return element.querySelectorAll("span > span");
      };

      const chars1 = splitTextIntoWords(paragraph1Ref.current!);
      const chars2 = splitTextIntoWords(paragraph2Ref.current!);

      // Create a timeline for sequential animations with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: contentRef.current,
          pinSpacing: true,
        },
      });

      // Animate first paragraph
      tl.to(chars1, {
        color: "var(--primary-text-color)",
        stagger: 0.01,
        ease: "none",
        duration: 1,
      });

      // Animate second paragraph after first completes
      tl.to(chars2, {
        color: "var(--primary-text-color)",
        stagger: 0.01,
        ease: "none",
        duration: 1,
      }, "+=0.1");

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div 
        ref={contentRef} 
        className="min-h-screen flex items-center justify-center"
      >
        <div className="max-w-2xl mx-auto text-center space-y-6 px-6">
          <p
            ref={paragraph1Ref}
            className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular"
          >
            When people eat my food, I want them to feel comfortable. Like sitting
            at the table when my grandmother used to cook. Feeling welcome,
            understood, and taken care of.
          </p>
          <p
            ref={paragraph2Ref}
            className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular"
          >
            I like to explain a dish, where it comes from, and the idea behind it,
            so that food becomes something personal, not just something to eat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Outro;
