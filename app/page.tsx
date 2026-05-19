"use client";

// app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Full layout shell.
// The 3D canvas will be inserted in Phase 3 where the placeholder sits.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Header,
  CategoryPanel,
  ItemCard,
  RentModal,
  SummaryBar,
  // SceneLoader,
} from "@/components/overlay/Index";

export default function HomePage() {
  return (
    // Root: full-screen, relative for absolute overlay children
    <main className="relative w-screen h-screen overflow-hidden bg-canvas">
      {/* ── Loading overlay (hides until scene is ready) ── */}
      {/* <SceneLoader /> */}

      {/* ── 3D Scene Canvas (Phase 3 — placeholder for now) ── */}
      <div className="absolute inset-0 z-0">
        {/*
          SceneCanvas will be inserted here in Phase 3.
          For Phase 2 verification, a warm gradient stands in.
        */}
        <div className="w-full h-full bg-linear-to-b from-[#F0EAD6] via-[#E8DFC8] to-[#DDD3B5] flex items-center justify-center">
          <div className="text-center select-none pointer-events-none">
            <p className="font-display text-6xl text-ink/10">3D</p>
            <p className="font-body text-sm text-ink/20 mt-2 tracking-widest uppercase">
              Scene Canvas — Phase 3
            </p>
          </div>
        </div>
      </div>

      {/* ── UI Overlay Layer (z-20, pointer-events managed per component) ── */}

      {/* Top-center: Headline */}
      <Header />

      {/* Left-center: Category tabs + item grid */}
      <CategoryPanel />

      {/* Bottom-right: Selected item detail card */}
      <ItemCard />

      {/* Bottom-center: Summary bar + rent CTA */}
      <SummaryBar />

      {/* Modal: Rent confirmation dialog */}
      <RentModal />
    </main>
  );
}
