"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGsap } from "@/lib/gsap";

/**
 * Oddech między zakresem prac a częścią o firmie.
 *
 * Samo zdjęcie, bez nagłówka i bez podpisu: zdjęcie ma tu pracować, a nie
 * ozdobne słowo.
 */
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
  });

  return (
    <section
      ref={root}
      aria-label="Zdjęcie z budowy"
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
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,14,0.55),rgba(14,15,14,0.05)_55%)]"
      />
    </section>
  );
}
