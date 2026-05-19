"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation modal that shows the full order summary (desk + chair + accessory)
// with total weekly price and a final "Confirm Rental" CTA.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useMemo } from "react";
import { CheckCircle2, ShoppingBag, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useIsRentModalOpen,
  useCloseRentModal,
  useSelectedDesk,
  useSelectedChair,
  useSelectedAccessory,
} from "@/store/useConfigStore";
import { ALL_ITEMS, getTotalPrice, formatPrice } from "@/data/items";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";

export function RentModal() {
  const isOpen = useIsRentModalOpen();
  const close = useCloseRentModal();

  const selectedDesk = useSelectedDesk();
  const selectedChair = useSelectedChair();
  const selectedAccessory = useSelectedAccessory();
  const confirmedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedIds = useMemo(() => {
    return [selectedDesk, selectedChair, selectedAccessory];
  }, [selectedDesk, selectedChair, selectedAccessory]);

  const totalPrice = useMemo(() => {
    return getTotalPrice(selectedIds);
  }, [selectedIds]);

  const selectedItems = useMemo(() => {
    return selectedIds
      .map((id) => ALL_ITEMS.find((i) => i.id === id))
      .filter(Boolean);
  }, [selectedIds]);

  // Stagger order rows on open
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const rows = contentRef.current.querySelectorAll("[data-row]");
    gsap.fromTo(
      rows,
      { opacity: 0, x: -12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.28,
        stagger: 0.07,
        delay: 0.1,
        ease: "power2.out",
      },
    );
  }, [isOpen]);

  const handleConfirm = () => {
    confirmedRef.current = true;
    close();
    // In a real app: trigger booking API here
    // For MVP: just close
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        className={cn(
          "glass-panel border-none shadow-float rounded-2xl p-0 overflow-hidden",
          "max-w-md w-[calc(100vw-2rem)]",
        )}
      >
        {/* Accent header bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-dark via-amber to-amber-light" />

        <div className="p-6" ref={contentRef}>
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-dark" />
              </span>
              <div>
                <DialogTitle className="font-display text-xl text-ink leading-tight">
                  Confirm Your Setup
                </DialogTitle>
                <DialogDescription className="font-body text-xs text-ink-muted mt-0.5">
                  Review your weekly rental before confirming
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Order rows */}
          <div className="space-y-2 mb-5">
            {selectedItems.map((item) =>
              item ? (
                <div
                  key={item.id}
                  data-row
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/60"
                >
                  {/* Swatch */}
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{
                      backgroundColor: item.color + "22",
                      border: `1.5px solid ${item.color}44`,
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[12.5px] font-medium text-ink truncate">
                      {item.name}
                    </p>
                    <p className="font-body text-[11px] text-ink-muted capitalize">
                      {item.category}
                    </p>
                  </div>

                  {/* Price */}
                  <span className="font-mono text-[12px] font-semibold text-ink shrink-0">
                    {formatPrice(item.pricePerWeek)}
                  </span>
                </div>
              ) : null,
            )}
          </div>

          {/* Rental period note */}
          <div
            data-row
            className="flex items-center gap-2.5 p-3 rounded-xl bg-amber/8 border border-amber/20 mb-5"
          >
            <CalendarDays className="w-4 h-4 text-amber-dark shrink-0" />
            <p className="font-body text-[11.5px] text-ink-soft">
              Minimum rental period <strong className="text-ink">1 week</strong>
              . Free pickup &amp; delivery included.
            </p>
          </div>

          {/* Total + CTA */}
          <div className="border-t border-black/[0.07] pt-4 flex items-center justify-between">
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-ink-muted">
                Total / week
              </p>
              <p className="font-mono text-2xl font-bold text-ink leading-tight">
                {formatPrice(totalPrice)}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl",
                "bg-amber hover:bg-amber-dark text-ink font-body text-[13px] font-semibold",
                "transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
                "shadow-md hover:shadow-lg",
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Rental
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
