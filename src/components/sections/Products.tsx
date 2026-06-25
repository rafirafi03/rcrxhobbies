"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { getFeaturedProducts, getCategories } from "@/lib/products";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...getCategories()];
  const featured = getFeaturedProducts(6);

  const filtered =
    activeCategory === "All"
      ? featured
      : featured.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            label="The Collection"
            title="Featured Models"
            description="Hand-selected machines from our full catalog."
            align="left"
          />
          <Link href="/shop" className="luxury-btn-outline shrink-0">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-wrap gap-x-8 gap-y-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative pb-2 text-[0.75rem] tracking-[0.12em] uppercase transition-colors ${
                activeCategory === cat
                  ? "text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/shop" className="luxury-btn-primary inline-flex">
            Browse Full Store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
