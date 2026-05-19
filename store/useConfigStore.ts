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
  selectedDesk: string;
  selectedChair: string;
  selectedAccessory: string;
  activeTab: ActiveTab;
  isCardOpen: boolean;
  cardItem: ItemConfig | null;
  isRentModalOpen: boolean;
  isSceneReady: boolean;
  swapSignal: SwapSignal;
}

interface ConfigActions {
  selectItem: (category: ItemCategory, itemId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  openCard: (item: ItemConfig) => void;
  closeCard: () => void;
  openRentModal: () => void;
  closeRentModal: () => void;
  setSceneReady: (ready: boolean) => void;
}

export type ConfigStore = ConfigState & ConfigActions;

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set) => ({
    selectedDesk:      DEFAULT_SELECTIONS.desk,
    selectedChair:     DEFAULT_SELECTIONS.chair,
    selectedAccessory: DEFAULT_SELECTIONS.accessory,
    activeTab:         "desk",
    isCardOpen:        false,
    cardItem:          null,
    isRentModalOpen:   false,
    isSceneReady:      false,
    swapSignal:        { desk: 0, chair: 0, accessory: 0 },

    selectItem: (category, itemId) => {
      set((state) => {
        const selectionKey =
          category === "desk"      ? "selectedDesk"
          : category === "chair"   ? "selectedChair"
          :                          "selectedAccessory";

        if (state[selectionKey] === itemId) return state;

        const item = ALL_ITEMS.find((i) => i.id === itemId);
        return {
          [selectionKey]: itemId,
          swapSignal: { ...state.swapSignal, [category]: state.swapSignal[category] + 1 },
          isCardOpen: true,
          cardItem: item ?? null,
        };
      });
    },

    setActiveTab:   (tab)   => set({ activeTab: tab }),
    openCard:       (item)  => set({ isCardOpen: true, cardItem: item }),
    closeCard:      ()      => set({ isCardOpen: false }),
    openRentModal:  ()      => set({ isRentModalOpen: true }),
    closeRentModal: ()      => set({ isRentModalOpen: false }),
    setSceneReady:  (ready) => set({ isSceneReady: ready }),
  }))
);

// ─────────────────────────────────────────────────────────────────────────────
// Primitive Selectors — never return objects or arrays (React 19 safe)
// ─────────────────────────────────────────────────────────────────────────────

export const useSelectedDesk      = () => useConfigStore((s) => s.selectedDesk);
export const useSelectedChair     = () => useConfigStore((s) => s.selectedChair);
export const useSelectedAccessory = () => useConfigStore((s) => s.selectedAccessory);

export const useActiveTab         = () => useConfigStore((s) => s.activeTab);

export const useIsCardOpen        = () => useConfigStore((s) => s.isCardOpen);
export const useCardItem          = () => useConfigStore((s) => s.cardItem);

export const useIsRentModalOpen   = () => useConfigStore((s) => s.isRentModalOpen);

// boolean — NOT an object
export const useSceneReady        = () => useConfigStore((s) => s.isSceneReady);

// actions — stable function refs, never cause re-renders
export const useSelectItem        = () => useConfigStore((s) => s.selectItem);
export const useSetActiveTab      = () => useConfigStore((s) => s.setActiveTab);
export const useOpenCard          = () => useConfigStore((s) => s.openCard);
export const useCloseCard         = () => useConfigStore((s) => s.closeCard);
export const useOpenRentModal     = () => useConfigStore((s) => s.openRentModal);
export const useCloseRentModal    = () => useConfigStore((s) => s.closeRentModal);
export const useSetSceneReady     = () => useConfigStore((s) => s.setSceneReady);

export const useSwapSignal = (category: ItemCategory) =>
  useConfigStore((s) => s.swapSignal[category]);