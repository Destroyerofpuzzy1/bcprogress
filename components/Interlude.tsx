"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGsap, LINE_FROM, LINE_TO } from "@/lib/gsap";

/** Oddech między zakresem prac a częścią o firmie. Jedno zdjęcie, jedno słowo. */
export function Interlude() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    gsap.fromTo(
      ".int-img",
      { yPercent: -8, scale: 1.1 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      ".int-line",
      LINE_FROM(),
      {
        ...LINE_TO(),
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      },
    );
  });

  return (
    <section
      ref={root}
      aria-label="Konstrukcja"
      className="relative h-[52svh] min-h-[340px] overflow-hidden bg-graphite lg:h-[62svh]"
    >
      <div className="int-img absolute inset-x-0 -top-[10%] -bottom-[10%]">
        <Image
          src="/assets/bc-progres/img/bud21.jpg"
          alt="Stalowy szkielet obiektu na tle nieba"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,14,0.75),rgba(14,15,14,0.05)_55%)]"
      />
      <div className="gut relative flex h-full items-end pb-[clamp(1.75rem,4vw,3.25rem)]">
        <h2 className="text-bone">
          <span className="line-mask">
            <span className="line-inner int-line text-[clamp(2.5rem,9.5vw,6.5rem)]">
              Konstrukcja.
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
