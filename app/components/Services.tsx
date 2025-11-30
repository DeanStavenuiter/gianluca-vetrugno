"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_8784.webp",
  },
  {
    title: "Consulting",
    description: "Menu creation, creative direction, restaurant support.",
    image:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/services/IMG_7112.webp",
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
  const titleRef = useRef<HTMLHeadingElement>(null);


  useEffect(() => {
    if (!titleRef.current) return;

    const titleElement = titleRef.current;
    const title = new SplitText(titleElement, { type: "chars" });

    // Set initial state (hidden)
    gsap.set(title.chars, {
      opacity: 0,
      y: -50,
    });

    // Create scroll-triggered animation
    gsap.to(title.chars, {
      opacity: 1,
      y: 0,
      ease: "back.out(1.7)",
      stagger: {
        from: "center",
        each: 0.06,
      },
      scrollTrigger: {
        trigger: titleElement,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === titleElement) {
          trigger.kill();
        }
      });
    };
  }, []);

  useEffect(() => {

    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;
    // const isTablet = viewportWidth < 1024;

    const circleDegrees = isMobile ? 30 : 20;

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

      // Animate circles rotation
      gsap.fromTo(
        circlesRef.current,
        {
          rotation: circleDegrees,
        },
        {
          rotation: -circleDegrees,
          ease: "power2.inOut",
          stagger: 0.08,
          scrollTrigger: {
            trigger: pinHeightRef.current,
            start: "top bottom",
            end: "bottom 50",
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
    <section ref={sectionRef} className="text-[#fee9ce] overflow-x-clip">
      <div ref={pinHeightRef} className="h-[80vh] md:h-[300vh]">
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
          {/* Header */}
          <h2
            ref={titleRef}
            className="w-full text-center text-[clamp(2.5rem,8vw,6rem)] tracking-[-0.05em] uppercase z-50 relative font-avantt-heavy text-[#f84f3e] px-4"
          >
            services
          </h2>

          {/* Circles with images */}
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => {
                if (el) circlesRef.current[index] = el;
              }}
              className="circle absolute top-[40%] md:top-[50%] w-[400%] md:w-[300%] aspect-square left-[-150%] md:-left-full z-10 rounded-b-lg"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-[55vw] md:w-[20vw] aspect-[0.74] overflow-hidden shadow-2xl rounded-[0.6vw]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 55vw, 25vw"
                    className="object-cover rounded-b-[0.6vw]"
                  />
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end ">
                    <div className="bg-black/30 backdrop-blur-lg rounded-b-[0.6vw] p-3 md:p-4 border border-white/10">
                      <h3 className="text-[#f84f3e] font-avantt-heavy uppercase text-lg md:text-2xl mb-2">
                        {service.title}
                      </h3>
                      <p className="text-xs md:text-sm text-[#ffb160]">
                        {service.description}
                      </p>
                    </div>
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
