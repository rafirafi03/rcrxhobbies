import CategoriesPageContent from "@/components/pages/CategoriesPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | RCRX Hobbies",
  description:
    "Browse RC car categories — Drift, Off-Road, On-Road, Rock Crawler, Mini RC, and Nitro machines.",
};

export default function CategoriesPage() {
  return <CategoriesPageContent />;
}
