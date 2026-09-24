"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGsap, reducedMotion } from "@/lib/gsap";
import { SectionHead } from "./Section";
import { works } from "@/lib/content";

/**
 * Zakres prac.
 *
 * Jedna sekcja zamiast dwóch powtarzających się: lista po lewej, duży kadr po
 * prawej. Pozycję wybiera użytkownik kliknięciem, nic nie przewija się samo.
 *
 * Wysokość sekcji jest stała: kadr ma ustaloną proporcję, a blok opisu pod nim
 * ma minimalną wysokość, więc zmiana pozycji nie przesuwa strony.
 */
export function CoRobimy() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const caption = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const prev = useRef(0);

  /* Wejście sekcji. */
  useGsap(root, () => {
    gsap.fromTo(
      ".work-row",
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work-list", start: "top 85%" },
      },
    );

    gsap.fromTo(
      ".work-frame",
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".work-frame", start: "top 88%" },
      },
    );
  });

  /* Żółty wskaźnik jedzie do aktywnego wiersza. Jedyny właściciel jego
     `y` i `height`. */
  useEffect(() => {
    const move = (instant = false) => {
      const row = rows.current[active];
      const bar = indicator.current;
      const ol = list.current;
      if (!row || !bar || !ol) return;
      /* `ol` ma position: relative, więc jest offsetParentem wierszy i
         `offsetTop` liczy się już względem niego. */
      const y = row.offsetTop;
      const h = row.offsetHeight;
      if (instant || reducedMotion()) {
        gsap.set(bar, { y, height: h });
      } else {
        gsap.to(bar, { y, height: h, duration: 0.55, ease: "expo.out" });
      }
    };

    move();
    const ro = new ResizeObserver(() => move(true));
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [active]);

  /**
   * Telefon: aktywna pozycja idzie za scrollem.
   *
   * Kadr jest przyklejony pod nagłówkiem, więc szukamy wiersza, którego
   * środek jest najbliżej linii pod nim. Dzięki temu przewijanie listy samo
   * przełącza zdjęcia i nic nie trzeba klikać. Tapnięcie nadal działa —
   * po prostu trzyma się do następnego ruchu strony.
   *
   * Na desktopie nie robimy nic: tam wybór należy do kliknięcia.
   */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    const czytaj = () => {
      frame = 0;
      const sekcja = root.current;
      if (!sekcja) return;

      /* Poza ekranem nie ma czego synchronizować. */
      const r = sekcja.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      const linia = window.innerHeight * 0.68;
      let najlepszy = 0;
      let najblizej = Infinity;

      rows.current.forEach((row, i) => {
        if (!row) return;
        const b = row.getBoundingClientRect();
        const dystans = Math.abs(b.top + b.height / 2 - linia);
        if (dystans < najblizej) {
          najblizej = dystans;
          najlepszy = i;
        }
      });

      setActive((a) => (a === najlepszy ? a : najlepszy));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(czytaj);
    };

    const wlacz = () => {
      window.removeEventListener("scroll", onScroll);
      if (mq.matches) return;
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    wlacz();
    mq.addEventListener("change", wlacz);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", wlacz);
    };
  }, []);

  /* Podmiana kadru maską w bok. Właścicielem `clipPath` warstw jest tylko
     ten efekt. */
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
        { clipPath: "inset(0 0 0 0%)", duration: 1 },
        0,
      )
      .fromTo(
        inEl.querySelector(".work-img"),
        { scale: 1.12 },
        { scale: 1, duration: 1.35, ease: "expo.out" },
        0,
      )
      .to(
        outEl,
        { clipPath: forward ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", duration: 1 },
        0,
      );

    if (caption.current) {
      gsap.fromTo(
        caption.current.querySelectorAll(".work-cap"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, stagger: 0.05, ease: "expo.out" },
      );
    }
  }, [active]);

  const current = works[active];

  return (
    <section
      id="zakres"
      ref={root}
      className="gut scroll-mt-20 py-[clamp(4rem,7.5vw,6.25rem)]"
    >
      <SectionHead
        label="Zakres"
        lines={["Co robimy."]}
        lead={
          <>
            Zakres prac przy konkretnej inwestycji ustalamy przy wycenie.
            Zdjęcia pochodzą z różnych budów.
          </>
        }
      />

      <div className="mt-[clamp(2rem,4.5vw,3.25rem)] grid gap-x-8 gap-y-8 lg:grid-cols-12">
        {/* Kadr. Na telefonie stoi nad listą. */}
        <div
          className="sticky top-[76px] z-10 -mx-gutter bg-bone px-gutter pb-4 lg:static lg:z-auto lg:mx-0 lg:px-0 lg:pb-0 lg:col-span-7 lg:col-start-6 lg:row-start-1"
        >
          <div className="work-frame relative aspect-[16/10] w-full overflow-hidden bg-graphite sm:aspect-[4/3]">
            {works.map((w, i) => (
              <div
                key={w.no}
                ref={(el) => {
                  layers.current[i] = el;
                }}
                aria-hidden={i !== active}
                className="absolute inset-0"
                style={{
                  clipPath: i === 0 ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
                  zIndex: i === 0 ? 2 : 1,
                }}
              >
                <div className="work-img absolute inset-0">
                  <Image
                    src={w.photo.src}
                    alt={i === active ? w.photo.alt : ""}
                    fill
                    sizes="(min-width:1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}

            <span className="pointer-events-none absolute bottom-0 left-0 z-10 bg-yellow px-4 pt-1.5 pb-1 font-display text-[clamp(1.6rem,3.4vw,2.5rem)] leading-none font-extrabold tracking-[-0.05em] text-graphite tabular-nums">
              {current.no}
            </span>
          </div>

          {/* Stała wysokość, żeby zmiana opisu nie ruszała układu. */}
          <div
            ref={caption}
            className="mt-4 flex min-h-[3.25rem] flex-col gap-1 sm:min-h-[3rem]"
          >
            <span className="block overflow-hidden pb-0.5">
              <span className="work-cap block font-display text-[1.0625rem] font-extrabold tracking-[-0.02em] uppercase">
                {current.title}
              </span>
            </span>
            <span className="block overflow-hidden pb-0.5">
              <span className="work-cap block text-sm text-grey">
                {current.note}
              </span>
            </span>
          </div>
        </div>

        {/* Lista */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center">
          <ol ref={list} className="work-list relative">
            {/* Cienki żółty wskaźnik aktywnej pozycji. */}
            <span
              ref={indicator}
              aria-hidden="true"
              className="absolute top-0 left-0 z-10 w-[2px] bg-yellow"
            />

            {works.map((w, i) => {
              const on = i === active;
              return (
                <li
                  key={w.no}
                  ref={(el) => {
                    rows.current[i] = el;
                  }}
                  className="work-row anim-hide spine"
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on ? "true" : undefined}
                    className="group flex w-full items-baseline gap-4 py-[clamp(1.05rem,3.2vw,1.15rem)] pl-5 text-left sm:gap-6"
                  >
                    <span
                      className={[
                        "eyebrow shrink-0 tabular-nums transition-colors duration-300",
                        on ? "text-yellow" : "text-grey",
                      ].join(" ")}
                    >
                      {w.no}
                    </span>

                    <span
                      className={[
                        "font-display text-[clamp(1.2rem,2.6vw,1.9rem)] font-extrabold tracking-[-0.035em] uppercase transition-colors duration-300",
                        on
                          ? "text-graphite"
                          : "text-graphite/40 group-hover:text-graphite/75",
                      ].join(" ")}
                    >
                      {w.title}
                    </span>

                    <span
                      className={[
                        "ml-auto h-px shrink-0 self-center bg-graphite/30 transition-[width] duration-[600ms] ease-[var(--ease-out-quint)]",
                        on ? "w-0" : "w-0 group-hover:w-5",
                      ].join(" ")}
                    />
                  </button>
                </li>
              );
            })}
            <li className="spine" />
          </ol>
        </div>
      </div>
    </section>
  );
}
