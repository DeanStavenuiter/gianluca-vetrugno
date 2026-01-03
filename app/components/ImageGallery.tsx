"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  src: string;
  alt: string;
}

const images: GalleryImage[] = [
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_0075.webp",
    alt: "Gallery image 1",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/Events.webp",
    alt: "Gallery image 2",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_1725.webp",
    alt: "Gallery image 3",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/AR502365.webp",
    alt: "Gallery image 4",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_7002.webp",
    alt: "Gallery image 5",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_7107.webp",
    alt: "Gallery image 6",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_1724.webp",    
    alt: "Gallery image 7",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_4638.mp4",
    alt: "Gallery image 8",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_8784.webp",
    alt: "Gallery image 9",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/ConsultingPlating.webp",
    alt: "Gallery image 10",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/4hands5.webp",
    alt: "Gallery image 11",
  },
  {
    src: "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/image-gallery/IMG_7112.webp",
    alt: "Gallery image 12",
  },
];

const ImageGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const items = gridElement.querySelectorAll(".gallery-item");

    gsap.set(items, {
      opacity: 0,
      scale: 0.8,
    });

    gsap.to(items, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: {
        amount: 0.8,
        from: "random",
      },
      scrollTrigger: {
        trigger: gridElement,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === gridElement) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="w-full py-12 md:py-40 px-4 md:px-6">
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto"
      >
        {images.map((image, index) => {
          return (
          index === 7 ? (
            <Link href={"https://www.instagram.com/vetrugno_gianluca/"} target="_blank" rel="noopener noreferrer" key={index}>
              <div
                className="gallery-item aspect-square relative overflow-hidden rounded-lg"
              >
               <video loop autoPlay muted playsInline>
                <source src={image.src} type="video/mp4" />
               </video>
              </div>
            </Link>
          ): (
          <Link href={"https://www.instagram.com/vetrugno_gianluca/"} target="_blank" rel="noopener noreferrer" key={index}>
          <div
            className="gallery-item aspect-square relative overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 50vw, 16.66vw"
            />
          </div>
          </Link>)  
                )
          })}
      </div>
      <p className="text-center text-sm text-(--primary-text-color) font-avantt-regular mt-4">
        If you want to see more of what I do, please visit my Instagram page{" "}
        <Link
          href="https://www.instagram.com/vetrugno_gianluca/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--primary-text-color) font-avantt-medium hover:text-(--secondary-text-color) transition-colors duration-300"
        >
          @vetrugno_gianluca
        </Link>
        .
      </p>
    </section>
  );
};

export default ImageGallery;
