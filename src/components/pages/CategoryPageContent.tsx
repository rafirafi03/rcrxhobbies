"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getProductsByCategorySlug } from "@/lib/products";
import { SORT_OPTIONS } from "@/lib/constants";
import type { SortOption } from "@/types";

interface CategoryPageProps {
  slug: string;
  name: string;
  description: string;
}

function sortList<T extends { price: number; name: string; rating: number }>(
  list: T[],
  sort: SortOption
): T[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc": return sorted.sort((a, b) => a.price - b.price);
    case "price-desc": return sorted.sort((a, b) => b.price - a.price);
    case "name-asc": return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating": return sorted.sort((a, b) => b.rating - a.rating);
    default: return sorted;
  }
}

export default function CategoryPageContent({
  slug,
  name,
  description,
}: CategoryPageProps) {
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const products = useMemo(
    () => sortList(getProductsByCategorySlug(slug), sort),
    [slug, sort]
  );

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-10 lg:py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: name },
            ]}
          />
          <p className="luxury-label mt-4">Category</p>
          <h1 className="luxury-heading mt-2 text-4xl sm:text-5xl">{name}</h1>
          <p className="mt-3 max-w-lg text-muted">{description}</p>
        </div>
      </div>

      <div className="page-container py-10 lg:py-14">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <p className="text-sm text-muted">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="hidden items-center border border-border sm:flex">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 ${view === "grid" ? "bg-accent text-white" : "text-muted"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2.5 ${view === "list" ? "bg-accent text-white" : "text-muted"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="luxury-heading text-2xl">No products in this category yet</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
