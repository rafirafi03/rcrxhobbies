import CategoryPageContent from "../../../../components/pages/CategoryPageContent";
import { getAllCategories, getCategoryBySlug, getAllProducts } from "../../../../lib/sanity/queries";
import { getProductsByCategorySlug } from "../../../../lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getCategorySlugs } = await import("../../../../lib/sanity/queries");
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | RCRX Hobbies`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(slug),
    getAllProducts(),
    getAllCategories(),
  ]);
  if (!category) notFound();

  const categoryProducts = getProductsByCategorySlug(products, categories, slug);

  return (
    <CategoryPageContent
      category={category}
      products={categoryProducts}
      categories={categories}
    />
  );
}
