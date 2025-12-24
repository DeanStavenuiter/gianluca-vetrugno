"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const isMainPage = pathname === "/";

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
    // If not on main page, navigate to main page with section hash
    if (!isMainPage) {
      router.push(`/#${sectionId}`);
      return;
    }

    // If on main page, scroll to section
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
      className="relative z-10 w-full bg-black border-t border-(--secondary-text-color)/30 py-12 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        {isMainPage ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            {/* Name and Description - Left Side */}
            <div ref={nameRef} className="flex flex-col gap-2">
              <p className="text-(--header-text-color) text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-medium uppercase">
                Gianluca Vetrugno
              </p>
              <p className="text-(--primary-text-color) text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium">
                Former Michelin Starred Head Chef & Creative Consultant.
              </p>
            </div>

            {/* Links Section */}
            <div ref={linksRef} className="flex flex-col gap-4">
              <h3 className="text-(--header-text-color)/80 text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
                Links
              </h3>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) =>
                  link.id === "contact" ? (
                    <Link
                      key={link.id}
                      href="/contact"
                      className="text-left text-(--primary-text-color) hover:text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="text-left text-(--primary-text-color) hover:text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300"
                    >
                      {link.name}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Services Section */}
            <div ref={servicesRef} className="flex flex-col gap-4">
              <h3 className="text-(--header-text-color)/80 text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
                Services
              </h3>
              <div className="flex flex-col gap-2">
                {services.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection("services")}
                    className="text-left text-(--primary-text-color) hover:text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium transition-colors duration-300"
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div ref={contactRef} className="flex flex-col gap-4">
              <h3 className="text-(--header-text-color)/80 text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
                Contact
              </h3>
              <div className="flex flex-col gap-2">
                <p className="text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                  Gianluca Vetrugno
                </p>
                <a
                  href="mailto:info@gianluca-vetrugno.com"
                  className="text-(--primary-text-color) hover:text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium transition-colors duration-300"
                >
                  info@gianluca-vetrugno.com
                </a>
                <p className="text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                  Antwerp, Belgium
                </p>
              </div>
            </div>
          </div>
        ) : (
          // mobile view
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 mb-12">
            {/* Name and Description - Left Side */}
            <div ref={nameRef} className="flex flex-col gap-2">
              <p className="text-(--header-text-color) text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-heavy uppercase">
                Gianluca Vetrugno
              </p>
              <p className="text-(--primary-text-color) text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium">
                Former Michelin Starred Head Chef & Creative Consultant.
              </p>
            </div>

            {/* Contact Section */}
            <div ref={contactRef} className="flex flex-col gap-4">
              <h3 className="text-(--primary-text-color) text-[clamp(1rem,1.5vw,1.25rem)] font-avantt-heavy uppercase tracking-tight">
                Contact
              </h3>
              <div className="flex flex-col gap-2">
                <p className="text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                  Gianluca Vetrugno
                </p>
                <a
                  href="mailto:hello@gianluca-vetrugno.com"
                  className="text-(--secondary-text-color) hover:text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium transition-colors duration-300"
                >
                  info@gianluca-vetrugno.com
                </a>
                <p className="text-(--secondary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-medium">
                  Antwerp, Belgium
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-[#fee9ce]/10">
          <div>
            <p className="text-(--header-text-color)/70 text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium">
              © {currentYear} Gianluca Vetrugno
            </p>
          </div>

          <div>
            <p className="text-(--header-text-color)/70 text-[clamp(0.75rem,1vw,0.9375rem)] font-avantt-medium hover:text-(--primary-text-color) transition-colors duration-300">
              Made by{" "}
              <Link href="https://deanstavenuiter.nl" target="_blank">
                {" "}
                Dean Stavenuiter
              </Link>
            </p>
          </div>
          {/* {isMainPage ? (
            <button
              onClick={scrollToTop}
              className="text-(--secondary-text-color) hover:text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300 flex items-center gap-2 group"
            >
              <span>Back to Top</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </button>
          ) : (
            <Link
              href="/"
              className="text-(--secondary-text-color) hover:text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1.125rem)] font-avantt-medium uppercase tracking-tight transition-colors duration-300 flex items-center gap-2 group"
            >
              <span>Back to Home</span>
              <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          )} */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
