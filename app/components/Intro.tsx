"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const image3Ref = useRef<HTMLDivElement>(null);
  const image4Ref = useRef<HTMLDivElement>(null);

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

    // Parallax animations for images - vertical movement
    const images = [
      { ref: image1Ref, yPercent: -30 },
      { ref: image2Ref, yPercent: 40 },
      { ref: image3Ref, yPercent: -35 },
      { ref: image4Ref, yPercent: 45 },
    ];

    images.forEach(({ ref, yPercent }) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          {
            y: yPercent > 0 ? -100 : 100,
          },
          {
            y: yPercent > 0 ? 100 : -100,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full py-20 px-6 md:px-12 lg:px-24">
      <div className="relative space-y-20">
        {/* Image 1 - Absolutely positioned, rotated right */}
        <div
          ref={image1Ref}
          className="absolute  right-[2%] top-0 md:right-[18%] w-[135px] md:w-[230px] z-0 rotate-[8deg]"
        >
          <Image
            src="https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/gianluca/gianluca-posing.webp"
            alt="Gianluca posing"
            width={280}
            height={420}
            className="shadow-2xl object-cover"
          />
        </div>

        {/* Image 2 - Absolutely positioned, rotated left */}
        <div
          ref={image2Ref}
          className="absolute top-[25%] md:top-[20%] left-[8%] w-[120px] md:w-[300px] z-0 -rotate-6"
        >
          <Image
            src="https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/gianluca/gianluca-posing-smiling.webp"
            alt="Gianluca smiling"
            width={250}
            height={375}
            className="shadow-2xl object-cover"
          />
        </div>

        {/* Image 3 - Absolutely positioned, rotated right */}
        <div
          ref={image3Ref}
          className="hidden md:block absolute top-[45%] right-[32%] w-[190px] md:w-[180px] z-0 "
        >
          <Image
            src="https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/gianluca/gianluca-posing-laughing.webp"
            alt="Gianluca serious"
            width={260}
            height={390}
            className="shadow-2xl object-cover"
          />
        </div>

        {/* Image 4 - Absolutely positioned, rotated left */}
        <div
          ref={image4Ref}
          className=" absolute top-[65%] right-[5%] md:top-[92%] md:right-[35%] w-[150px] md:w-[140px] z-0 rotate-10 md:rotate-20"
        >
          <Image
            src="https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/gianluca/gianluca-posing-serious.webp"
            alt="Gianluca laughing"
            width={270}
            height={405}
            className="shadow-2xl object-cover"
          />
        </div>

        {/* First paragraph - Left aligned */}
        <div className="relative z-10 max-w-[70%] ml-0">
          <p
            ref={paragraph1Ref}
            className="text-[clamp(2.5rem,5vw,10rem)] leading-[0.9] text-[#fee9ce] font-light font-avantt-heavy [&>span]:inline-block [&>span]:whitespace-nowrap"
          >
            His cooking is simple, honest and full of flavor.
          </p>
        </div>

        {/* Second paragraph - Center/Right aligned */}
        <div className="relative z-10 max-w-[60%] ml-auto mr-[10%]">
          <p
            ref={paragraph2Ref}
            className="text-[clamp(2.5rem,5vw,10rem)] leading-[0.9] text-[#fee9ce] font-light font-avantt-heavy [&>span]:inline-block [&>span]:whitespace-nowrap"
          >
            A mix of intuition, technique and memories.
          </p>
        </div>

        {/* Third paragraph - Left aligned but indented */}
        <div className="relative z-10 max-w-[75%] ml-[5%]">
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
