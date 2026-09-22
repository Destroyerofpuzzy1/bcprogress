"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGsap } from "@/lib/gsap";
import { SectionHead } from "./Section";
import { Lightbox } from "./Lightbox";
import { projects, type Project } from "@/lib/content";

/** Rytm siatki — asymetryczny, budowany blokami, nie kafelkami. */
const layout = [
  { col: "lg:col-span-6", ratio: "aspect-[4/5]", push: "", size: "(min-width:1024px) 49vw, 100vw" },
  { col: "lg:col-span-4 lg:col-start-9", ratio: "aspect-[3/4]", push: "lg:mt-20", size: "(min-width:1024px) 33vw, 100vw" },
  { col: "lg:col-span-4", ratio: "aspect-[3/4]", push: "", size: "(min-width:1024px) 33vw, 100vw" },
  { col: "lg:col-span-4 lg:col-start-8", ratio: "aspect-[4/5]", push: "lg:mt-28", size: "(min-width:1024px) 33vw, 100vw" },
  { col: "lg:col-span-5 lg:col-start-2", ratio: "aspect-[4/5]", push: "", size: "(min-width:1024px) 41vw, 100vw" },
  { col: "lg:col-span-3 lg:col-start-10", ratio: "aspect-[3/4]", push: "lg:mt-24", size: "(min-width:1024px) 25vw, 100vw" },
  { col: "lg:col-span-7 lg:col-start-4", ratio: "aspect-[4/3]", push: "", size: "(min-width:1024px) 58vw, 100vw" },
];

const blocks = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6],
];

export function Realizacje() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="realizacje" className="gut scroll-mt-20 py-[clamp(4rem,7.5vw,6.25rem)]">
      <SectionHead
        label="Realizacje"
        lines={["Zobacz nasze", "realizacje."]}
        lead={
          <>
            Wybór budów z naszej dokumentacji. Kliknij, żeby zobaczyć
            więcej zdjęć z danej realizacji.
          </>
        }
      />

      <div className="mt-[clamp(2rem,4vw,3rem)] flex flex-col gap-[clamp(2rem,4.5vw,3.5rem)]">
        {blocks.map((block, bi) => (
          <div key={bi} className="grid gap-x-8 gap-y-[clamp(2rem,4.5vw,3.5rem)] lg:grid-cols-12">
            {block.map((idx) => (
              <Tile
                key={projects[idx].id}
                project={projects[idx]}
                index={idx}
                onOpen={() => setOpen(projects[idx])}
              />
            ))}
          </div>
        ))}
      </div>

      <Lightbox project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Tile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const cfg = layout[index];


  useGsap(root, () => {
    /* Odsłonięcie kadru maską — obraz wychodzi spod krawędzi. */
    gsap.fromTo(
      root.current!.querySelector(".tile-clip"),
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      },
    );
    gsap.fromTo(
      root.current!.querySelector(".tile-img"),
      { scale: 1.18 },
      {
        scale: 1,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      },
    );
    gsap.fromTo(
      root.current!.querySelectorAll(".tile-meta > *"),
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      },
    );

    /* Delikatna paralaksa wnętrza kadru — tylko na dużych ekranach. */
    ScrollParallax(root.current!);
  });

  return (
    <div ref={root} className={`${cfg.col} ${cfg.push}`}>
      <button
        type="button"
        onClick={onOpen}
        className="group block w-full cursor-pointer text-left"
      >
        <div className={`tile-clip relative overflow-hidden bg-bone-2 ${cfg.ratio}`}>
          {/* Dwie warstwy ruchu: GSAP posiada transform warstwy .tile-img
              (wejście + paralaksa), CSS posiada transform warstwy .tile-hover. */}
          <div className="tile-img absolute inset-x-0 -top-[5%] -bottom-[5%]">
            <div className="tile-hover absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.045]">
              <Image
                src={project.photos[0].src}
                alt={project.photos[0].alt}
                fill
                sizes={cfg.size}
                className="object-cover"
              />
            </div>
          </div>
          <span className="absolute right-0 bottom-0 flex h-12 w-12 items-center justify-center bg-yellow opacity-0 transition-opacity duration-400 group-hover:opacity-100">
            <svg viewBox="0 0 24 12" fill="none" className="w-5 text-graphite" aria-hidden="true">
              <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </div>

        <div className="tile-meta mt-4 flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3 className="hyphens-auto break-words text-[clamp(1.15rem,2.2vw,1.55rem)] tracking-[-0.03em]">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-grey">{project.type}</p>
            <span className="mt-3 block h-px w-0 bg-graphite transition-[width] duration-[700ms] ease-[var(--ease-out-quint)] group-hover:w-full" />
          </div>
          <span className="eyebrow shrink-0 pt-1.5 tabular-nums text-grey">
            {String(project.photos.length).padStart(2, "0")} zdj.
          </span>
        </div>
      </button>
    </div>
  );
}

/** Paralaksa obrazu wewnątrz kadru. Właścicielem `y` jest wyłącznie ta funkcja. */
function ScrollParallax(el: HTMLElement) {
  if (window.matchMedia("(max-width: 1023px)").matches) return;
  gsap.fromTo(
    el.querySelector(".tile-img"),
    { yPercent: -3.5 },
    {
      yPercent: 3.5,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}
