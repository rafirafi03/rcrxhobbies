"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import Breadcrumbs from "../ui/Breadcrumbs";
import ProductListToolbar from "../shop/ProductListToolbar";
import { getCategoriesPath } from "../../lib/products";
import { EmptyState } from "../ui/ContentState";
import type { Category, Product, SortOption } from "../../types";

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
  category,
  products: categoryProducts,
}: {
  category: Category;
  products: Product[];
  categories: Category[];
}) {
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");

  const products = useMemo(() => sortList(categoryProducts, sort), [categoryProducts, sort]);

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-8 sm:py-10 lg:py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Categories", href: getCategoriesPath() },
              { label: category.name },
            ]}
          />
          <p className="luxury-label mt-4">{category.name}</p>
          <h1 className="luxury-heading mt-2 text-3xl sm:text-4xl lg:text-5xl">{category.name}</h1>
          {category.description ? (
            <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{category.description}</p>
          ) : null}
        </div>
      </div>

      <div className="page-container py-8 sm:py-12">
        <ProductListToolbar
          count={products.length}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />

        {products.length === 0 ? (
          <EmptyState
            title="No products in this category"
            description="Products assigned to this category in admin will show up here."
            actionHref="/shop"
            actionLabel="Browse all products"
          />
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
                : "flex flex-col gap-4"
            }
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} variant={view} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
