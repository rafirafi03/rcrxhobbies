"use client";

import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";
import { getProductById } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";

interface RecentlyViewedProps {
  excludeId?: string;
  title?: string;
}

export default function RecentlyViewed({
  excludeId,
  title = "Recently Viewed",
}: RecentlyViewedProps) {
  const { recentlyViewed } = useStore();
  const products = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => getProductById(id))
    .filter(Boolean)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <SectionHeading label="Continue Browsing" title={title} align="left" />
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product!.id} product={product!} index={i} />
        ))}
      </div>
    </section>
  );
}
