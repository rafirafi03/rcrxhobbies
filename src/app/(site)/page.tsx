import Hero from "../../components/sections/Hero";
import CategoryShowcase from "../../components/sections/CategoryShowcase";
import HomeFeatured from "../../components/sections/HomeFeatured";
import { getFeaturedProducts } from "../../lib/catalog";
import { getActiveHeroBanners, getActiveReels, loadSiteCatalog } from "../../lib/sanity/queries";

export default async function Home() {
  const [catalog, banners, reels] = await Promise.all([
    loadSiteCatalog(),
    getActiveHeroBanners(),
    getActiveReels(),
  ]);

  const featured = getFeaturedProducts(catalog.products, 8);
  const latest = catalog.products.slice(0, 4);

  return (
    <>
      <Hero banners={banners} />
      <CategoryShowcase categories={catalog.categories} />
      <HomeFeatured
        featuredProducts={featured}
        latestProducts={latest}
        reels={reels}
        faq={catalog.settings?.faq}
      />
    </>
  );
}
