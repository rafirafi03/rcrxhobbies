import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import CategoryCard from "@/components/ui/CategoryCard";

export default function CategoryShowcase() {
  return (
    <section id="categories" className="border-b border-border bg-white pb-6 pt-1 sm:pb-8">
      <div className="page-container">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <div>
            <p className="luxury-label text-xs sm:text-sm">RCRX Categories</p>
            <h2 className="mt-0.5 text-lg font-bold text-foreground sm:text-xl">Shop by Category</h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent sm:text-sm"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile-first: horizontal scroll with round icons */}
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
