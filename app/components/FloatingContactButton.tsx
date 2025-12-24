"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const FloatingContactButton = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Don't show on contact page
  const isContactPage = pathname === "/contact";

  useEffect(() => {
    if (isContactPage) return;

    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isContactPage]);

  useEffect(() => {
    if (!buttonRef.current || isContactPage) return;

    if (isVisible) {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    } else {
      gsap.to(buttonRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isVisible, isContactPage]);

  if (isContactPage) return null;

  return (
    <Link
      ref={buttonRef}
      href="/contact"
      className="fixed bottom-8 right-8 z-50 group opacity-0"
      aria-label="Go to contact page"
    >
      <div className="relative flex items-center gap-3 rounded-lg bg-(--secondary-text-color) px-6 py-4 transition-all duration-300 hover:bg-(--secondary-hover-text-color) hover:shadow-[0_0_30px_rgba(46,79,79,0.5)]">
        {/* Decorative corner accent */}
        <div className="absolute -top-1 -left-1 w-3 h-3" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3" />
        
        <span className="text-(--primary-text-color) text-[clamp(0.875rem,1.2vw,1rem)] font-avantt-heavy uppercase tracking-tight">
          Let&apos;s Connect
        </span>
        <span className="text-(--primary-text-color) font-avantt-medium transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
          ↗
        </span>
      </div>
    </Link>
  );
};

export default FloatingContactButton;

