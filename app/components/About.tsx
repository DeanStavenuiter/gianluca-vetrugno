"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linkUnderlineRef = useRef<HTMLSpanElement>(null);

  const handleLinkHover = () => {
    if (!linkUnderlineRef.current) return;
    gsap.to(linkUnderlineRef.current, {
      scaleX: 1,
      transformOrigin: "left center",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLinkLeave = () => {
    if (!linkUnderlineRef.current) return;
    gsap.to(linkUnderlineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const content = contentRef.current;

    const ctx = gsap.context(() => {
      // Set initial state for link underline
      if (linkUnderlineRef.current) {
        gsap.set(linkUnderlineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      }
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
        {/* <h2 className="text-[clamp(2.5rem,8vw,4rem)] tracking-[0.12em] font-avantt-heavy uppercase text-(--header-text-color) pl-4 md:pl-6">
          About
        </h2> */}
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

        <ul className="relative z-10 text-center space-y-6 w-full max-w-xl text-(--primary-text-color)/80 text-[clamp(1.1rem,2vw,1.5rem)]">
          <li className="about-list-item flex items-start gap-4">
            <span className="leading-[1.3] font-avantt-regular">
              Over a decade working and training in Michelin starred kitchens
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              <span className="text-(--header-text-color)">Sous Chef</span> at{" "}
              <span className="underline underline-offset-2 decoration-(--secondary-text-color)/80">
                The Jane
              </span>{" "}
              with two{" "}
              <span className=" relative inline-block">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -150 916 1000"
                  className="absolute -top-2 -right-[6px] w-5 h-5 pr-2"
                >
                  <path
                    className="fill-[#D3072B]"
                    d="M624 69v-49q0 -74 -47 -122t-119 -48q-78 0 -122 49t-44 131v15q0 4 1 7l1 17q-74 -53 -133 -53q-46 0 -88 31q-40 29 -59 76q-14 33 -14 66q0 101 116 154l15 7q-131 60 -131 162q0 69 48 121t114 52q60 0 119 -43l13 -10q-2 20 -2 48q0 75 47 122.5t119 47.5     q79 0 122.5 -49.5t43.5 -129.5v-39q74 53 132 53q65 0 112.5 -52.5t47.5 -120.5q0 -102 -116 -155l-15 -7q131 -60 131 -161q0 -65 -47 -119t-113.5 -54t-117.5 42zM540 238q116 -169 215 -169q41 0 74.5 37t33.5 83q0 124 -268 147v29q133 11 200.5 48t67.5 99     q0 45 -32.5 82.5t-75.5 37.5q-101 0 -215 -170l-26 15q57 116 57 196q0 124 -113 124q-54 0 -84 -33q-29 -35 -29 -88q0 -80 57 -199l-26 -15q-114 170 -215 170q-41 0 -74.5 -35.5t-33.5 -84.5q0 -124 267 -147v-29q-267 -22 -267 -147q0 -44 32 -82t76 -38q99 0 215 169     l26 -14q-57 -117 -57 -200q0 -53 29 -88q30 -33 84 -33q113 0 113 123q0 81 -57 198z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -150 916 1000"
                  className="absolute -top-2 -right-[19px] w-5 h-5 pr-2"
                >
                  <path
                    className="fill-[#D3072B]"
                    d="M624 69v-49q0 -74 -47 -122t-119 -48q-78 0 -122 49t-44 131v15q0 4 1 7l1 17q-74 -53 -133 -53q-46 0 -88 31q-40 29 -59 76q-14 33 -14 66q0 101 116 154l15 7q-131 60 -131 162q0 69 48 121t114 52q60 0 119 -43l13 -10q-2 20 -2 48q0 75 47 122.5t119 47.5     q79 0 122.5 -49.5t43.5 -129.5v-39q74 53 132 53q65 0 112.5 -52.5t47.5 -120.5q0 -102 -116 -155l-15 -7q131 -60 131 -161q0 -65 -47 -119t-113.5 -54t-117.5 42zM540 238q116 -169 215 -169q41 0 74.5 37t33.5 83q0 124 -268 147v29q133 11 200.5 48t67.5 99     q0 45 -32.5 82.5t-75.5 37.5q-101 0 -215 -170l-26 15q57 116 57 196q0 124 -113 124q-54 0 -84 -33q-29 -35 -29 -88q0 -80 57 -199l-26 -15q-114 170 -215 170q-41 0 -74.5 -35.5t-33.5 -84.5q0 -124 267 -147v-29q-267 -22 -267 -147q0 -44 32 -82t76 -38q99 0 215 169     l26 -14q-57 -117 -57 -200q0 -53 29 -88q30 -33 84 -33q113 0 113 123q0 81 -57 198z"
                  />
                </svg>
                Michelin stars
              </span>
              , under Nick Bril and Sergio Herman
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              <span className="text-(--header-text-color)">Head Chef</span> at{" "}
              <span className="underline underline-offset-2 decoration-(--secondary-text-color)/80">
                Le Pristine
              </span>{" "}
              with one{" "}
              <span className="relative inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -150 916 1000"
                  className="absolute -top-2 -right-[15px] w-5 h-5 pr-2"
                >
                  <path
                    className="fill-[#D3072B]"
                    d="M624 69v-49q0 -74 -47 -122t-119 -48q-78 0 -122 49t-44 131v15q0 4 1 7l1 17q-74 -53 -133 -53q-46 0 -88 31q-40 29 -59 76q-14 33 -14 66q0 101 116 154l15 7q-131 60 -131 162q0 69 48 121t114 52q60 0 119 -43l13 -10q-2 20 -2 48q0 75 47 122.5t119 47.5     q79 0 122.5 -49.5t43.5 -129.5v-39q74 53 132 53q65 0 112.5 -52.5t47.5 -120.5q0 -102 -116 -155l-15 -7q131 -60 131 -161q0 -65 -47 -119t-113.5 -54t-117.5 42zM540 238q116 -169 215 -169q41 0 74.5 37t33.5 83q0 124 -268 147v29q133 11 200.5 48t67.5 99     q0 45 -32.5 82.5t-75.5 37.5q-101 0 -215 -170l-26 15q57 116 57 196q0 124 -113 124q-54 0 -84 -33q-29 -35 -29 -88q0 -80 57 -199l-26 -15q-114 170 -215 170q-41 0 -74.5 -35.5t-33.5 -84.5q0 -124 267 -147v-29q-267 -22 -267 -147q0 -44 32 -82t76 -38q99 0 215 169     l26 -14q-57 -117 -57 -200q0 -53 29 -88q30 -33 84 -33q113 0 113 123q0 81 -57 198z"
                  />
                </svg>
                Michelin star
              </span>{" "}
              for five years
            </span>
          </li>
          <li className="about-list-item flex items-start gap-4">
            <span className=" leading-[1.3] font-avantt-regular">
              Currently{" "}
              <span className="text-(--header-text-color)">
                Assistant Executive Chef
              </span>{" "}
              at{" "}
              <span className="underline underline-offset-2 decoration-(--secondary-text-color)/80">
                J&M Catering
              </span>
              , part of Compass Group Belgium
            </span>
          </li>
        </ul>
        <div className="paragraph-wrapper relative z-10 text-center max-w-3xl pt-12">
          <h3 className="mb-6 text-sm uppercase tracking-widest text-(--header-text-color) font-avantt-medium">
            Naturale
          </h3>

          <p className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular text-(--primary-text-color)/80">
            I&apos;m also the founder of Naturale, a culinary event in Antwerp dedicated to natural wines,
            artisan drinks, and authentic food. Created as a place where
            producers and curious taste explorers come together to taste,
            connect, and share.
          </p>

          <p className="mt-4 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular text-(--primary-text-color)/80">
            Three editions have already been hosted, bringing together
            experiences, craftsmanship, and a growing community around natural
            cuisine and beverages.
          </p>

          <Link
            href="https://naturaleantwerp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block mt-4 text-sm uppercase tracking-wider text-(--primary-text-color)/80 hover:text-(--secondary-text-color) transition-colors"
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Explore Naturale
            <span
              ref={linkUnderlineRef}
              className="absolute left-0 bottom-0 w-full h-px bg-(--secondary-text-color)"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
