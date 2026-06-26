"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ShopFilters } from "@/types";
import ShopFiltersPanel from "@/components/shop/ShopFiltersPanel";

interface ShopFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ShopFilters;
  draftFilters: ShopFilters;
  categories: string[];
  priceRange: { min: number; max: number };
  onDraftChange: (filters: ShopFilters) => void;
  onApply: () => void;
  onClear: () => void;
  activeCount: number;
}

export default function ShopFilterDrawer({
  open,
  onClose,
  draftFilters,
  categories,
  priceRange,
  onDraftChange,
  onApply,
  onClear,
  activeCount,
}: ShopFilterDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-[66] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl lg:hidden"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="luxury-label mb-0.5">Filters</p>
                <p className="text-sm text-muted">
                  {activeCount > 0
                    ? `${activeCount} active filter${activeCount !== 1 ? "s" : ""}`
                    : "Refine your search"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="tap-target rounded-lg p-2 text-muted hover:text-foreground"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <ShopFiltersPanel
                filters={draftFilters}
                categories={categories}
                priceRange={priceRange}
                onChange={onDraftChange}
                onClear={onClear}
                showActions
                onApply={onApply}
                variant="drawer"
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
