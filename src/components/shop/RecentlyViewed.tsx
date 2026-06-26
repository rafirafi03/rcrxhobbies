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
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product!.id} product={product!} index={i} />
        ))}
      </div>
    </section>
  );
}
