"use client";

import ProductCard from "../ui/ProductCard";
import SectionHeading from "../ui/SectionHeading";
import { getRelatedProducts } from "../../lib/products";
import { useSiteData } from "../../context/SiteDataContext";
import type { Product } from "../../types";

export default function RelatedProducts({ product }: { product: Product }) {
  const { products } = useSiteData();
  const related = getRelatedProducts(products, product);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <SectionHeading label="You May Also Like" title="Related Models" align="left" />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
        {related.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
