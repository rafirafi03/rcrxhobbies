"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ShopFilters } from "../../types";
import { formatPrice } from "../../lib/format";

interface ShopFiltersPanelProps {
  filters: ShopFilters;
  categories: string[];
  priceRange: { min: number; max: number };
  onChange: (filters: ShopFilters) => void;
  onClear?: () => void;
  showActions?: boolean;
  onApply?: () => void;
  variant?: "sidebar" | "drawer";
}

export function countActiveFilters(
  filters: ShopFilters,
  priceRange: { min: number; max: number }
): number {
  let count = 0;
  if (filters.category !== "All") count += 1;
  if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) count += 1;
  if (filters.inStockOnly) count += 1;
  return count;
}

function CategoryFilter({
  filters,
  categories,
  onChange,
  collapsible,
}: {
  filters: ShopFilters;
  categories: string[];
  onChange: (filters: ShopFilters) => void;
  collapsible: boolean;
}) {
  const [open, setOpen] = useState(filters.category !== "All");

  if (!collapsible) {
    return (
      <div>
        <h3 className="mb-3 text-[0.6875rem] font-semibold tracking-[0.15em] text-accent uppercase">
          Category
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, category: cat })}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  filters.category === cat
                    ? "bg-accent-light font-semibold text-accent"
                    : "text-muted hover:bg-neutral-50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
          open ? "border-accent/30 bg-accent-light/40" : "border-border bg-white hover:bg-neutral-50"
        }`}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[0.625rem] font-semibold tracking-wide text-muted uppercase">
            Category
          </p>
          <p className="truncate text-sm font-medium text-foreground">{filters.category}</p>
        </div>
        <ChevronDown
          className={`ml-2 h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pt-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, category: cat });
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      filters.category === cat
                        ? "bg-accent-light font-semibold text-accent"
                        : "text-muted hover:bg-neutral-50 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopFiltersPanel({
  filters,
  categories,
  priceRange,
  onChange,
  onClear,
  showActions = false,
  onApply,
  variant = "drawer",
}: ShopFiltersPanelProps) {
  const collapsibleCategories = variant === "sidebar";

  return (
    <div className="space-y-6">
      <CategoryFilter
        filters={filters}
        categories={categories}
        onChange={onChange}
        collapsible={collapsibleCategories}
      />

      <div>
        <h3 className="mb-3 text-[0.6875rem] font-semibold tracking-[0.15em] text-accent uppercase">
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-[0.625rem] font-medium tracking-wide text-muted uppercase">
              Min
            </label>
            <input
              type="number"
              min={priceRange.min}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ ...filters, minPrice: Number(e.target.value) || priceRange.min })
              }
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>
          <span className="mt-5 text-muted">—</span>
          <div className="flex-1">
            <label className="mb-1.5 block text-[0.625rem] font-medium tracking-wide text-muted uppercase">
              Max
            </label>
            <input
              type="number"
              min={filters.minPrice}
              max={priceRange.max}
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: Number(e.target.value) || priceRange.max })
              }
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-light">
          {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-neutral-50">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
          className="h-4 w-4 rounded accent-accent"
        />
        <span className="text-sm text-foreground">In stock only</span>
      </label>

      {showActions && (
        <div className="flex gap-3 border-t border-border pt-6">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="luxury-btn-outline flex-1 justify-center !py-3"
            >
              Clear
            </button>
          )}
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="luxury-btn-primary flex-1 justify-center !py-3"
            >
              Apply Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
