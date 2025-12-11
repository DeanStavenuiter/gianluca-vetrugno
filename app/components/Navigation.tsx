"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import AnimatedWord from "./AnimatedWord";

const Navigation = () => {
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 25;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div
        className={`fixed top-0 z-50 font-avantt-heavy tracking-tighter  mx-auto w-full transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center flex-row">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="py-4 px-2 cursor-pointer"
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

          <div 
            className="absolute right-0 top-0 h-full bg-[#ffb160] flex items-center justify-center gap-2 px-4 group cursor-pointer"
            onClick={() => scrollToSection("contact")}
          >
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

        {/* Mobile Navigation Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          <div className="flex-1"></div>
          <button
            onClick={toggleMobileMenu}
            className="relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[#ffb160] transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#ffb160] transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#ffb160] transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Mobile Menu Content */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-black border-l border-[#fee9ce]/10 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full pt-20 px-6">
            {/* Navigation Items */}
            <nav className="flex flex-col gap-8 mb-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-2 cursor-pointer"
                >
                  <span className="uppercase block text-[#ffb160] text-2xl font-avantt-heavy tracking-tighter">
                    <AnimatedWord>{item.name}</AnimatedWord>
                  </span>
                </button>
              ))}
            </nav>

            {/* Let's Connect Button */}
            <div className="mt-auto mb-8">
              <button
                onClick={() => scrollToSection("contact")}
                className="group w-full bg-[#ffb160] flex items-center justify-center gap-2 px-6 py-4 cursor-pointer"
              >
                <span className="text-black uppercase font-avantt-medium text-lg">
                  Let&apos;s Connect
                </span>
                <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 font-avantt-medium text-black">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
