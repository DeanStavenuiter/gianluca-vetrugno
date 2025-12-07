"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import AnimatedWord from "./AnimatedWord";

const Navigation = () => {
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const navItems = useMemo(
    () => [
      { name: "Intro", id: "intro" },
      { name: "About", id: "about" },
      { name: "Services", id: "services" },
      { name: "Press", id: "articles" },
      { name: "Contact", id: "contact" },
    ],
    []
  );

  useEffect(() => {
    // Find the intro section (about section)
    const introSection = document.querySelector('[data-section="intro"]');

    if (!introSection) return;

    // Create an intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show navigation when intro section is no longer visible at the top
          // This means we've scrolled past it
          setIsVisible(!entry.isIntersecting);
        });
      },
      {
        // Trigger when the top of the intro section leaves the viewport
        threshold: 0,
        rootMargin: "-1px 0px 0px 0px", // Slight offset to ensure it triggers
      }
    );

    observer.observe(introSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 25;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      className={`fixed top-0 z-50 font-avantt-heavy tracking-tighter bg-black mx-auto w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className=" flex justify-center flex-row">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="py-4 px-2"
            onClick={() => scrollToSection(item.id)}
          >
            <span
              ref={(el) => {
                textRefs.current[index] = el;
              }}
              className="uppercase block text-[#ffb160]"
            >
              <AnimatedWord>{item.name}</AnimatedWord>
            </span>
          </div>
        ))}

        <div className="absolute right-0 top-0 h-full bg-[#ffb160] flex items-center justify-center gap-2 px-4 group">
          <span className="text-black uppercase font-avantt-medium">
            Let&apos;s Connect
          </span>
          <div className="flex justify-center ">
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 font-avantt-medium">
              ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
