import { notFound } from "next/navigation";
import ProductDetail from "../../../../components/shop/ProductDetail";
import { loadProductReviews } from "../../../../lib/reviews";
import { getProductBySlug } from "../../../../lib/sanity/queries";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { getProductSlugs } = await import("../../../../lib/sanity/queries");
  const slugs = await getProductSlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | RCRX Hobbies`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();
  const reviews = await loadProductReviews(product.id);
  return <ProductDetail product={product} reviews={reviews} />;
}
