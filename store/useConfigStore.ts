// ─────────────────────────────────────────────────────────────────────────────
// store/useConfigStore.ts
// Global state for Monis configurator.
// Consumed by both UI overlay components and the Three.js scene.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  type ItemCategory,
  type ItemConfig,
  ALL_ITEMS,
  DEFAULT_SELECTIONS,
  getTotalPrice,
} from "@/data/items";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActiveTab = ItemCategory;

export interface SelectionState {
  /** ID of currently selected desk */
  selectedDesk: string;
  /** ID of currently selected chair */
  selectedChair: string;
  /** ID of currently selected accessory */
  selectedAccessory: string;
}

export interface UIState {
  /** Which tab is open in the category panel */
  activeTab: ActiveTab;
  /** Whether the item detail card is visible */
  isCardOpen: boolean;
  /** The item currently shown in the detail card */
  cardItem: ItemConfig | null;
  /** Whether the Rent confirmation modal is open */
  isRentModalOpen: boolean;
  /** Whether the scene has finished initial load */
  isSceneReady: boolean;
  /**
   * Signal for the 3D scene to trigger a swap animation.
   * Increments each time a new item is selected for a category.
   */
  swapSignal: Record<ItemCategory, number>;
}

export interface ConfigStore extends SelectionState, UIState {
  // ── Selection actions ────────────────────────────────────────────────────
  selectItem: (category: ItemCategory, itemId: string) => void;

  // ── UI actions ───────────────────────────────────────────────────────────
  setActiveTab: (tab: ActiveTab) => void;
  openCard: (item: ItemConfig) => void;
  closeCard: () => void;
  openRentModal: () => void;
  closeRentModal: () => void;
  setSceneReady: (ready: boolean) => void;

  // ── Derived getters ──────────────────────────────────────────────────────
  getSelectedItem: (category: ItemCategory) => ItemConfig | undefined;
  getSelectedIds: () => string[];
  getTotalWeeklyPrice: () => number;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial selection state ─────────────────────────────────────────────
    selectedDesk: DEFAULT_SELECTIONS.desk,
    selectedChair: DEFAULT_SELECTIONS.chair,
    selectedAccessory: DEFAULT_SELECTIONS.accessory,

    // ── Initial UI state ────────────────────────────────────────────────────
    activeTab: "desk",
    isCardOpen: false,
    cardItem: null,
    isRentModalOpen: false,
    isSceneReady: false,
    swapSignal: { desk: 0, chair: 0, accessory: 0 },

    // ── Selection actions ───────────────────────────────────────────────────
    selectItem: (category, itemId) => {
      set((state) => {
        const key =
          category === "desk"
            ? "selectedDesk"
            : category === "chair"
            ? "selectedChair"
            : "selectedAccessory";

        // Don't re-trigger if already selected
        if (state[key] === itemId) return {};

        const item = ALL_ITEMS.find((i) => i.id === itemId);

        return {
          [key]: itemId,
          // Bump swap signal so scene can react
          swapSignal: {
            ...state.swapSignal,
            [category]: state.swapSignal[category] + 1,
          },
          // Auto-open card when item is selected
          isCardOpen: true,
          cardItem: item ?? state.cardItem,
        };
      });
    },

    // ── UI actions ──────────────────────────────────────────────────────────
    setActiveTab: (tab) => set({ activeTab: tab }),

    openCard: (item) => set({ isCardOpen: true, cardItem: item }),

    closeCard: () => set({ isCardOpen: false }),

    openRentModal: () => set({ isRentModalOpen: true }),

    closeRentModal: () => set({ isRentModalOpen: false }),

    setSceneReady: (ready) => set({ isSceneReady: ready }),

    // ── Derived getters ─────────────────────────────────────────────────────
    getSelectedItem: (category) => {
      const state = get();
      const id =
        category === "desk"
          ? state.selectedDesk
          : category === "chair"
          ? state.selectedChair
          : state.selectedAccessory;
      return ALL_ITEMS.find((i) => i.id === id);
    },

    getSelectedIds: () => {
      const { selectedDesk, selectedChair, selectedAccessory } = get();
      return [selectedDesk, selectedChair, selectedAccessory];
    },

    getTotalWeeklyPrice: () => {
      return getTotalPrice(get().getSelectedIds());
    },
  }))
);

// ─── Convenience selector hooks ───────────────────────────────────────────────
// These narrow the subscription to prevent unnecessary re-renders.

export const useSelectedItem = (category: ItemCategory) =>
  useConfigStore((s) => s.getSelectedItem(category));

export const useActiveTab = () => useConfigStore((s) => s.activeTab);

export const useCardState = () =>
  useConfigStore((s) => ({
    isOpen: s.isCardOpen,
    item: s.cardItem,
    close: s.closeCard,
    openRent: s.openRentModal,
  }));

export const useRentModal = () =>
  useConfigStore((s) => ({
    isOpen: s.isRentModalOpen,
    close: s.closeRentModal,
    totalPrice: s.getTotalWeeklyPrice(),
    selectedIds: s.getSelectedIds(),
  }));

export const useSwapSignal = (category: ItemCategory) =>
  useConfigStore((s) => s.swapSignal[category]);

export const useSceneReady = () =>
  useConfigStore((s) => ({
    isReady: s.isSceneReady,
    setReady: s.setSceneReady,
  }));