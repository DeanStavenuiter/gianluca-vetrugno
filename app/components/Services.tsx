"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Bespoke Private Dining",
    description: "Intimate, seasonal tasting menus crafted for private settings.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7107.webp",
  },
  {
    title: "Curated Events & Catering",
    description: "Thoughtful food experiences for brand, corporate, and private events.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_8784.webp",
  },
  {
    title: "Culinary Consulting & Direction",
    description: "Menu development, concept refinement, and creative guidance.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7112.webp",
  },
  {
    title: "Creative Collaborations",
    description: "4-hands dinners, pop-ups, creative partnerships.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_8785.webp",
  },
  {
    title: "Hands-on Workshops",
    description: "Interactive culinary sessions for teams, groups, and companies.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_9942.webp",
  },
  {
    title: "Signature Experiences",
    description: "One-off concepts designed around a unique vision or moment.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7107.webp",
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".service-card-anim");

      gsap.set(titleRef.current, { opacity: 0, y: -18 });
      gsap.set(cards, { opacity: 0, y: 24, scale: 0.98 });

      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: { amount: 0.35, from: "start" },
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="pb-10 md:pb-16 overflow-x-hidden">
      <h2
        ref={titleRef}
        className="w-full text-center text-[clamp(1.5rem,8vw,2rem)] tracking-[0.12em] uppercase z-10 relative font-avantt-medium text-(--header-text-color) px-4 pb-10"
      >
        Where this approach takes shape
      </h2>

      <div className="mt-8 px-4 md:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="group aspect-3/4 overflow-hidden shadow-2xl rounded-xl cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="service-card-anim relative w-full h-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 45vw, 280px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Overlay that appears on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-x-0 bottom-0 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <div className="bg-(--secondary-text-color) rounded-b-lg p-3 md:p-4 h-[72px] md:h-[88px] flex flex-col justify-center transition-all duration-500 group-hover:bg-(--secondary-text-color)/95">
                    <h3 className="text-(--header-text-color) font-avantt-heavy uppercase text-md md:text-lg leading-tight transition-transform duration-300 group-hover:translate-x-1">
                      {service.title}
                    </h3>
                    <p className="text-[14px] md:text-xs text-(--primary-text-color) font-avantt-regular opacity-90 leading-snug line-clamp-2 mt-1 transition-opacity duration-300 group-hover:opacity-100">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Services;