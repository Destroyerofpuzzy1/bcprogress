"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { nav } from "@/lib/content";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  /* Nagłówek zmienia stan w miejscu, w którym kończy się hero. */
  useEffect(() => {
    const end = document.getElementById("hero-end");
    let frame = 0;

    const read = () => {
      frame = 0;
      const limit = end
        ? end.getBoundingClientRect().top + window.scrollY - 80
        : window.innerHeight - 80;
      setSolid(window.scrollY > limit);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dark = solid || open;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        dark
          ? "border-b border-[var(--rule-dark)] bg-graphite"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "gut flex items-center justify-between transition-[height] duration-500",
          dark ? "h-[68px]" : "h-[88px]",
        ].join(" ")}
      >
        <a
          href="#gora"
          aria-label="BC PROGRES — strona główna"
          className="relative z-10 block"
          onClick={() => setOpen(false)}
        >
          <Logo
            tone="light"
            className={[
              "w-[168px] transition-[width] duration-500 sm:w-[196px]",
              dark ? "" : "sm:w-[214px]",
            ].join(" ")}
          />
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Główna">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-[13px] font-medium tracking-[0.14em] text-bone/85 uppercase transition-colors hover:text-bone"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-yellow transition-[width] duration-400 ease-[var(--ease-out-quint)] group-hover:w-full" />
            </a>
          ))}
          <a
            href="#kontakt"
            className="bg-yellow px-6 py-3.5 text-[12px] font-bold tracking-[0.16em] text-graphite uppercase transition-transform duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
          >
            Zapytaj o wycenę
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobilne"
          className="relative z-10 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
        >
          <span className="sr-only">{open ? "Zamknij menu" : "Otwórz menu"}</span>
          <span
            className={[
              "block h-[2px] w-7 bg-bone transition-transform duration-300",
              open ? "translate-y-[4.5px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "block h-[2px] w-7 bg-bone transition-transform duration-300",
              open ? "-translate-y-[4.5px] -rotate-45" : "",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Menu mobilne */}
      <div
        id="menu-mobilne"
        hidden={!open}
        className="gut fixed inset-0 top-[68px] z-40 flex flex-col justify-between bg-graphite pt-10 pb-10 lg:hidden"
      >
        <nav className="flex flex-col" aria-label="Mobilna">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="spine-dark flex items-baseline justify-between py-5 font-display text-[clamp(2rem,10vw,2.75rem)] font-extrabold tracking-[-0.03em] text-bone uppercase"
            >
              {item.label}
              <span className="eyebrow text-yellow">
                {String(i + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>
        <a
          href="#kontakt"
          onClick={() => setOpen(false)}
          className="mt-8 block bg-yellow px-6 py-5 text-center text-[13px] font-bold tracking-[0.16em] text-graphite uppercase"
        >
          Zapytaj o wycenę
        </a>
      </div>
    </header>
  );
}
