"use client";

// components/overlay/Header.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Top-center headline overlay. Floats above the 3D canvas.
// Uses stagger animation on mount via CSS animation-delay.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Header() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const els = wrapRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      els,
      { opacity: 0, y: -18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.3,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-8 pb-4 pointer-events-none select-none"
    >
      {/* Eyebrow label */}
      <span
        data-reveal
        className="opacity-0 inline-flex items-center gap-2 mb-3"
      >
        <span className="h-px w-8 bg-amber" />
        <span className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-amber">
          Office Rental Configurator
        </span>
        <span className="h-px w-8 bg-amber" />
      </span>

      {/* Main headline */}
      <h1
        data-reveal
        className="opacity-0 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-ink text-center"
      >
        Design Your <em className="not-italic text-amber">Workspace</em>
      </h1>

      {/* Subheadline */}
      <p
        data-reveal
        className="opacity-0 font-body text-[clamp(0.8rem,1.2vw,0.95rem)] text-ink-muted mt-2 text-center max-w-sm leading-relaxed"
      >
        Pick your desk, chair &amp; accessories — rent the full setup, weekly.
      </p>
    </div>
  );
}
