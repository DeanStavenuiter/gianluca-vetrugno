"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Outro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !paragraphRef.current) return;

    const container = containerRef.current;
    const paragraph = paragraphRef.current;

    const ctx = gsap.context(() => {
      // Main container animation - fade in with subtle scale and translate
      gsap.fromTo(
        container,
        {
          opacity: 0,
          scale: 0.96,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate highlighted words (strong, em, and colored spans) with stagger
      const highlightedElements = paragraph.querySelectorAll(
        "strong, em, span.text-\\[\\#ffb160\\]"
      );

      gsap.fromTo(
        highlightedElements,
        {
          opacity: 0,
          y: 25,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.3)",
          stagger: {
            amount: 0.6,
            from: "start",
          },
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "top 45%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-[#fee9ce] my-20 font-avantt-medium text-center text-[clamp(2.5rem,3vw,10rem)] leading-none  px-10 md:max-w-[60%] mx-auto "
    >
      <p ref={paragraphRef}>
        <span className="text-[#ffb160]">&ldquo; </span>
        <strong className="text-[#ffb160]">
          When someone sits at my table
        </strong>
        , I want them to feel
        <em className="text-[#ffb160]"> instantly at ease </em>. Each dish is
        meant to spark
        <strong className="text-[#ffb160]"> a small moment of pause </strong>,
        where <em className="text-[#ffb160]"> flavor </em>,
        <em className="text-[#ffb160]"> comfort </em> and{" "}
        <em className="text-[#ffb160]"> presence </em> come together. It&apos;s my
        way of giving people{" "}
        <strong className="text-[#ffb160]"> a place to breathe </strong>
        and simply <em className="text-[#ffb160]"> enjoy being there </em>
        .<span className="text-[#ffb160]"> &rdquo;</span>
      </p>
    </div>
  );
};

export default Outro;
