import CategoriesPageContent from "../../../components/pages/CategoriesPageContent";
import { getAllCategories } from "../../../lib/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | RCRX Hobbies",
  description: "Browse RC cars by category — drift, off-road, crawlers, mini RC, and more.",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return <CategoriesPageContent categories={categories} />;
}
