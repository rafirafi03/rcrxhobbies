import ProductCard from "@/components/ui/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getRelatedProducts } from "@/lib/products";
import type { Product } from "@/types";

export default function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <SectionHeading label="You May Also Like" title="Related Models" align="left" />
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
