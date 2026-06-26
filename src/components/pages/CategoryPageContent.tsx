"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductListToolbar from "@/components/shop/ProductListToolbar";
import { getProductsByCategorySlug, getCategoriesPath } from "@/lib/products";
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
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
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
        <div className="page-container py-4 sm:py-8 lg:py-12">
          <div className="hidden sm:block">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Categories", href: getCategoriesPath() },
                { label: name },
              ]}
            />
          </div>
          <p className="luxury-label mt-0 text-xs sm:mt-4">Category</p>
          <h1 className="luxury-heading mt-1 text-xl sm:mt-2 sm:text-3xl lg:text-5xl">{name}</h1>
          <p className="mt-2 hidden max-w-lg text-sm text-muted sm:block sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="page-container py-4 lg:py-14">
        <ProductListToolbar
          count={products.length}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          extraLink={{ href: getCategoriesPath(), label: "All categories" }}
        />

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center sm:py-20">
            <p className="luxury-heading text-xl sm:text-2xl">No products in this category yet</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Browse all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
