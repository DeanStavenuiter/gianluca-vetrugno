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
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const paragraph3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Array of all paragraph refs
    const paragraphs = [paragraph1Ref, paragraph2Ref, paragraph3Ref];

    // Process each paragraph
    paragraphs.forEach((paragraphRef) => {
      if (!paragraphRef.current) return;

      // Wrap words in spans
      wrapWordsInSpan(paragraphRef.current);

      // Get all word spans
      const words = paragraphRef.current.querySelectorAll("span");

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
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.2,
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
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.2,
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
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.2,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full py-20 px-6 md:px-12 lg:px-24">
      <div className="space-y-20">
        {/* First paragraph - Left aligned */}
        <div className="max-w-[70%] ml-0">
          <p
            ref={paragraph1Ref}
            className="text-[clamp(2.5rem,5vw,10rem)] leading-[0.9] text-[#fee9ce] font-light font-avantt-heavy [&>span]:inline-block [&>span]:whitespace-nowrap"
          >
            His cooking is simple, honest and full of flavor.
          </p>
        </div>

        {/* Second paragraph - Center/Right aligned */}
        <div className="max-w-[60%] ml-auto mr-[10%]">
          <p
            ref={paragraph2Ref}
            className="text-[clamp(2.5rem,5vw,10rem)] leading-[0.9] text-[#fee9ce] font-light font-avantt-heavy [&>span]:inline-block [&>span]:whitespace-nowrap"
          >
            A mix of intuition, technique and memories.
          </p>
        </div>

        {/* Third paragraph - Left aligned but indented */}
        <div className="max-w-[75%] ml-[5%]">
          <p
            ref={paragraph3Ref}
            className="text-[clamp(2.5rem,5vw,10rem)] leading-[0.9] text-[#fee9ce] font-light font-avantt-heavy [&>span]:inline-block [&>span]:whitespace-nowrap"
          >
            Every dish is made with warmth, generosity and the intention to
            create moments that feel personal, effortless and unforgettable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
