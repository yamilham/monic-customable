"use client";

// ─────────────────────────────────────────────────────────────────────────────
// store/useConfigStore.ts
// Stable Zustand store for React 19 + Next.js 16
// Optimized for R3F / GSAP / MVP configurator architecture
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import {
  type ItemCategory,
  type ItemConfig,
  ALL_ITEMS,
  DEFAULT_SELECTIONS,
} from "@/data/items";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActiveTab = ItemCategory;

type SwapSignal = Record<ItemCategory, number>;

interface ConfigState {
  // ── Selected Items ───────────────────────────────────────────────────────
  selectedDesk: string;
  selectedChair: string;
  selectedAccessory: string;

  // ── UI State ─────────────────────────────────────────────────────────────
  activeTab: ActiveTab;

  isCardOpen: boolean;
  cardItem: ItemConfig | null;

  isRentModalOpen: boolean;

  isSceneReady: boolean;

  // ── Scene Animation Signal ───────────────────────────────────────────────
  swapSignal: SwapSignal;
}

interface ConfigActions {
  // ── Item Selection ───────────────────────────────────────────────────────
  selectItem: (category: ItemCategory, itemId: string) => void;

  // ── Tabs ─────────────────────────────────────────────────────────────────
  setActiveTab: (tab: ActiveTab) => void;

  // ── Card ─────────────────────────────────────────────────────────────────
  openCard: (item: ItemConfig) => void;
  closeCard: () => void;

  // ── Rent Modal ───────────────────────────────────────────────────────────
  openRentModal: () => void;
  closeRentModal: () => void;

  // ── Scene ────────────────────────────────────────────────────────────────
  setSceneReady: (ready: boolean) => void;
}

export type ConfigStore = ConfigState & ConfigActions;

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set) => ({
    // ───────────────────────────────────────────────────────────────────────
    // Initial Selection State
    // ───────────────────────────────────────────────────────────────────────

    selectedDesk: DEFAULT_SELECTIONS.desk,
    selectedChair: DEFAULT_SELECTIONS.chair,
    selectedAccessory: DEFAULT_SELECTIONS.accessory,

    // ───────────────────────────────────────────────────────────────────────
    // Initial UI State
    // ───────────────────────────────────────────────────────────────────────

    activeTab: "desk",

    isCardOpen: false,
    cardItem: null,

    isRentModalOpen: false,

    isSceneReady: false,

    swapSignal: {
      desk: 0,
      chair: 0,
      accessory: 0,
    },

    // ───────────────────────────────────────────────────────────────────────
    // Actions
    // ───────────────────────────────────────────────────────────────────────

    selectItem: (category, itemId) => {
      set((state) => {
        const selectionKey =
          category === "desk"
            ? "selectedDesk"
            : category === "chair"
            ? "selectedChair"
            : "selectedAccessory";

        // Prevent unnecessary updates
        if (state[selectionKey] === itemId) {
          return state;
        }

        const item = ALL_ITEMS.find((i) => i.id === itemId);

        return {
          [selectionKey]: itemId,

          // Trigger scene swap animation
          swapSignal: {
            ...state.swapSignal,
            [category]: state.swapSignal[category] + 1,
          },

          // Auto open detail card
          isCardOpen: true,

          // Update card item
          cardItem: item ?? null,
        };
      });
    },

    // ───────────────────────────────────────────────────────────────────────
    // UI Actions
    // ───────────────────────────────────────────────────────────────────────

    setActiveTab: (tab) => {
      set({
        activeTab: tab,
      });
    },

    openCard: (item) => {
      set({
        isCardOpen: true,
        cardItem: item,
      });
    },

    closeCard: () => {
      set({
        isCardOpen: false,
      });
    },

    openRentModal: () => {
      set({
        isRentModalOpen: true,
      });
    },

    closeRentModal: () => {
      set({
        isRentModalOpen: false,
      });
    },

    setSceneReady: (ready) => {
      set({
        isSceneReady: ready,
      });
    },
  }))
);

// ─────────────────────────────────────────────────────────────────────────────
// Primitive Selectors (React 19 Safe)
// NEVER return objects or arrays here
// ─────────────────────────────────────────────────────────────────────────────

// ── Selected Items ──────────────────────────────────────────────────────────

export const useSelectedDesk = () =>
  useConfigStore((s) => s.selectedDesk);

export const useSelectedChair = () =>
  useConfigStore((s) => s.selectedChair);

export const useSelectedAccessory = () =>
  useConfigStore((s) => s.selectedAccessory);

// ── Active Tab ──────────────────────────────────────────────────────────────

export const useActiveTab = () =>
  useConfigStore((s) => s.activeTab);

// ── Card State ──────────────────────────────────────────────────────────────

export const useIsCardOpen = () =>
  useConfigStore((s) => s.isCardOpen);

export const useCardItem = () =>
  useConfigStore((s) => s.cardItem);

// ── Rent Modal ──────────────────────────────────────────────────────────────

export const useIsRentModalOpen = () =>
  useConfigStore((s) => s.isRentModalOpen);

// ── Scene ───────────────────────────────────────────────────────────────────

export const useSceneReady = () =>
  useConfigStore((s) => s.isSceneReady);

// ── Actions ────────────────────────────────────────────────────────────────

export const useSelectItem = () =>
  useConfigStore((s) => s.selectItem);

export const useSetActiveTab = () =>
  useConfigStore((s) => s.setActiveTab);

export const useOpenCard = () =>
  useConfigStore((s) => s.openCard);

export const useCloseCard = () =>
  useConfigStore((s) => s.closeCard);

export const useOpenRentModal = () =>
  useConfigStore((s) => s.openRentModal);

export const useCloseRentModal = () =>
  useConfigStore((s) => s.closeRentModal);

export const useSetSceneReady = () =>
  useConfigStore((s) => s.setSceneReady);

// ── Swap Signal ─────────────────────────────────────────────────────────────

export const useSwapSignal = (category: ItemCategory) =>
  useConfigStore((s) => s.swapSignal[category]);