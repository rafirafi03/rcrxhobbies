import SiteShell from "../../components/layout/SiteShell";
import { SiteDataProvider } from "../../context/SiteDataContext";
import { loadSiteCatalog } from "../../lib/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let products: Awaited<ReturnType<typeof loadSiteCatalog>>["products"] = [];
  let categories: Awaited<ReturnType<typeof loadSiteCatalog>>["categories"] = [];
  let settings: Awaited<ReturnType<typeof loadSiteCatalog>>["settings"] = null;
  let cmsError: string | null = null;

  try {
    const catalog = await loadSiteCatalog();
    products = catalog.products;
    categories = catalog.categories;
    settings = catalog.settings;
  } catch {
    cmsError = "Some store content could not be loaded. Please refresh the page.";
  }

  return (
    <SiteDataProvider products={products} categories={categories} settings={settings} cmsError={cmsError}>
      <SiteShell>{children}</SiteShell>
    </SiteDataProvider>
  );
}
