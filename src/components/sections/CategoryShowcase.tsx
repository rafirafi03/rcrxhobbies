import type { Category } from "../../types";
import CategoryCard from "../ui/CategoryCard";
import SectionHeader from "../ui/SectionHeader";
import { EmptyState } from "../ui/ContentState";
import { getCategoriesPath } from "../../lib/products";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="section-y border-t border-border bg-white">
      <div className="page-container">
        <SectionHeader
          label="Browse"
          title="Shop by Category"
          description="Find the perfect RC machine for your style — drift, off-road, crawlers, and more."
          href={getCategoriesPath()}
          linkText="All Categories"
        />
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Categories will appear here once added in the admin panel." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
