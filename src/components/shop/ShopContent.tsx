"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Grid3x3 } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import Breadcrumbs from "../ui/Breadcrumbs";
import ProductListToolbar from "./ProductListToolbar";
import ShopFiltersPanel, { countActiveFilters } from "./ShopFiltersPanel";
import ShopFilterDrawer from "./ShopFilterDrawer";
import { filterProducts, getCategoryNames, getPriceRange, getCategoriesPath } from "../../lib/catalog";
import type { Category, Product, ShopFilters, SortOption } from "../../types";

const SORT_OPTIONS: SortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "name-asc",
  "rating",
  "newest",
];

function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.includes(value as SortOption);
}

function buildDefaultFilters(priceRange: { min: number; max: number }): ShopFilters {
  return {
    category: "All",
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    inStockOnly: false,
    search: "",
    sort: "featured",
  };
}

export default function ShopContent({
  products: allProducts,
  categories: categoryList,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const priceRange = getPriceRange(allProducts);
  const categories = ["All", ...getCategoryNames(allProducts)];

  const [filters, setFilters] = useState<ShopFilters>(() => buildDefaultFilters(priceRange));
  const [draftFilters, setDraftFilters] = useState<ShopFilters>(() => buildDefaultFilters(priceRange));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = countActiveFilters(filters, priceRange);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    const sort = searchParams.get("sort");

    if (q || cat || (sort && isSortOption(sort))) {
      setFilters((f) => ({
        ...f,
        ...(q ? { search: q } : {}),
        ...(cat ? { category: cat } : {}),
        ...(sort && isSortOption(sort) ? { sort } : {}),
      }));
    }
  }, [searchParams]);

  const products = useMemo(() => filterProducts(allProducts, filters), [allProducts, filters]);

  const openFilters = useCallback(() => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  }, [filters]);

  const applyFilters = useCallback(() => {
    setFilters(draftFilters);
    setFiltersOpen(false);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const defaults = buildDefaultFilters(priceRange);
    setDraftFilters((f) => ({ ...defaults, search: f.search, sort: f.sort }));
  }, [priceRange]);

  const clearAllFilters = useCallback(() => {
    const defaults = buildDefaultFilters(priceRange);
    setFilters(defaults);
    setDraftFilters(defaults);
  }, [priceRange]);

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-4 sm:py-8 lg:py-12">
          <div className="hidden sm:block">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
          </div>
          <div className="flex items-center justify-between gap-3 sm:mt-4">
            <h1 className="luxury-heading text-xl sm:text-3xl lg:text-5xl">All Products</h1>
            <Link
              href={getCategoriesPath()}
              className="tap-target inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-white p-2 text-foreground transition-colors hover:border-accent hover:text-accent sm:rounded-full sm:px-4 sm:py-2"
              aria-label="Browse categories"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden text-sm font-medium sm:inline">Categories</span>
            </Link>
          </div>
          <p className="mt-2 hidden max-w-lg text-sm text-muted sm:block sm:text-base">
            Browse our complete collection of premium RC machines.
          </p>
        </div>
      </div>

      <div className="page-container py-4 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="sticky top-28 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <ShopFiltersPanel
                filters={filters}
                categories={categories}
                priceRange={priceRange}
                onChange={setFilters}
                variant="sidebar"
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <ProductListToolbar
              count={products.length}
              sort={filters.sort}
              onSortChange={(sort) => setFilters((f) => ({ ...f, sort }))}
              view={view}
              onViewChange={setView}
              onFiltersClick={openFilters}
              activeFilterCount={activeFilterCount}
              searchQuery={filters.search || undefined}
              onClearFilters={clearAllFilters}
            />

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center sm:py-20">
                <p className="luxury-heading text-xl sm:text-2xl">No products found</p>
                <p className="mt-2 text-sm text-muted">Try adjusting your filters or search term.</p>
                <button type="button" onClick={clearAllFilters} className="luxury-btn-outline mt-6">
                  Reset Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 xl:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ShopFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        draftFilters={draftFilters}
        categories={categories}
        priceRange={priceRange}
        onDraftChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
        activeCount={countActiveFilters(draftFilters, priceRange)}
      />
    </div>
  );
}
