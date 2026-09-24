"use client";

import { useEffect, useRef } from "react";
import { SectionHead } from "./Section";
import { SHOW_DEMO_REVIEWS, demoReviews, type DemoReview } from "@/lib/content";

/**
 * Opinie klientów — dwa ciągłe pasy jadące w przeciwne strony.
 *
 * Ruch robi jedna animacja CSS na transformie: bez rAF, bez scrollLeft,
 * bez nasłuchu wskaźnika, bez preventDefault. Karty nie przejmują
 * przewijania strony i nie zatrzymują się przy najechaniu ani kliknięciu.
 *
 * Sekcja pokazuje materiał poglądowy — patrz SHOW_DEMO_REVIEWS w lib/content.ts.
 */
export function Opinie() {
  if (!SHOW_DEMO_REVIEWS) return null;

  const half = Math.ceil(demoReviews.length / 2);

  return (
    <section
      aria-label="Opinie klientów"
      className="py-[clamp(4rem,7.5vw,6.25rem)]"
    >
      <div className="gut">
        <SectionHead
          label="Opinie"
          lines={["Co mówią klienci."]}
          lead={
            <>
              Poniżej przykładowe wpisy pokazujące układ sekcji. Prawdziwe
              opinie klientów pojawią się tu po ich zebraniu.
            </>
          }
        />

        <p className="mt-6 inline-flex items-center gap-3 bg-yellow px-4 py-2.5">
          <span className="block h-2 w-2 shrink-0 bg-graphite" aria-hidden="true" />
          <span className="eyebrow text-graphite">
            Przykładowe opinie (demo)
          </span>
        </p>
      </div>

      <div className="mt-[clamp(1.75rem,4vw,2.75rem)] flex flex-col gap-4">
        <Row items={demoReviews.slice(0, half)} direction="right" speed={25} />
        <Row items={demoReviews.slice(half)} direction="left" speed={30} />
      </div>
    </section>
  );
}

const COPIES = [0, 1, 2, 3];

function Row({
  items,
  direction,
  speed,
}: {
  items: DemoReview[];
  direction: "left" | "right";
  speed: number;
}) {
  const track = useRef<HTMLDivElement>(null);

  /* Dystans jednej pętli to 50% szerokości toru. Czas = dystans / prędkość,
     więc px/s trzyma się stałe niezależnie od szerokości ekranu. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const measure = () => {
      const distance = el.scrollWidth / 2;
      if (distance > 0) {
        el.style.setProperty("--marquee-duration", `${distance / speed}s`);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div
      className="marquee [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
    >
      <div ref={track} className="marquee-track" data-direction={direction}>
        {/* Cztery kopie, a przesunięcie wynosi 50% toru, czyli dokładnie dwie
            z nich. Dzięki temu nawet na bardzo szerokim ekranie w kadrze
            zawsze są karty — pętla nie odsłania pustego pasa. */}
        {COPIES.map((_, i) => (
          <Copy key={i} items={items} duplicate={i > 0} />
        ))}
      </div>
    </div>
  );
}

function Copy({
  items,
  duplicate = false,
}: {
  items: DemoReview[];
  duplicate?: boolean;
}) {
  return (
    <div
      className="marquee-copy flex shrink-0 gap-4 pr-4"
      data-copy={duplicate ? "duplicate" : "original"}
      /* Druga kopia istnieje tylko po to, żeby pętla była bezszwowa. */
      aria-hidden={duplicate || undefined}
    >
      {items.map((r, i) => (
        <Card key={`${r.label}-${i}`} review={r} />
      ))}
    </div>
  );
}

function Card({ review }: { review: DemoReview }) {
  return (
    <figure className="flex w-[clamp(14.5rem,68vw,20rem)] shrink-0 flex-col justify-between border border-[var(--rule)] bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="block h-2.5 w-2.5 shrink-0 bg-yellow" aria-hidden="true" />
        <figcaption className="eyebrow text-grey">{review.label}</figcaption>
      </div>
      <blockquote className="mt-5 text-[clamp(0.9375rem,1.5vw,1rem)] leading-relaxed text-graphite">
        {review.text}
      </blockquote>
    </figure>
  );
}
