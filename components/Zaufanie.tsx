"use client";

import { useRef } from "react";
import { gsap, useGsap } from "@/lib/gsap";
import { SHOW_DEMO_REVIEWS, ocena } from "@/lib/content";

/**
 * Pasek zaufania pod hero.
 *
 * UWAGA: firma nie przekazała jeszcze zebranych opinii, więc ocena jest
 * materiałem poglądowym. Pasek chodzi pod tą samą flagą co sekcja opinii
 * (SHOW_DEMO_REVIEWS) i jest oznaczony jako demo — dzięki temu wyłączenie
 * flagi usuwa z serwisu wszystkie niepotwierdzone dane naraz.
 */
export function Zaufanie() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, () => {
    gsap.fromTo(
      ".zf-in",
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 92%" },
      },
    );
  });

  if (!SHOW_DEMO_REVIEWS) return null;

  return (
    <section ref={root} aria-label="Ocena klientów" className="bg-graphite text-bone">
      <div className="gut spine-dark border-t-0">
        <div className="flex flex-col gap-5 py-[clamp(1.5rem,3vw,2.25rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          {/* Ocena */}
          <div className="zf-in anim-hide flex items-center gap-4">
            <span className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-extrabold tracking-[-0.04em] text-yellow tabular-nums">
              {ocena.wartosc}
            </span>
            <span className="flex flex-col gap-1.5">
              <Gwiazdki ile={ocena.gwiazdki} />
              <span className="eyebrow text-bone/50">
                Ocena klientów {ocena.wartosc} / {ocena.max}
              </span>
            </span>
          </div>

          {/* Kreska rozdzielająca tylko na desktopie */}
          <span
            aria-hidden="true"
            className="hidden h-10 w-px shrink-0 bg-[var(--rule-dark)] lg:block"
          />

          <div className="zf-in anim-hide lg:flex-1">
            <p className="font-display text-[clamp(0.9375rem,1.6vw,1.125rem)] font-extrabold tracking-[-0.01em] uppercase">
              {ocena.naglowek}
            </p>
            <p className="mt-1.5 text-sm text-bone/55">{ocena.wsparcie}</p>
          </div>

          {/* Znacznik, że to jeszcze nie są zebrane opinie */}
          <p className="zf-in anim-hide inline-flex shrink-0 items-center gap-2.5 self-start border border-bone/20 px-3 py-2 lg:self-auto">
            <span className="block h-1.5 w-1.5 shrink-0 bg-yellow" aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-[0.18em] text-bone/45 uppercase">
              Dane poglądowe
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Gwiazdki({ ile }: { ile: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${ile} na 5 gwiazdek`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 19"
          className="w-3.5 shrink-0"
          aria-hidden="true"
          fill={i < ile ? "#FFD21C" : "none"}
          stroke={i < ile ? "none" : "currentColor"}
        >
          <path d="M10 0l2.9 6.3 6.8.8-5 4.7 1.3 6.8L10 15.3 3.9 18.6l1.4-6.8-5-4.7 6.8-.8z" />
        </svg>
      ))}
    </span>
  );
}
