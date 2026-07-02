"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import ViewToggle from "../ui/ViewToggle";
import SortDropdown from "../ui/SortDropdown";
import { SORT_OPTIONS } from "../../lib/constants";
import type { SortOption } from "../../types";

interface ProductListToolbarProps {
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onFiltersClick?: () => void;
  activeFilterCount?: number;
  searchQuery?: string;
  onClearFilters?: () => void;
  extraLink?: { href: string; label: string };
}

export default function ProductListToolbar({
  count,
  sort,
  onSortChange,
  view,
  onViewChange,
  onFiltersClick,
  activeFilterCount = 0,
  searchQuery,
  onClearFilters,
  extraLink,
}: ProductListToolbarProps) {
  const hasMeta = Boolean(searchQuery) || activeFilterCount > 0 || extraLink;

  return (
    <div className="mb-4 lg:mb-6">
      <div className="flex items-center gap-2">
        <span className="ui-control flex h-10 min-w-10 shrink-0 items-center justify-center bg-neutral-50 px-2.5 text-xs font-bold tabular-nums text-foreground">
          {count}
        </span>

        {onFiltersClick && (
          <button
            type="button"
            onClick={onFiltersClick}
            className="ui-control relative flex h-10 shrink-0 items-center justify-center gap-2 px-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.625rem] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        <SortDropdown
          value={sort}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          className="min-w-0 flex-1 lg:min-w-[13.5rem] lg:flex-none"
        />

        <ViewToggle view={view} onChange={onViewChange} />
      </div>

      {hasMeta && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {searchQuery && (
            <span className="max-w-[12rem] truncate rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          {activeFilterCount > 0 && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
          {extraLink && (
            <Link href={extraLink.href} className="text-xs font-medium text-accent hover:underline">
              {extraLink.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
