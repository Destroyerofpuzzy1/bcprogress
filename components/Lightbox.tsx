"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/content";

export function Lightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => setI(0), [project]);

  const go = useCallback(
    (d: number) => {
      if (!project) return;
      setI((v) => (v + d + project.photos.length) % project.photos.length);
    },
    [project],
  );

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, go, onClose]);

  if (!project) return null;
  const photo = project.photos[i];

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        tabIndex={-1}
        className="gut flex items-start justify-between gap-6 py-6 outline-none"
      >
        <div>
          <p className="eyebrow text-yellow">{project.type}</p>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-bone uppercase">
            {project.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-bone/25 text-bone transition-colors hover:border-bone hover:bg-bone hover:text-graphite"
        >
          <span className="sr-only">Zamknij</span>
          <svg viewBox="0 0 16 16" className="w-4" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <div className="gut relative min-h-0 flex-1 pb-4">
        <div className="relative h-full w-full">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="animate-[lbin_.5s_var(--ease-out-quint)] object-contain"
          />
        </div>
      </div>

      <div className="gut spine-dark flex items-center justify-between py-5">
        <p className="max-w-[46ch] text-sm text-bone/60">{photo.alt}</p>
        <div className="flex shrink-0 items-center gap-5">
          <span className="eyebrow tabular-nums text-bone/60">
            {String(i + 1).padStart(2, "0")} / {String(project.photos.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <NavBtn onClick={() => go(-1)} label="Poprzednie zdjęcie" flip />
            <NavBtn onClick={() => go(1)} label="Następne zdjęcie" />
          </div>
        </div>
      </div>

      <style>{`@keyframes lbin { from { opacity: 0; transform: scale(1.015); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

function NavBtn({
  onClick,
  label,
  flip = false,
}: {
  onClick: () => void;
  label: string;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-12 items-center justify-center border border-bone/25 text-bone transition-colors hover:border-yellow hover:bg-yellow hover:text-graphite"
    >
      <span className="sr-only">{label}</span>
      <svg
        viewBox="0 0 24 12"
        fill="none"
        className={`w-5 ${flip ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </button>
  );
}
