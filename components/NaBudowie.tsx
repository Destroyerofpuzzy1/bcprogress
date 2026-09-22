"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, reducedMotion } from "@/lib/gsap";
import { SectionHead } from "./Section";
import { stages } from "@/lib/content";

export function NaBudowie() {
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const caption = useRef<HTMLDivElement>(null);

  /* Zmiana etapu: kadr wychodzi maską w bok, następny wchodzi z przeciwnej
     strony. Właścicielem `clipPath` warstw jest wyłącznie ten efekt. */
  useEffect(() => {
    const from = prev.current;
    const to = active;
    prev.current = to;
    if (from === to) return;

    const outEl = layers.current[from];
    const inEl = layers.current[to];
    if (!outEl || !inEl) return;

    if (reducedMotion()) {
      gsap.set(outEl, { clipPath: "inset(0 0 0 100%)", zIndex: 1 });
      gsap.set(inEl, { clipPath: "inset(0 0 0 0%)", zIndex: 2 });
      return;
    }

    const forward = to > from;
    gsap.set(inEl, { zIndex: 2 });
    gsap.set(outEl, { zIndex: 1 });

    gsap
      .timeline({ defaults: { ease: "expo.inOut" } })
      .fromTo(
        inEl,
        { clipPath: forward ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0 0 0%)", duration: 1.05 },
        0,
      )
      .fromTo(
        inEl.querySelector(".stage-img"),
        { scale: 1.14 },
        { scale: 1, duration: 1.4, ease: "expo.out" },
        0,
      )
      .to(outEl, { clipPath: forward ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", duration: 1.05 }, 0);

    gsap.fromTo(
      caption.current!.querySelectorAll(".stage-cap"),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
    );
  }, [active]);

  return (
    <section className="gut py-[clamp(4rem,7.5vw,6.25rem)]">
      <SectionHead
        label="Na budowie"
        lines={["Od fundamentów", "po dach."]}
        lead={
          <>
            Kolejne etapy robót. Zdjęcia pochodzą z różnych budów —
            nie z jednej inwestycji.
          </>
        }
      />

      <div className="mt-[clamp(2rem,4vw,3rem)] grid gap-x-8 gap-y-8 lg:grid-cols-12">
        {/* Panel */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite sm:aspect-[4/3]">
            {stages.map((s, i) => (
              <div
                key={s.no}
                ref={(el) => {
                  layers.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  clipPath: i === 0 ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
                  zIndex: i === 0 ? 2 : 1,
                }}
                aria-hidden={i !== active}
              >
                <div className="stage-img absolute inset-0">
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    sizes="(min-width:1024px) 49vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}

            {/* Numer etapu — sygnatura sekcji */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex items-end">
              <span className="bg-yellow px-4 pt-2 pb-1 font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-none font-extrabold tracking-[-0.05em] text-graphite tabular-nums">
                {stages[active].no}
              </span>
            </div>
          </div>

          <div ref={caption} className="mt-4 overflow-hidden">
            <span className="block overflow-hidden pb-1">
              <span className="stage-cap block text-sm text-grey">
                {stages[active].caption}
              </span>
            </span>
          </div>
        </div>

        {/* Lista etapów */}
        <div className="lg:col-span-4 lg:col-start-8 lg:self-center">
          <ol className="flex flex-col">
            {stages.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.no} className="spine">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on ? "step" : undefined}
                    className="group flex w-full items-baseline gap-5 py-4 text-left"
                  >
                    <span
                      className={[
                        "eyebrow w-7 shrink-0 tabular-nums transition-colors duration-300",
                        on ? "text-yellow" : "text-grey",
                      ].join(" ")}
                    >
                      {s.no}
                    </span>
                    <span
                      className={[
                        "font-display text-[clamp(1.35rem,3vw,1.9rem)] font-extrabold tracking-[-0.035em] uppercase transition-colors duration-300",
                        on ? "text-graphite" : "text-graphite/35 group-hover:text-graphite/70",
                      ].join(" ")}
                    >
                      {s.title}
                    </span>
                    <span
                      className={[
                        "ml-auto h-px shrink-0 self-center bg-yellow transition-[width] duration-[600ms] ease-[var(--ease-out-quint)]",
                        on ? "w-8" : "w-0 group-hover:w-4",
                      ].join(" ")}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="spine" />
        </div>
      </div>
    </section>
  );
}
