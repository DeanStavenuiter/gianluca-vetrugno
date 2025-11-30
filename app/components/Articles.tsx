"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Article {
  title: string;
  publication: string;
  url: string;
  imageUrl: string;
}

const articles: Article[] = [
  {
    title: "De Grote Test: Sterrenchef Test 18 Keer Tomatenpuree",
    publication: "GVA",
    url: "https://www.gva.be/lifestyle/eten-en-drinken/de-grote-test.-sterrenchef-gianluca-vetrugno-test-18-keer-tomatenpuree-de-prijs-zegt-duidelijk-niet-alles/47290440.html",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/de-grote-test_tomatenpuree.webp",
  },
  {
    title: "Le Pristine Viert Vierde Verjaardag Met Feestmenu",
    publication: "Het Laatste Nieuws",
    url: "https://www.hln.be/antwerpen/le-pristine-viert-vierde-verjaardag-met-feestmenu~aa05013ef/",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/hln_le-prestine-viert-vierde-verjaardag.webp",
  },
  {
    title: "Sterrenchef Proeft 10 Pasta's Uit De Winkel",
    publication: "Het Laatste Nieuws",
    url: "https://www.hln.be/getest/1-09-euro-voor-de-lekkerste-sterrenchef-proeft-10-pasta-s-uit-de-winkel-en-vindt-maar-een-winnaar-hij-heeft-zelfs-wat-smaak~a1aa6ca2/",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/sterrenchef-proeft-10-pastas.webp",
  },
  {
    title: "Topchef Proeft 10 Kant-en-klare Tomatensauzen",
    publication: "Het Laatste Nieuws",
    url: "https://www.hln.be/getest/de-duurste-blijkt-ook-de-slechtste-topchef-proeft-10-kant-en-klare-tomatensauzen-en-vindt-een-duidelijke-winnaar~aee07bb1/",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/topchef-proeft-10-tomatensauzen.webp",
  },
  {
    title: "De 3 Favoriete Restaurants Van Gianluca Vetrugno",
    publication: "De Morgen",
    url: "https://koken.demorgen.be/themas/de-3-favoriete-restaurants-van-le-pristine-chef-gianluca-vetrugno/",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/luca-fabozzi.webp",
  },
  {
    title: "Le Pristine Antwerpen",
    publication: "Gault&Millau",
    url: "https://www.gaultmillau.be/en/restaurants/le-pristine-antwerpen",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/gault-millau.webp",
  },
  {
    title: "Le Pristine - Michelin Guide",
    publication: "Michelin Guide",
    url: "https://guide.michelin.com/it/it/antwerpen/be-antwerpen/ristorante/le-pristine",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/IMG_0074.webp",
  },
  {
    title: "3 Kooktips Voor Spaghetti Van Sterrenchef",
    publication: "Showbizz24",
    url: "https://www.showbizz24.be/overig/chef-kok-gianluca-vetrugno-van-sterrenrestaurant-le-pristine-geeft-3-kooktips-voor-spaghetti-maakt-echt-het-verschil-49390",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/showbiz.webp",
  },
  {
    title: "Familierecept Gianluca Vetrugno",
    publication: "De Morgen",
    url: "https://koken.demorgen.be/auteur/familierecept-gianluca-vetrugno/",
    imageUrl:
      "https://gianluca-vetrugno.s3.eu-west-3.amazonaws.com/articles/demorgen.webp",
  },
];

const Articles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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
    const listElement = listRef.current;
    const mediaContainer = mediaContainerRef.current;

    if (!listElement || !mediaContainer) return;

    const rows = listElement.querySelectorAll("li");

    // Set up GSAP quickTo for smooth vertical following
    gsap.set(mediaContainer, { yPercent: -50 });

    const yTo = gsap.quickTo(mediaContainer, "y", {
      duration: 0.5,
      ease: "power4",
    });

    // Show media container on list hover
    const handleMouseEnter = () => {
      mediaContainer.style.visibility = "visible";
    };

    const handleMouseLeave = () => {
      mediaContainer.style.visibility = "hidden";
      // Clear all children
      Array.from(mediaContainer.children).forEach((el) => el.remove());
    };

    const handleMouseMove = (e: MouseEvent) => {
      yTo(e.clientY); // Track vertical position only
    };

    listElement.addEventListener("mouseenter", handleMouseEnter);
    listElement.addEventListener("mouseleave", handleMouseLeave);
    listElement.addEventListener("mousemove", handleMouseMove);

    // Store row handlers for cleanup
    const rowHandlers: Array<{ element: Element; handler: () => void }> = [];

    // Add hover effect for each row
    rows.forEach((row, index) => {
      const handleRowEnter = () => {
        createMedia(index);
      };

      row.addEventListener("mouseenter", handleRowEnter);
      rowHandlers.push({ element: row, handler: handleRowEnter });
    });

    function createMedia(index: number) {
      if (!mediaContainer) return;

      const div = document.createElement("div");
      const img = document.createElement("img");

      img.src = articles[index].imageUrl;
      img.alt = articles[index].title;

      // Style the container div
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.left = "0";
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.overflow = "hidden";

      // Style the image
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.display = "block";
      img.style.position = "absolute";
      img.style.top = "0";
      img.style.left = "0";

      // Set initial position for animation
      gsap.set(div, { y: "-100%" });
      gsap.set(img, { y: "90%" });

      div.appendChild(img);
      mediaContainer.appendChild(div);

      gsap.to([div, img], {
        y: 0,
        duration: 0.6,
        ease: "expo.inOut",
      });

      // Limit number of images in container
      if (mediaContainer.children.length > 20) {
        mediaContainer.children[0].remove();
      }
    }

    return () => {
      listElement.removeEventListener("mouseenter", handleMouseEnter);
      listElement.removeEventListener("mouseleave", handleMouseLeave);
      listElement.removeEventListener("mousemove", handleMouseMove);

      // Clean up row event listeners
      rowHandlers.forEach(({ element, handler }) => {
        element.removeEventListener("mouseenter", handler);
      });
    };
  }, []);

  return (
    <section className="min-h-screen w-full font-avantt-heavy">
      <div ref={containerRef} className="">
        <h2
          ref={titleRef}
          className="text-[clamp(2.5rem,8vw,6rem)] font-avantt-heavy uppercase text-[#f84f3e] pl-4 md:pl-6"
        >
          Press & Features
        </h2>

        <ul ref={listRef} className="">
          {articles.map((article, index) => (
            <li
              key={index}
              onClick={() => window.open(article.url, "_blank")}
              className="group border-t border-border py-4 md:py-6 hover:bg-muted/30 transition-colors duration-300 px-4 md:px-6 cursor-none"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#fee9ce]">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="text-sm md:text-base font-semibold whitespace-nowrap text-[#ffb160]">
                    {article.publication}
                  </span>
                  {/* Media container for hover effect - hidden on mobile */}
                  <div
                    ref={mediaContainerRef}
                    className="hidden md:block fixed pointer-events-none z-50 rounded-lg"
                    style={{
                      width: "24vw",
                      height: "24vw",
                      right: "23vw",
                      top: 0,
                      overflow: "hidden",
                      visibility: "hidden",
                    }}
                  >
                    {/* Images will be dynamically added here */}
                  </div>
                  <span className="text-sm text-[#fee9ce] md:text-base whitespace-nowrap md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    Read article{" "}
                    <span className="hidden md:inline-block -rotate-45">→</span>
                    <span className="inline-block md:hidden -rotate-45">→</span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Articles;
