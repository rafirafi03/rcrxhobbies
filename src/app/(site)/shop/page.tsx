import { Suspense } from "react";
import ShopContent from "../../../components/shop/ShopContent";
import { PageLoading } from "../../../components/ui/ContentState";
import { loadSiteCatalog } from "../../../lib/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | RCRX Hobbies",
  description: "Browse our full collection of premium RC cars. Filter, sort, and order via WhatsApp.",
};

export default async function ShopPage() {
  const catalog = await loadSiteCatalog();

  return (
    <Suspense fallback={<PageLoading label="Loading shop…" />}>
      <ShopContent products={catalog.products} categories={catalog.categories} />
    </Suspense>
  );
}
