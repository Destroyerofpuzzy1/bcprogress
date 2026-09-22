"use client";

import { useRef, useState } from "react";
import { gsap, useGsap, LINE_FROM, LINE_TO } from "@/lib/gsap";
import { company } from "@/lib/content";

type State = "idle" | "sending" | "sent" | "not_configured" | "error";

export function Kontakt() {
  const root = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("idle");

  useGsap(root, () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: "top 72%" },
    });
    tl.fromTo(
      ".kon-line",
      LINE_FROM(),
      { ...LINE_TO(), duration: 1.3, stagger: 0.09, ease: "expo.out" },
    )
      .fromTo(
        ".kon-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "expo.out" },
        0.2,
      )
      .fromTo(
        ".kon-fade",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
        0.35,
      );
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imie: fd.get("imie"),
          telefon: fd.get("telefon"),
          rodzaj: fd.get("rodzaj"),
          wiadomosc: fd.get("wiadomosc"),
          zgoda: fd.get("zgoda") === "on",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setState("sent");
      else if (data?.code === "not_configured") setState("not_configured");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="kontakt" ref={root} className="scroll-mt-20 bg-ink text-bone">
      <div className="gut py-[clamp(4rem,7.5vw,6.25rem)]">
        <div className="kon-rule h-px origin-left bg-[var(--rule-dark)]" />

        <div className="pt-8">
          <p className="kon-fade anim-hide eyebrow text-yellow">Kontakt</p>
          <h2 className="mt-6 text-[clamp(2rem,5.6vw,4.5rem)] text-bone">
            <span className="line-mask">
              <span className="line-inner kon-line">Masz projekt?</span>
            </span>
            <span className="line-mask">
              <span className="line-inner kon-line">Porozmawiajmy.</span>
            </span>
          </h2>
        </div>

        <div className="mt-[clamp(2rem,4vw,3rem)] grid gap-x-8 gap-y-[clamp(2.25rem,5vw,3.5rem)] lg:grid-cols-12">
          {/* Dane */}
          <div className="lg:col-span-4">
            <div className="kon-fade anim-hide">
              <p className="eyebrow text-bone/45">Adres</p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed">
                {company.name}
                <br />
                {company.address.line1}
                <br />
                {company.address.line2}
              </p>
            </div>

            <div className="kon-fade anim-hide mt-8">
              <p className="eyebrow text-bone/45">Znajdź nas</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Social href={company.instagram} label="Instagram" />
                <Social href={company.facebook} label="Facebook" />
              </div>
            </div>

            <p className="kon-fade anim-hide mt-8 max-w-[40ch] text-sm leading-relaxed text-bone/50">
              Numeru telefonu i adresu e-mail nie publikujemy, dopóki nie
              potwierdzi ich firma.
            </p>
          </div>

          {/* Formularz */}
          <div className="kon-fade anim-hide lg:col-span-7 lg:col-start-6">
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <Field name="imie" label="Imię" required autoComplete="given-name" />
              <Field
                name="telefon"
                label="Telefon"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
              />
              <Field
                name="rodzaj"
                label="Rodzaj inwestycji"
                placeholder="np. dom jednorodzinny"
              />
              <Field name="wiadomosc" label="Wiadomość" textarea />

              <label className="mt-6 flex cursor-pointer items-start gap-4 text-sm leading-relaxed text-bone/65">
                <span className="relative mt-0.5 block h-5 w-5 shrink-0">
                  <input
                    type="checkbox"
                    name="zgoda"
                    required
                    className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none border border-bone/35 bg-transparent transition-colors checked:border-yellow checked:bg-yellow"
                  />
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0 peer-checked:opacity-100"
                  >
                    <path
                      d="M3.5 8.4l3 3 6-6.4"
                      stroke="#191A19"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </span>
                <span>
                  Zgadzam się na kontakt w sprawie mojego zapytania i znam{" "}
                  <a
                    href="/polityka-prywatnosci"
                    className="border-b border-bone/35 pb-0.5 transition-colors hover:border-yellow hover:text-yellow"
                  >
                    politykę prywatności
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={state === "sending"}
                className="group mt-7 inline-flex items-center justify-between gap-6 bg-yellow px-7 py-4 text-[12px] font-bold tracking-[0.16em] text-graphite uppercase transition-transform duration-400 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 disabled:opacity-60"
              >
                {state === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
                <svg
                  viewBox="0 0 24 12"
                  fill="none"
                  className="w-5 transition-transform duration-400 ease-[var(--ease-out-quint)] group-hover:translate-x-1.5"
                  aria-hidden="true"
                >
                  <path d="M0 6h22M17 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>

              <p aria-live="polite" className="mt-5 max-w-[52ch] text-sm leading-relaxed">
                {state === "idle" && (
                  <span className="text-bone/45">
                    Formularz czeka na podłączenie skrzynki e-mail firmy. Do tego
                    czasu najszybciej odpowiemy na Instagramie lub Facebooku.
                  </span>
                )}
                {state === "sent" && (
                  <span className="text-yellow">
                    Dziękujemy. Zapytanie zostało wysłane.
                  </span>
                )}
                {state === "not_configured" && (
                  <span className="text-yellow">
                    Skrzynka odbiorcza nie jest jeszcze podłączona, więc
                    wiadomość nie została wysłana. Napisz do nas na{" "}
                    <a
                      className="underline"
                      href={company.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagramie
                    </a>{" "}
                    lub{" "}
                    <a
                      className="underline"
                      href={company.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebooku
                    </a>
                    .
                  </span>
                )}
                {state === "error" && (
                  <span className="text-yellow">
                    Nie udało się wysłać wiadomości. Spróbuj ponownie albo napisz
                    do nas w social mediach.
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  textarea = false,
  ...rest
}: {
  name: string;
  label: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const cls =
    "peer w-full border-0 border-b border-bone/25 bg-transparent pt-6 pb-2.5 text-[1.0625rem] text-bone placeholder:text-bone/25 transition-colors focus:border-yellow focus:outline-none";
  return (
    <div className="relative">
      {/* Pole stoi w DOM przed etykietą, żeby `peer-focus` miało do czego się
          odnieść; etykieta jest pozycjonowana absolutnie nad polem. */}
      {textarea ? (
        <textarea id={name} name={name} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input id={name} name={name} className={cls} {...rest} />
      )}
      <label
        htmlFor={name}
        className="eyebrow absolute top-0 left-0 text-bone/45 transition-colors peer-focus:text-yellow"
      >
        {label}
        {rest.required ? <span className="ml-1 text-yellow">*</span> : null}
      </label>
    </div>
  );
}

function Social({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 border border-bone/25 px-5 py-3 text-[12px] font-semibold tracking-[0.14em] uppercase transition-colors hover:border-yellow hover:bg-yellow hover:text-graphite"
    >
      {label}
      <svg viewBox="0 0 12 12" className="w-2.5" fill="none" aria-hidden="true">
        <path d="M1 11L11 1M4 1h7v7" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </a>
  );
}
