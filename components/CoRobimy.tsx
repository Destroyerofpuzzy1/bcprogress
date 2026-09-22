"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGsap } from "@/lib/gsap";
import { SectionHead } from "./Section";
import { services } from "@/lib/content";

/**
 * Zakres prac.
 *
 * Zdjęcie danej pozycji pojawia się w stałym kadrze obok listy — kadr nie
 * podąża za kursorem i nie nasłuchuje ruchu myszy. Na wskaźniku precyzyjnym
 * wybór zmienia najechanie lub fokus klawiaturą, na dotyku — tapnięcie,
 * które rozwija zdjęcie pod pozycją.
 */
export function CoRobimy() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useGsap(root, () => {
    gsap.fromTo(
      ".svc-row",
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: ".svc-list", start: "top 85%" },
      },
    );

    gsap.fromTo(
      ".svc-frame",
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".svc-list", start: "top 85%" },
      },
    );
  });

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
            Zakres prac przy konkretnej inwestycji ustalamy i potwierdzamy na
            etapie wyceny.
          </>
        }
      />

      <div className="mt-[clamp(2rem,4.5vw,3.25rem)] grid gap-x-8 lg:grid-cols-12">
        {/* Lista */}
        <ol className="svc-list lg:col-span-7">
          {services.map((s, i) => {
            const open = openIdx === i;
            return (
              <li key={s.title} className="svc-row anim-hide spine">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => {
                    setActive(i);
                    setOpenIdx(open ? null : i);
                  }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid w-full grid-cols-[auto_1fr] items-baseline gap-x-5 py-[clamp(1.1rem,2.2vw,1.6rem)] text-left sm:gap-x-8"
                >
                  <span
                    className={[
                      "eyebrow pt-1.5 tabular-nums transition-colors duration-300 sm:pt-2",
                      active === i ? "text-yellow" : "text-grey",
                    ].join(" ")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3
                    className={[
                      "text-[clamp(1.5rem,4vw,2.6rem)] transition-[color,transform] duration-[600ms] ease-[var(--ease-out-quint)] group-hover:text-graphite sm:group-hover:translate-x-3",
                      active === i ? "text-graphite" : "text-graphite/45",
                    ].join(" ")}
                  >
                    {s.title}
                  </h3>

                  <p className="col-start-2 mt-2 text-sm text-grey">
                    {s.note}
                  </p>

                  {/* Dotyk: zdjęcie rozwija się pod pozycją. */}
                  <span
                    className="col-span-full grid transition-[grid-template-rows] duration-[700ms] ease-[var(--ease-out-quint)] lg:hidden"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <span className="block overflow-hidden">
                      <span className="relative mt-4 block aspect-[16/10] w-full overflow-hidden bg-bone-2">
                        <Image
                          src={s.photo.src}
                          alt={s.photo.alt}
                          fill
                          sizes="(min-width:640px) 640px, 100vw"
                          className="object-cover"
                        />
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="spine" />
        </ol>

        {/* Stały kadr — zmienia się tylko zawartość, nigdy pozycja. */}
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block lg:self-center">
          <div className="svc-frame relative aspect-[4/5] w-full overflow-hidden bg-bone-2">
            {services.map((s, i) => (
              <div
                key={s.title}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-opacity duration-[600ms] ease-[var(--ease-out-quint)]"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <Image
                  src={s.photo.src}
                  alt={i === active ? s.photo.alt : ""}
                  fill
                  sizes="(min-width:1024px) 33vw, 0px"
                  className="object-cover"
                />
              </div>
            ))}
            <span className="absolute bottom-0 left-0 bg-yellow px-4 py-2 eyebrow text-graphite tabular-nums">
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          <p className="mt-4 text-sm text-grey">{services[active].photo.alt}</p>
        </div>
      </div>
    </section>
  );
}
