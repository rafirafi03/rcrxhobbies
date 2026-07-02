import ProductCard from "../ui/ProductCard";
import SectionHeader from "../ui/SectionHeader";
import InstagramReels from "./InstagramReels";
import FAQ from "./FAQ";
import { EmptyState } from "../ui/ContentState";
import type { FaqSection, Product, ReelItem } from "../../types";

export default function HomeFeatured({
  featuredProducts,
  latestProducts,
  reels,
  faq,
}: {
  featuredProducts: Product[];
  latestProducts: Product[];
  reels: ReelItem[];
  faq?: FaqSection | null;
}) {
  return (
    <>
      <section className="section-y bg-accent-light/50">
        <div className="page-container">
          <SectionHeader
            label="The Collection"
            title="Featured RC Models"
            description="Hand-picked machines representing the finest in RC engineering and design."
            href="/shop"
            linkText="View All"
          />
          {featuredProducts.length === 0 ? (
            <EmptyState title="No featured products" description="Add products in admin and mark them as featured." actionHref="/shop" actionLabel="Browse shop" />
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-y border-t border-border bg-white">
        <div className="page-container">
          <SectionHeader
            label="Recently Updated"
            title="Latest RC Cars"
            description="Explore the latest RC cars, crawlers, drift cars and hobby products."
            href="/shop"
            linkText="View More"
          />
          {latestProducts.length === 0 ? (
            <EmptyState title="No products yet" description="Products from your admin catalog will appear here." />
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {latestProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <InstagramReels reels={reels} variant="home" />
      <FAQ faq={faq} />
    </>
  );
}
