"use client";

// ─────────────────────────────────────────────────────────────────────────────
// A single selectable item row inside the CategoryPanel grid.
// Shows icon, name, price, and a selected indicator.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { formatPrice, type ItemConfig } from "@/data/items";

interface ItemTileProps {
  item: ItemConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export function ItemTile({ item, isSelected, onSelect }: ItemTileProps) {
  const tileRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={tileRef}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        // Base
        "w-full text-left rounded-xl px-3 py-2.5 transition-all duration-200",
        "flex items-center gap-3 group relative overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
        // Default state
        "bg-white/40 hover:bg-white/70 border border-transparent",
        "hover:border-amber/20 hover:shadow-card",
        // Selected state
        isSelected && [
          "bg-white/90 border-amber/40 shadow-card",
          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.75",
          "before:bg-amber before:rounded-l-xl",
        ],
      )}
    >
      {/* Color swatch */}
      <span
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm"
        style={{
          backgroundColor: item.color + "22",
          border: `1.5px solid ${item.color}44`,
        }}
        aria-hidden
      >
        {item.icon}
      </span>

      {/* Text */}
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            "block font-body text-[12px] font-medium leading-tight truncate",
            isSelected ? "text-ink" : "text-ink-soft",
          )}
        >
          {item.name}
        </span>
        <span
          className={cn(
            "block font-mono text-[14px] mt-0.5",
            isSelected ? "text-ink font-semibold" : "text-ink-muted",
          )}
        >
          {formatPrice(item.pricePerWeek)}
          <span className="font-normal opacity-60">/week</span>
        </span>
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <span className="shrink-0 w-4 h-4 rounded-full bg-amber flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path
              d="M1.5 4L3.2 5.7L6.5 2.5"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
