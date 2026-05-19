"use client";

// components/overlay/SummaryBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Floating bottom-center bar showing all 3 current selections + total price.
// Matches the sketch's "Ready to Rent?" zone.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useConfigStore } from "@/store/useConfigStore";
import { ALL_ITEMS, formatPrice } from "@/data/items";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";

export function SummaryBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const {
    selectedDesk,
    selectedChair,
    selectedAccessory,
    getTotalWeeklyPrice,
    openRentModal,
  } = useConfigStore();

  const desk = ALL_ITEMS.find((i) => i.id === selectedDesk);
  const chair = ALL_ITEMS.find((i) => i.id === selectedChair);
  const acc = ALL_ITEMS.find((i) => i.id === selectedAccessory);
  const total = getTotalWeeklyPrice();

  // Slide up on mount
  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.8, ease: "power3.out" },
    );
  }, []);

  return (
    <div
      ref={barRef}
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 opacity-0"
    >
      <div className="glass-panel rounded-2xl shadow-float px-4 py-3 flex items-center gap-3">
        {/* Selection pills */}
        <div className="flex items-center gap-2">
          {[desk, chair, acc].map((item) =>
            item ? (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/60 border border-white/70"
              >
                <span className="text-sm leading-none">{item.icon}</span>
                <span className="font-body text-[11px] text-ink-soft font-medium max-w-[80px] truncate hidden sm:block">
                  {item.name.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            ) : null,
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-black/10" />

        {/* Total */}
        <div className="flex flex-col items-end">
          <span className="font-body text-[9px] uppercase tracking-widest text-ink-muted">
            /week
          </span>
          <span className="font-mono text-[15px] font-bold text-ink leading-none">
            {formatPrice(total)}
          </span>
        </div>

        {/* Rent CTA */}
        <button
          onClick={openRentModal}
          className={cn(
            "flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-xl ml-1",
            "bg-ink text-canvas font-body text-[12px] font-semibold",
            "hover:bg-ink-soft transition-all duration-200",
            "hover:scale-[1.03] active:scale-[0.97] shadow-sm",
          )}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Rent Setup
        </button>
      </div>
    </div>
  );
}
