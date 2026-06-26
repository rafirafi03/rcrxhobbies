import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import InstagramReels from "@/components/sections/InstagramReels";
import FAQ from "@/components/sections/FAQ";
import { getFeaturedProducts } from "@/lib/products";

export default function HomeFeatured() {
  const featured = getFeaturedProducts(8);

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
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {featured.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
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
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {featured.slice(4, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      <InstagramReels variant="home" />
      <FAQ />
    </>
  );
}
