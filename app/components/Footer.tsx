"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "Private Dining",
  "Events & Catering",
  "Consulting",
  "Collaborations",
  "Workshops",
];

const navLinks = [
  { name: "Intro", id: "intro" },
  { name: "About", id: "about" },
  { name: "Press", id: "articles" },
  { name: "Contact", id: "contact" },
];

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    // Animate footer elements on scroll
    const elements = [
      nameRef.current,
      linksRef.current,
      servicesRef.current,
      contactRef.current,
    ].filter(Boolean);

    gsap.fromTo(
      elements,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerElement,
          start: "top 85%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === footerElement) {
          trigger.kill();
        }
      });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 25;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full bg-black border-t border-[#fee9ce]/10 py-12 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Name and Description - Left Side */}
          <div ref={nameRef} className="flex flex-col gap-2">
            <p className="text-[#fee9ce] text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-medium uppercase">
              Gianluca Vetrugno
            </p>
            <p className="text-[#fee9ce]/60 text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium">
              Former Michelin Starred Head Chef & Creative Consultant.
            </p>
          </div>

          {/* Links Section */}
          <div ref={linksRef} className="flex flex-col gap-4">
            <h3 className="text-[#f84f3e] text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
              Links
            </h3>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-[#fee9ce] hover:text-[#ffb160] text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div ref={servicesRef} className="flex flex-col gap-4">
            <h3 className="text-[#f84f3e] text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
              Services
            </h3>
            <div className="flex flex-col gap-2">
              {services.map((service, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection("services")}
                  className="text-left text-[#fee9ce] hover:text-[#ffb160] text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium transition-colors duration-300"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div ref={contactRef} className="flex flex-col gap-4">
            <h3 className="text-[#f84f3e] text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
              Contact
            </h3>
            <div className="flex flex-col gap-2">
              <p className="text-[#fee9ce] text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                Gianluca Vetrugno
              </p>
              <a
                href="mailto:hello@gianluca-vetrugno.com"
                className="text-[#fee9ce] hover:text-[#ffb160] text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium transition-colors duration-300"
              >
                hello@gianluca-vetrugno.com
              </a>
              <p className="text-[#fee9ce] text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                Antwerp, Belgium
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-[#fee9ce]/10">
          <div>
            <p className="text-[#fee9ce]/60 text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium">
              © {currentYear} Gianluca Vetrugno
            </p>
          </div>

          <div>
            <p className="text-[#fee9ce]/60 text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium hover:text-[#ffb160] transition-colors duration-300">
              Made by{" "}
              <Link href="https://deanstavenuiter.nl" target="_blank">
                {" "}
                Dean Stavenuiter
              </Link>
            </p>
          </div>
          <button
            onClick={scrollToTop}
            className="text-[#fee9ce] hover:text-[#ffb160] text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300 flex items-center gap-2 group"
          >
            <span>Back to Top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              ↗
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
