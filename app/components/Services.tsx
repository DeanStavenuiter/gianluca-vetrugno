"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Private Dining",
    description: "Exclusive, seasonal, personalized multi-course experiences.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7107.webp",
  },
  {
    title: "Events & Catering",
    description: "From intimate gatherings to high-end corporate events.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7112.webp",
  },
  {
    title: "Consulting",
    description: "Menu creation, creative direction, restaurant support.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_8784.webp",
  },
  {
    title: "Collaborations",
    description: "4-hands dinners, pop-ups, creative partnerships.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_8785.webp",
  },
  {
    title: "Workshops",
    description: "Hands-on culinary sessions for groups and companies.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_9942.webp",
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinHeightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement[]>([]);
  const scrollTextRef = useRef<HTMLParagraphElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pinHeightRef.current || !containerRef.current)
      return;

    const ctx = gsap.context(() => {
      // Hide scroll text on scroll
      gsap.to(scrollTextRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "top top-=1",
          toggleActions: "play none reverse none",
        },
      });

      // Pin the container
      ScrollTrigger.create({
        trigger: pinHeightRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: containerRef.current,
      });

      // Animate title words
      titleWordsRef.current.forEach((word) => {
        if (word && word.children) {
          gsap.to(word.children, {
            yPercent: 100,
            ease: "expo.inOut",
            scrollTrigger: {
              trigger: word,
              start: "bottom bottom",
              end: "top 30%",
              scrub: 1.2,
            },
          });
        }
      });

      // Animate circles rotation
      gsap.fromTo(
        circlesRef.current,
        {
          rotation: 30,
        },
        {
          rotation: -30,
          ease: "power2.inOut",
          stagger: 0.06,
          scrollTrigger: {
            trigger: pinHeightRef.current,
            start: "top bottom+=50%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="text-[#fee9ce] overflow-x-clip md:py-20 "
    >
      <div ref={pinHeightRef} className="h-[400vh]">
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
          {/* Header */}
          <h2 className="w-full text-center text-[clamp(3rem,12vw,12rem)] tracking-[-0.05em] uppercase z-50 relative font-avantt-heavy text-[#f84f3e] md:mb-20 px-4">
            <span
              ref={(el) => {
                if (el) titleWordsRef.current[0] = el;
              }}
              className="inline-block overflow-hidden relative"
              style={{ verticalAlign: "top" }}
            >
              <span className="block px-2">services</span>
              <span
                className="block absolute inset-0 -translate-y-full px-2"
                aria-hidden="true"
              >
                services
              </span>
            </span>
          </h2>

          {/* Circles with images */}
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) circlesRef.current[index] = el;
              }}
              className="circle absolute top-[35%] md:top-[60%] w-[400%] md:w-[300%] aspect-square left-[-150%] md:-left-full z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-[55vw] md:w-[25vw] aspect-[0.74] overflow-hidden shadow-2xl rounded-[0.6vw]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 55vw, 25vw"
                    className="object-cover"
                  />
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <h3 className="text-[#f84f3e] font-avantt-heavy uppercase text-lg md:text-2xl mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#fee9ce]">
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
