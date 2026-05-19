"use client";

// components/scene/useMeshSwap.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared hook used by DeskObject, ChairObject, AccessoryObject.
// Watches the Zustand swapSignal for a category and triggers the
// GSAP scale-out → swap geometry → scale-in animation sequence.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import type { Group } from "three";
import { animateObjectIn, animateSwap } from "@/lib/gsap";
import { useSwapSignal } from "@/store/useConfigStore";
import type { ItemCategory } from "@/data/items";

interface UseMeshSwapOptions {
  category: ItemCategory;
  /** Called at the invisible midpoint — update geometry/color here */
  onSwap: () => void;
}

export function useMeshSwap(
  groupRef: React.RefObject<Group | null>,
  { category, onSwap }: UseMeshSwapOptions,
) {
  const swapSignal = useSwapSignal(category);
  const isFirstRender = useRef(true);

  // Initial entrance animation
  useEffect(() => {
    if (!groupRef.current) return;
    animateObjectIn(groupRef.current, { delay: 0.1 + Math.random() * 0.2 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Swap animation on selection change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!groupRef.current) return;
    animateSwap(groupRef.current, onSwap);
  }, [swapSignal]); // eslint-disable-line react-hooks/exhaustive-deps
}
