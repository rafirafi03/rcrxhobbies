"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { filterProducts, getCategories, getPriceRange } from "@/lib/products";
import { SORT_OPTIONS } from "@/lib/constants";
import type { ShopFilters, SortOption } from "@/types";

export default function ShopContent() {
  const searchParams = useSearchParams();
  const priceRange = getPriceRange();
  const categories = ["All", ...getCategories()];

  const [filters, setFilters] = useState<ShopFilters>({
    category: "All",
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    inStockOnly: false,
    search: "",
    sort: "featured",
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setFilters((f) => ({ ...f, search: q }));
    if (cat) setFilters((f) => ({ ...f, category: cat }));
  }, [searchParams]);

  const products = useMemo(() => filterProducts(filters), [filters]);

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-10 lg:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
          <h1 className="luxury-heading mt-4 text-4xl sm:text-5xl">All Products</h1>
          <p className="mt-3 max-w-lg text-muted">Browse our complete collection of premium RC machines.</p>
        </div>
      </div>

      <div className="page-container py-10 lg:py-14">

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className={`lg:w-64 lg:shrink-0 ${filtersOpen ? "block" : "hidden lg:block"}`}>
            <div className="space-y-8 border border-border p-6">
              <div>
                <h3 className="mb-4 text-[0.6875rem] font-semibold tracking-[0.15em] text-accent uppercase">
                  Category
                </h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setFilters((f) => ({ ...f, category: cat }))}
                        className={`text-sm transition-colors ${
                          filters.category === cat
                            ? "font-semibold text-accent"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-[0.6875rem] font-semibold tracking-[0.15em] text-accent uppercase">
                  Price Range
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value) }))}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <span className="text-muted">—</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
                  className="h-4 w-4 accent-accent"
                />
                <span className="text-sm text-muted">In stock only</span>
              </label>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <p className="text-sm text-muted">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 text-sm text-muted lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortOption }))}
                  className="border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="hidden items-center border border-border sm:flex">
                  <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-accent text-white" : "text-muted"}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-accent text-white" : "text-muted"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="luxury-heading text-2xl">No products found</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div>
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} variant="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
