"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "../../types";
import CategoryCard from "../ui/CategoryCard";
import Breadcrumbs from "../ui/Breadcrumbs";
import { EmptyState } from "../ui/ContentState";

export default function CategoriesPageContent({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white">
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-8 sm:py-10 lg:py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Categories" },
            ]}
          />
          <p className="luxury-label mt-4">Browse by Type</p>
          <h1 className="luxury-heading mt-2 text-3xl sm:text-4xl lg:text-5xl">RC Categories</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
            From precision drift builds to rock-crawling beasts — find the perfect RC machine for
            your style.
          </p>
        </div>
      </div>

      <div className="page-container py-8 sm:py-12 lg:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">{categories.length} categories</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Categories from admin will appear here." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} featured />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
