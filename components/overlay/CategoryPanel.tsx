"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Left-side overlay panel with Desk / Chair / Accessories tabs.
// Each tab shows a grid of selectable ItemTile components.
// Wired to Zustand store for selection state.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ItemTile } from "@/components/overlay/ItemTile";
import { useConfigStore } from "@/store/useConfigStore";
import { DESKS, CHAIRS, ACCESSORIES, type ItemCategory } from "@/data/items";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const TABS: { value: ItemCategory; label: string; emoji: string }[] = [
  { value: "desk", label: "Desks", emoji: "🪵" },
  { value: "chair", label: "Chairs", emoji: "🪑" },
  { value: "accessory", label: "Accessories", emoji: "⌨️" },
];

export function CategoryPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    activeTab,
    setActiveTab,
    selectedDesk,
    selectedChair,
    selectedAccessory,
    selectItem,
  } = useConfigStore();

  // Slide-in on mount
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, x: -32 },
      { opacity: 1, x: 0, duration: 0.55, delay: 0.5, ease: "power3.out" },
    );
  }, []);

  const selectedId =
    activeTab === "desk"
      ? selectedDesk
      : activeTab === "chair"
        ? selectedChair
        : selectedAccessory;

  const items =
    activeTab === "desk" ? DESKS : activeTab === "chair" ? CHAIRS : ACCESSORIES;

  return (
    <div
      ref={panelRef}
      className="absolute left-5 top-1/2 -translate-y-1/2 z-20 opacity-0"
      style={{ width: "clamp(220px, 18vw, 280px)" }}
    >
      <div className="glass-panel rounded-2xl shadow-panel overflow-hidden">
        {/* Panel header */}
        <div className="px-4 pt-4 pb-2 border-b border-white/40">
          <p className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-muted">
            Configure
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ItemCategory)}
          className="w-full"
        >
          {/* Tab triggers */}
          <TabsList className="w-full rounded-none bg-transparent border-b border-white/40 h-auto p-0 flex">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-none",
                  "font-body text-[10px] font-medium tracking-wide text-ink-muted",
                  "border-b-2 border-transparent transition-all duration-200",
                  "data-[state=active]:border-slate data-[state=active]:text-ink",
                  "data-[state=active]:bg-slate/5 data-[state=active]:shadow-none",
                  "hover:text-ink hover:bg-black/3",
                )}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab content — each renders the same ItemGrid pattern */}
          {TABS.map((tab) => {
            const tabItems =
              tab.value === "desk"
                ? DESKS
                : tab.value === "chair"
                  ? CHAIRS
                  : ACCESSORIES;
            const tabSelected =
              tab.value === "desk"
                ? selectedDesk
                : tab.value === "chair"
                  ? selectedChair
                  : selectedAccessory;

            return (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="mt-0 p-3"
              >
                <ItemGrid
                  items={tabItems}
                  selectedId={tabSelected}
                  category={tab.value}
                  onSelect={(id) => selectItem(tab.value, id)}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

// ─── ItemGrid ─────────────────────────────────────────────────────────────────

import type { ItemConfig } from "@/data/items";

function ItemGrid({
  items,
  selectedId,
  category,
  onSelect,
}: {
  items: ItemConfig[];
  selectedId: string;
  category: ItemCategory;
  onSelect: (id: string) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger items in when tab changes
  useEffect(() => {
    if (!gridRef.current) return;
    const tiles = gridRef.current.querySelectorAll("[data-tile]");
    gsap.fromTo(
      tiles,
      { opacity: 0, y: 8, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.out",
      },
    );
  }, [category]);

  return (
    <div ref={gridRef} className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} data-tile>
          <ItemTile
            item={item}
            isSelected={item.id === selectedId}
            onSelect={() => onSelect(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
