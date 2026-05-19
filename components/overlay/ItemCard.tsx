"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Floating card that appears (bottom-right) when an item is selected.
// Shows item name, tagline, features list, price, and the Rent Now CTA.
// Animated in/out via GSAP on visibility change.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/data/items";
import {
  useIsCardOpen,
  useCardItem,
  useCloseCard,
  useOpenRentModal,
} from "@/store/useConfigStore";
import { gsap } from "@/lib/gsap";

export function ItemCard() {
  const isOpen = useIsCardOpen();
  const item = useCardItem();
  const close = useCloseCard();
  const openRent = useOpenRentModal();
  const cardRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (!cardRef.current) return;

    if (isOpen && !prevOpenRef.current) {
      // Animate in
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "back.out(1.3)",
        },
      );
    } else if (!isOpen && prevOpenRef.current) {
      // Animate out
      gsap.to(cardRef.current, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    prevOpenRef.current = isOpen;
  }, [isOpen]);

  // Animate features list when item changes
  const featuresRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!featuresRef.current || !isOpen) return;
    const items = featuresRef.current.querySelectorAll("li");
    gsap.fromTo(
      items,
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: 0.22,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.15,
      },
    );
  }, [item?.id, isOpen]);

  if (!item) return null;

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute bottom-6 right-5 z-20 w-[clamp(240px,20vw,300px)]",
        "glass-panel rounded-2xl shadow-float overflow-hidden",
        !isOpen && "pointer-events-none",
      )}
      style={{ opacity: 0 }} // GSAP takes over
    >
      {/* Color accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: item.accentColor }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Icon swatch */}
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
              style={{
                backgroundColor: item.color + "22",
                border: `1.5px solid ${item.color}44`,
              }}
            >
              {item.icon}
            </span>
            <div>
              <h3 className="font-body text-[13px] font-semibold text-ink leading-tight">
                {item.name}
              </h3>
              <p className="font-body text-[11px] text-ink-muted leading-tight mt-0.5">
                {item.tagline}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={close}
            className="shrink-0 w-6 h-6 rounded-full bg-black/6 hover:bg-black/10 flex items-center justify-center transition-colors mt-0.5"
            aria-label="Close item card"
          >
            <X className="w-3 h-3 text-ink-muted" />
          </button>
        </div>

        {/* Description */}
        <p className="font-body text-[11.5px] text-ink-soft leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Features */}
        <ul ref={featuresRef} className="space-y-1.5 mb-4">
          {item.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 opacity-0">
              <span
                className="mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center"
                style={{ backgroundColor: item.accentColor + "28" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: item.accentColor }}
                />
              </span>
              <span className="font-body text-[11px] text-ink-soft leading-tight">
                {feat}
              </span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="border-t border-black/6 pt-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-body text-[10px] text-ink-muted uppercase tracking-wide">
              Per week
            </p>
            <p className="font-mono text-[17px] font-semibold text-ink leading-tight">
              {formatPrice(item.pricePerWeek)}
            </p>
          </div>

          <button
            onClick={openRent}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl",
              "font-body text-[12px] font-semibold text-ink",
              "transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]",
              "shadow-sm hover:shadow-md",
            )}
            style={{
              backgroundColor: item.accentColor,
            }}
          >
            <Sparkles className="w-3 h-3" />
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
}
