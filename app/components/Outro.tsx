"use client";
import React, { useId, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gradient from "./Gradient";

gsap.registerPlugin(ScrollTrigger);

const SVG_REVEAL_DURATION_SECONDS = 0.7;

const OUTRO_PATH_D =
  'm 211.25,373.8546 c -1.84725,-1.85405 -1.51973,-7.09999 1.17715,-18.8546 2.02341,-8.81921 8.88596,-32.44047 11.10406,-38.22073 0.35095,-0.91458 -1.58571,0.56094 -4.3037,3.27893 -5.33644,5.33645 -8.48119,6.20484 -10.28233,2.83937 -1.04689,-1.95613 -1.28713,-1.75291 -3.45234,2.92047 -2.4436,5.27426 -5.25767,7.59317 -7.95738,6.55719 C 195.6063,331.63495 193,326.88457 193,324.10868 c 0,-3.70246 -1.69558,-3.0681 -2.94491,1.10177 -2.03722,6.79963 -3.89324,8.93887 -7.45432,8.59178 -2.74373,-0.26743 -3.35516,-0.94494 -5.31001,-5.88392 -1.21508,-3.06992 -2.6034,-8.46992 -3.08514,-12 -0.85892,-6.29385 -0.89968,-6.36059 -2.1022,-3.44161 C 169.90005,317.82513 168,328.97914 168,336.56538 168,340.85513 167.577,344 167,344 c -2.38422,0 -0.13048,-22.90348 3.10455,-31.54989 1.83969,-4.917 3.44851,-7.23038 4.3803,-6.29859 0.19349,0.19348 0.87165,4.17604 1.50704,8.85013 1.15616,8.50498 3.74701,16.10091 5.95781,17.46726 3.11265,1.92373 7.92994,-8.18831 9.54597,-20.03806 1.65222,-12.11519 2.67027,-10.87608 2.85915,3.48001 0.12772,9.70746 0.39374,11.28306 2.2119,13.10079 4.29373,4.29272 8.1267,-1.243 10.42131,-15.05081 1.78953,-10.76852 3.18388,-12.12104 2.41502,-2.34256 -0.7745,9.85025 0.6388,11.59247 2.91679,3.59561 C 214.5246,307.4741 219.53104,299 221.89891,299 c 1.79278,0 3.54898,3.03121 4.3453,7.5 0.29711,1.66732 0.66355,1.4178 2.20293,-1.5 2.74101,-5.19542 9.84108,-14 11.28969,-14 1.63721,0 1.59241,1.63838 -0.23683,8.66131 -1.87879,7.21315 -2.03912,17.68506 -0.2617,17.09259 0.68107,-0.22702 3.13269,-3.96923 5.44805,-8.31602 4.78153,-8.9767 6.36355,-10.30455 5.64957,-4.74191 -0.30767,2.39711 0.0303,4.49648 0.91389,5.67628 1.34238,1.79245 1.55872,1.73476 5.07616,-1.3536 3.02422,-2.65529 3.67403,-3.89942 3.67403,-7.03427 0,-15.06759 12.20398,-48.48853 24.41126,-66.8509 C 291.35701,223.68558 300.32272,216 305.5651,216 c 3.22278,0 5.4349,3.82383 5.4349,9.39466 0,11.06598 -5.83514,24.74973 -19.42321,45.54858 -4.5119,6.90622 -9.39436,14.58176 -10.84992,17.05676 -2.97545,5.05939 -8.56602,11.49418 -9.32596,10.73425 -0.27438,-0.27439 1.66066,-3.41949 4.3001,-6.9891 2.63945,-3.56962 8.17399,-11.98843 12.29899,-18.70846 4.125,-6.72004 9.15502,-14.90527 11.17783,-18.18939 C 308.85655,239.13343 312.26193,218 305.1153,218 c -2.82138,0 -9.50509,4.99319 -14.05494,10.5 -12.15069,14.70632 -26.69415,48.6952 -28.66856,67 -0.74955,6.94916 -0.68675,6.91432 6.46569,-3.58746 5.61525,-8.24477 9.73826,-12.65012 10.82359,-11.56479 0.37893,0.37893 -0.92138,2.3682 -2.88959,4.42061 C 272.40184,289.3458 263,303.32108 263,305.26859 263,307.3362 266.30573,310 268.87158,310 c 2.89911,0 11.13007,-7.75276 16.04482,-15.11266 2.1287,-3.18776 5.83054,-9.8666 8.22631,-14.84186 2.39577,-4.97526 4.80625,-8.88935 5.35662,-8.69798 3.25116,1.13046 -4.51965,41.86376 -11.14658,58.42847 C 280.88187,345.95062 275,350.83267 275,340.02895 275,332.7037 277.40694,321.78904 281.84262,309 l 3.9886,-11.5 -4.66561,5.28497 c -8.3098,9.41291 -13.20674,11.26481 -17.75652,6.71503 -1.375,-1.375 -2.68136,-2.5 -2.90302,-2.5 -0.22167,0 -1.61692,1.125 -3.10057,2.5 -3.66089,3.3928 -7.15045,3.29034 -8.51468,-0.25 l -1.05968,-2.75 -2.03093,4 c -3.73439,7.35501 -7.84001,10.44463 -9.19322,6.91821 -1.03419,-2.69506 -0.64051,-11.64301 0.77735,-17.66821 0.7442,-3.1625 1.20394,-5.75 1.02164,-5.75 -0.7677,0 -8.61497,12.31456 -9.42767,14.79466 -0.48759,1.48794 -1.37634,7.88034 -1.975,14.20534 -2.65589,28.05996 -11.14866,55.47621 -15.75331,50.8546 z m 6.66824,-12.84727 C 221.76356,348.7625 226.45034,321 224.67215,321 c -1.64686,0 -11.40582,36.17725 -12.27381,45.5 l -0.55863,6 2.0175,-2.49267 c 1.10962,-1.37097 2.93708,-5.42097 4.06103,-9 z M 283.43237,333.75 c 4.90375,-10.1318 9.57559,-27.01187 12.03752,-43.49342 1.86903,-12.51231 1.86149,-13.51559 -0.0747,-9.9439 -1.68725,3.11247 -9.42441,22.09222 -12.50978,30.68732 -4.76939,13.28635 -7.63942,32 -4.9077,32 0.53774,0 2.99234,-4.1625 5.45467,-9.25 z m -62.9644,-17.41184 c 2.73039,-3.57589 3.52855,-5.55772 3.51672,-8.73196 -0.0196,-5.25281 -1.26533,-7.4481 -3.27842,-5.77739 -2.11595,1.75608 -6.84463,12.78388 -7.46502,17.40922 -0.51136,3.81249 -0.44123,3.93936 1.57978,2.85775 1.1632,-0.62252 3.70432,-3.21345 5.64694,-5.75762 z m -117.06138,51.23878 c -5.161689,-11.27462 -10.916165,-40.63783 -13.99005,-71.38666 -1.433426,-14.33891 -1.440003,-18.61639 -0.0263,-17.10695 0.214631,0.22917 0.903391,6.04167 1.53058,12.91667 2.512321,27.53912 6.879633,52.97021 11.67772,68 2.48067,7.77061 3.93718,10.79761 4.78672,9.94807 0.83629,-0.83628 2.61425,-20.6963 2.62343,-29.30402 0.0212,-19.87676 7.58528,-64.15684 12.62394,-73.90052 2.49994,-4.83435 2.42763,-2.63975 -0.19097,5.79613 -5.62767,18.12962 -9.04911,40.75351 -10.94457,72.36957 -0.80486,13.42508 -1.7263,25.23758 -2.04763,26.25 -1.07072,3.37356 -3.52426,1.91907 -6.04287,-3.58229 z m 18.65834,-10.51201 c -2.73191,-2.73191 -4.05288,-8.33782 -4.05935,-17.22696 -0.0132,-18.17564 6.78113,-36.72076 15.561,-42.47355 2.23177,-1.46231 2.64059,-1.4587 4.93342,0.0436 1.76236,1.15474 2.5,2.53817 2.5,4.6887 0,7.00338 -9.03503,28.22001 -17.06508,40.07329 -3.38525,4.99702 -3.73304,6.0471 -2.93006,8.84691 1.22047,4.25553 2.79214,5.98306 5.44327,5.98306 6.35761,0 10.25043,-9.76971 20.28869,-50.91798 4.64002,-19.02011 8.64734,-35.65961 8.90515,-36.97666 0.27481,-1.40394 0.8371,-2.02452 1.3591,-1.5 0.74132,0.74489 -0.98116,11.49768 -3.70753,23.14464 -0.44569,1.90394 -0.11518,2.25 2.1489,2.25 1.52909,0 2.41076,0.42851 2.05756,1 -0.33992,0.55 -1.66399,1 -2.94239,1 -3.03336,0 -3.43496,1.62875 -4.1916,17 -0.55168,11.20745 0.24441,22.60266 2.27051,32.5 0.44504,2.17397 0.30838,2.71498 -0.49633,1.96486 -1.62785,-1.51743 -2.95043,-9.65518 -3.75433,-23.10018 L 147.67645,311.5 143.9472,326 c -4.06915,15.82158 -6.09152,21.54568 -9.61249,27.207 -3.70976,5.96488 -8.61919,7.50852 -12.26978,3.85793 z m 6.86692,-27.10792 C 134.17416,319.83678 139,306.77018 139,302.69613 c 0,-3.42514 -1.95081,-4.83051 -4.66895,-3.36354 -6.68787,3.60944 -12.67155,17.78055 -14.29106,33.84542 -1.43607,14.24522 0.14004,13.67429 8.89186,-3.221 z M 305.66333,299.33 c -1.18323,-1.18323 -0.70128,-2.55854 0.70718,-2.01806 0.75378,0.28925 3.11628,-0.89995 5.25,-2.64268 3.51621,-2.87188 3.72826,-2.93452 2.26449,-0.66892 -1.83366,2.8381 -7.22094,6.33038 -8.22167,5.32966 z';

const Outro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const svgRevealRectRef = useRef<SVGRectElement>(null);
  const maskId = useId().replace(/:/g, "");
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 408,
    height: 612,
  });
  const [svgViewBox, setSvgViewBox] = useState("0 0 408 612");
  const [maskBox, setMaskBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 408, height: 612 });

  useLayoutEffect(() => {
    const path = svgPathRef.current;
    if (!path) return;

    // Size the SVG tightly to the path bounds (with a small padding for stroke).
    const bbox = path.getBBox();
    const computedStrokeWidth =
      Number.parseFloat(window.getComputedStyle(path).strokeWidth) || 0;
    const pad = computedStrokeWidth / 2;

    const x = bbox.x - pad;
    const y = bbox.y - pad;
    const width = bbox.width + pad * 2;
    const height = bbox.height + pad * 2;

    setSvgViewBox(`${x} ${y} ${width} ${height}`);
    setSvgSize({ width, height });
    setMaskBox({ x, y, width, height });
  }, []);

  useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !contentRef.current ||
      !paragraph1Ref.current ||
      !paragraph2Ref.current ||
      !svgPathRef.current ||
      !svgRevealRectRef.current
    )
      return;

    const ctx = gsap.context(() => {
      // Split text into words (preserving spaces for natural wrapping)
      const splitTextIntoWords = (element: HTMLElement) => {
        const text = element.textContent || "";
        element.innerHTML = "";

        // Split by spaces but keep track of words
        const words = text.split(/(\s+)/);

        words.forEach((word) => {
          if (word.match(/^\s+$/)) {
            // It's whitespace - add as text node to allow natural wrapping
            element.appendChild(document.createTextNode(word));
          } else if (word) {
            // It's a word - wrap each character in a span
            const wordWrapper = document.createElement("span");
            wordWrapper.style.display = "inline";
            wordWrapper.style.whiteSpace = "nowrap";

            word.split("").forEach((char) => {
              const span = document.createElement("span");
              span.textContent = char;
              span.style.color = "rgba(255, 232, 205, 0.15)";
              span.style.display = "inline";
              wordWrapper.appendChild(span);
            });

            element.appendChild(wordWrapper);
          }
        });

        return element.querySelectorAll("span > span");
      };

      const chars1 = splitTextIntoWords(paragraph1Ref.current!);
      const chars2 = splitTextIntoWords(paragraph2Ref.current!);

      // SVG reveal animation (NOT scroll-driven)
      const revealRect = svgRevealRectRef.current!;
      gsap.set(revealRect, { attr: { width: 0 } });
      const svgTl = gsap.timeline({ paused: true });
      // Reveal left -> right.
      svgTl.to(revealRect, {
        attr: { width: maskBox.width },
        ease: "none",
        duration: SVG_REVEAL_DURATION_SECONDS,
      });

      let svgPlayed = false;

      // Create a timeline for sequential animations with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: contentRef.current,
          pinSpacing: true,
          onUpdate: (self) => {
            if (!svgPlayed && self.progress >= 0.999) {
              svgPlayed = true;
              svgTl.play();
            }
          },
        },
      });

      // Animate first paragraph
      tl.to(chars1, {
        color: "var(--primary-text-color)",
        stagger: 0.01,
        ease: "none",
        duration: 1,
      });

      // Animate second paragraph after first completes
      tl.to(
        chars2,
        {
          color: "var(--primary-text-color)",
          stagger: 0.01,
          ease: "none",
          duration: 1,
        },
        "+=0.1"
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [maskBox.width]);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={contentRef}
        className="min-h-screen flex flex-col items-center justify-center relative "
      >
        <Gradient />
        <div className="space-y-12 z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6 px-6 relative z-10">
            <p
              ref={paragraph1Ref}
              className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular"
            >
              When people eat my food, I want them to feel comfortable. Like
              sitting at the table when my grandmother used to cook. Feeling
              welcome, understood, and taken care of.
            </p>
            <p
              ref={paragraph2Ref}
              className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed font-avantt-regular"
            >
              I like to explain a dish, where it comes from, and the idea behind
              it, so that food becomes something personal, not just something to
              eat.
            </p>
          </div>
          <div className={"flex justify-center z-10"}>
            <svg
              version="1.1"
              width={svgSize.width}
              height={svgSize.height}
              viewBox={svgViewBox}
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask
                  id={maskId}
                  x={maskBox.x}
                  y={maskBox.y}
                  width={maskBox.width}
                  height={maskBox.height}
                  maskUnits="userSpaceOnUse"
                  maskContentUnits="userSpaceOnUse"
                >
                  <rect
                    x={maskBox.x}
                    y={maskBox.y}
                    width={maskBox.width}
                    height={maskBox.height}
                    fill="black"
                  />
                  <rect
                    ref={svgRevealRectRef}
                    x={maskBox.x}
                    y={maskBox.y}
                    width={0}
                    height={maskBox.height}
                    fill="white"
                  />
                </mask>
              </defs>

              {/* Hidden geometry used only for sizing (getBBox) */}
              <path
                ref={svgPathRef}
                d={OUTRO_PATH_D}
                fill="none"
                stroke="none"
                visibility="hidden"
              />

              {/* Fill + outline are both revealed by the same left->right mask */}
              <g mask={`url(#${maskId})`}>
                <path d={OUTRO_PATH_D} fill="#ffffff" />
                <path d={OUTRO_PATH_D} fill="none" stroke="#ffffff" strokeWidth={1} />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outro;
