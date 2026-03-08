"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ManifestoSection() {
  const manifestoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Select all words with class .manifesto-word
      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");

      // Animate each word from gray (text-black/40) to black (text-black) as scroll progresses
      words.forEach((word, index) => {
        gsap.fromTo(
          word,
          { color: "rgba(0, 0, 0, 0.4)" },
          {
            color: "rgba(0, 0, 0, 1)",
            duration: 0.3,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: manifestoRef.current,
              start: `top ${90 - index * 2.5}%`,
              end: `top ${75 - index * 2.5}%`,
              toggleActions: "play play play reverse",
            },
          },
        );
      });

      // Parallax effect on grid background
      gsap.to(".grid-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 px-6 max-w-5xl mx-auto text-center relative overflow-hidden min-h-[60vh] flex items-center justify-center"
    >
      {/* Background Grid - Full Width */}
      <div className="absolute inset-0 grid-bg opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      {/* Manifesto Text - Word by Word */}
      <h2
        ref={manifestoRef}
        className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight relative z-10"
      >
        <span className="manifesto-word inline text-black/40">
          &ldquo;Financial
        </span>{" "}
        <span className="manifesto-word inline text-black/40">privacy</span>{" "}
        <span className="manifesto-word inline text-black/40">is</span>{" "}
        <span className="manifesto-word inline text-black/40">not</span>{" "}
        <span className="manifesto-word inline text-black/40">a</span>{" "}
        <span className="manifesto-word inline text-black/40">luxury.</span>
        <br />
        <span className="manifesto-word inline italic text-black/40">
          It
        </span>{" "}
        <span className="manifesto-word inline italic text-black/40">is</span>{" "}
        <span className="manifesto-word inline italic text-black/40">the</span>{" "}
        <span className="manifesto-word inline italic text-black/40">
          foundation
        </span>{" "}
        <span className="manifesto-word inline italic text-black/40">of</span>{" "}
        <span className="manifesto-word inline italic text-black/40">
          confident
        </span>{" "}
        <span className="manifesto-word inline italic text-black/40">
          business.
        </span>
        <span className="manifesto-word inline text-black/40">&rdquo;</span>
      </h2>
    </section>
  );
}
