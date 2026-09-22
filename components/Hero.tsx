"use client";

import { useRef } from "react";
import { gsap, useGsap, LINE_FROM, LINE_TO } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoWrap = useRef<HTMLDivElement>(null);

  useGsap(root, () => {
    /* Wejście: kadr się otwiera, linie nagłówka wyjeżdżają spod maski. */
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(
      videoWrap.current,
      { scale: 1.12, filter: "brightness(0.55)" },
      { scale: 1, filter: "brightness(1)", duration: 2.2 },
    )
      .to(
        ".hero-eyebrow",
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        0.35,
      )
      .fromTo(
        ".hero-line",
        LINE_FROM(),
        { ...LINE_TO(), duration: 1.35, stagger: 0.11, ease: "expo.out" },
        0.45,
      )
      .to(
        ".hero-sub, .hero-cta, .hero-scroll",
        { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "power3.out" },
        0.95,
      );

    /* Delikatna paralaksa obrazu przy scrollu — jedyna rzecz, która rusza
       „yPercent" na tym elemencie. */
    gsap.to(videoWrap.current, {
      yPercent: 14,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <section
      id="gora"
      ref={root}
      className="relative isolate flex h-[100svh] min-h-[560px] flex-col justify-end overflow-hidden bg-graphite"
    >
      <div ref={videoWrap} className="absolute inset-0 -z-10 will-change-transform">
        <video
          className="h-full w-full scale-[1.06] object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/bc-progres/img/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source
            src="/assets/bc-progres/video/hero-854.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/assets/bc-progres/video/hero-1280.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient tylko tam, gdzie stoi tekst — budynek zostaje odsłonięty. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(14,15,14,0.92)_0%,rgba(14,15,14,0.62)_30%,rgba(14,15,14,0.12)_58%,rgba(14,15,14,0.35)_100%)]"
      />

      <div className="gut relative pb-[clamp(2.25rem,6vh,4rem)]">
        <p className="hero-eyebrow anim-hide eyebrow mb-6 translate-y-3 text-yellow">
          BC Progres <span className="mx-2 text-bone/40">/</span>
          <span className="text-bone/80">Firma budowlana</span>
        </p>

        <h1 className="text-bone">
          <span className="line-mask">
            <span className="line-inner hero-line text-[clamp(2.15rem,11.2vw,10rem)]">
              Budujemy.
            </span>
          </span>
          <span className="line-mask">
            <span className="line-inner hero-line text-[clamp(2.15rem,11.2vw,10rem)]">
              Od podstaw.
            </span>
          </span>
        </h1>

        <div className="mt-7 flex flex-col gap-7 sm:mt-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="hero-sub anim-hide max-w-[34ch] translate-y-3 text-[clamp(1rem,2.4vw,1.25rem)] leading-snug text-bone/85">
            Budowa domów i obiektów.
            <br />
            Ochotnica Dolna.
          </p>

          <div className="hero-cta anim-hide flex translate-y-3 flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#realizacje"
              className="group inline-flex items-center justify-between gap-6 bg-yellow px-7 py-4.5 text-[12px] font-bold tracking-[0.16em] text-graphite uppercase transition-transform duration-400 ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
            >
              Zobacz realizacje
              <Arrow className="w-5 transition-transform duration-400 ease-[var(--ease-out-quint)] group-hover:translate-x-1.5" />
            </a>
            <a
              href="#kontakt"
              className="group inline-flex items-center justify-between gap-6 border border-bone/35 px-7 py-4.5 text-[12px] font-bold tracking-[0.16em] text-bone uppercase transition-colors duration-400 hover:border-bone hover:bg-bone hover:text-graphite"
            >
              Zapytaj o wycenę
              <Arrow className="w-5 transition-transform duration-400 ease-[var(--ease-out-quint)] group-hover:translate-x-1.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="gut hero-scroll anim-hide relative translate-y-3 pb-6">
        <div className="spine-dark flex items-center gap-3 pt-5">
          <span className="relative block h-9 w-px overflow-hidden bg-bone/25">
            <span className="absolute inset-x-0 top-0 block h-3 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-yellow" />
          </span>
          <span className="eyebrow text-bone/55">Przewiń</span>
        </div>
      </div>

      <div id="hero-end" aria-hidden="true" className="absolute bottom-0 h-px w-full" />

      <style>{`
        @keyframes scrollcue {
          0%   { transform: translateY(-100%); }
          55%  { transform: translateY(300%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" fill="none" className={className} aria-hidden="true">
      <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
