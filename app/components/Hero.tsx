"use client";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const firstnameRef = useRef<HTMLSpanElement>(null);
  const lastnameRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tl = gsap.timeline();

  useEffect(() => {
    // Get actual viewport dimensions (dynamic viewport height)
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Get the actual width and height of the text elements
    const firstnameWidth = firstnameRef.current?.offsetWidth || 0;
    const lastnameWidth = lastnameRef.current?.offsetWidth || 0;
    const firstnameHeight = firstnameRef.current?.offsetHeight || 0;
    const lastnameHeight = lastnameRef.current?.offsetHeight || 0;

    // Horizontal offsets: firstname left edge at 15px, lastname right edge at 15px from right
    const xOffsetFirstname = 15 + firstnameWidth - viewportWidth + 20;
    const xOffsetLastname = viewportWidth - 15 - lastnameWidth - 20;

    // Vertical offsets: firstname top edge at 15px, lastname bottom edge at 15px from bottom
    const yOffsetFirstname = 15 + firstnameHeight - viewportHeight;
    const yOffsetLastname = viewportHeight - 15 - lastnameHeight;
    // Disable scroll initially
    document.body.style.overflow = "hidden";

    // Set up ScrollTrigger animations (but they won't activate until we scroll, which is disabled)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        pinSpacing: false,
      },
    });

    // Firstname animation
    tl.fromTo(
      firstnameRef.current,
      {
        // Starting position (center bottom of screen)
        y: 0,
        x: 0,
        opacity: 0,
      },
      {
        // First, fade in and move to top of screen
        y: yOffsetFirstname,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      }
    ).to(firstnameRef.current, {
      // Then, move to the left corner
      y: yOffsetFirstname,
      x: xOffsetFirstname,
      duration: 1,
      ease: "power2.inOut",
    });

    // Lastname animation - starts at the same time as firstname (position "0")
    tl.fromTo(
      lastnameRef.current,
      {
        y: 0,
        x: 0,
        opacity: 0,
      },
      {
        y: yOffsetLastname,
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      },
      0
    ) // <- This makes it start at the beginning of the timeline
      .to(
        lastnameRef.current,
        {
          y: yOffsetLastname,
          x: xOffsetLastname,
          duration: 1.2,
          ease: "power2.inOut",
        },
        1.2
      );

    // After initial animations complete, enable scrolling
    tl.call(() => {
      document.body.style.overflow = "auto";
      
      // Set up scroll animations that continue from current position
      scrollTl
        .to(imageRef.current, {
          opacity: 0,
        })
        .to(
          firstnameRef.current,
          {
            x: viewportWidth,
            opacity: 0,
          },
          0
        )
        .to(
          lastnameRef.current,
          {
            x: -viewportWidth,
            opacity: 0,
          },
          0
        );
    });

    return () => {
      document.body.style.overflow = "auto";
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [tl]);

  return (
    <div ref={containerRef} className="overflow-hidden max-h-dvh w-full h-dvh relative">
      <div ref={imageRef} className="absolute inset-0 w-full h-full">
        <Image
          src="https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/gianluca/gianluca-vetrugno-full.webp"
          alt="Hero"
          fill
          priority
          fetchPriority="high"
          quality={80}
          sizes="(max-width: 768px) 100vw,
       (max-width: 1200px) 100vw,
       1600px"
          className="object-cover md:object-contain object-center"
        />
      </div>
      <h1 className="text-[#f84f3e] text-[clamp(3.5rem,15vw,11.5rem)] leading-[0.8] tracking-tighter font-avantt-heavy uppercase z-10">
        <span
          ref={firstnameRef}
          className="absolute right-[2px] sm:right-[10px] md:right-[15px] bottom-0"
        >
          gianluca
        </span>
        <span
          ref={lastnameRef}
          className="absolute top-0 left-[2px] sm:left-[10px] md:left-[15px] "
        >
          vetrugno
        </span>
      </h1>
    </div>
  );
};

export default Hero;
