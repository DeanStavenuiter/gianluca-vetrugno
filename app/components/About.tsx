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

      // Animate list items one by one
      const listItems = content.querySelectorAll(".about-list-item");
      gsap.set(listItems, { opacity: 0, y: 20 });

      gsap.to(listItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.25,
        scrollTrigger: {
          trigger: listItems[0],
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative text-(--primary-text-color) z-10 w-full py-20 px-6 md:px-12 lg:px-24 overflow-x-hidden mb-20"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center space-y-12 max-w-3xl mx-auto"
      >
        <h2 className="text-[clamp(2.5rem,8vw,4rem)] tracking-[0.12em] font-avantt-heavy uppercase text-(--header-text-color) pl-4 md:pl-6">
          About
        </h2>
        <div className="paragraph-wrapper relative z-10 text-center mb-12 max-w-3xl">
          <p className="text-[clamp(1.5rem,3vw,4rem)] leading-[1.1] font-avantt-medium">
            I&apos;m{" "}
            <span className="text-(--header-text-color)">
              Gianluca Vetrugno
            </span>{" "}
            an Italo‑Belgian chef with over fifteen years of experience across
            fine dining, private kitchens, and large scale events
          </p>
        </div>

        <ul className="relative z-10 text-center space-y-6 w-full max-w-xl text-(--secondary-text-color) text-[clamp(1.1rem,2vw,1.5rem)]">
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              <span className="text-(--secondary-text-color) opacity-90">
                Over a decade working and training in
              </span>{" "}
              <span className="text-(--primary-text-color) opacity-75">
                Michelin starred kitchens
              </span>
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              <span className="text-(--primary-text-color) opacity-75">
                Sous Chef
              </span>{" "}
              <span className="text-(--secondary-text-color) opacity-90">
                at The Jane with two Michelin stars, under Nick Bril and Sergio
                Herman{" "}
              </span>
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              <span className="text-(--primary-text-color) opacity-75">
                Head Chef
              </span>{" "}
              <span className="text-(--secondary-text-color) opacity-90">
                at Le Pristine with one Michelin star for five years
              </span>
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              Currently{" "}
              <span className="text-(--primary-text-color) opacity-75">
                Assistant Executive Chef
              </span>{" "}
              <span className="text-(--secondary-text-color) opacity-90">
                at J&M Catering, part of Compass Group Belgium
              </span>
            </span>
          </li>
        </ul>
        <div className="paragraph-wrapper relative z-10 text-center max-w-3xl pt-12">
          <h3 className="mb-6 text-sm uppercase tracking-widest text-(--header-text-color) font-avantt-medium opacity-70">
            Naturale
          </h3>

          <p className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular text-(--secondary-text-color)">
            Naturale is a culinary event in Antwerp dedicated to natural wines,
            artisan drinks, and authentic food. Created as a place where
            producers and curious taste explorers come together to taste,
            connect, and share.
          </p>

          <p className="mt-4 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular text-(--secondary-text-color)">
            Three editions have already been hosted, bringing together
            experiences, craftsmanship, and a growing community around natural
            cuisine and beverages.
          </p>
          <Link
            href="https://naturaleantwerp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm uppercase tracking-wider text-(--header-text-color) opacity-70 hover:opacity-100 transition-opacity"
          >
            Explore Naturale
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
