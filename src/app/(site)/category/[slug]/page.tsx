import { notFound } from "next/navigation";
import CategoryPageContent from "@/components/pages/CategoryPageContent";
import { categories } from "@/data/categories";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | RCRX Hobbies`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <CategoryPageContent
      slug={category.slug}
      name={category.name}
      description={category.description}
    />
  );
}
