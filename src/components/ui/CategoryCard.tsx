import Link from "next/link";
import type { Category } from "@/types";
import { getCategoryPath } from "@/lib/products";
import AppImage from "@/components/ui/AppImage";

interface CategoryCardProps {
  category: Category;
  compact?: boolean;
}

export default function CategoryCard({ category, compact = false }: CategoryCardProps) {
  const size = compact
    ? "h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20"
    : "h-20 w-20 sm:h-24 sm:w-24";

  return (
    <Link
      href={getCategoryPath(category.slug)}
      className="group flex w-[5.5rem] shrink-0 snap-center flex-col items-center sm:w-full sm:shrink"
    >
      <div
        className={`${size} overflow-hidden rounded-full border-2 border-border bg-white p-0.5 shadow-sm transition-all active:border-accent active:shadow-md sm:group-hover:border-accent sm:group-hover:shadow-md`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-100">
          <AppImage
            src={category.image}
            alt={category.name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 sm:group-hover:scale-110"
          />
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 w-full px-0.5 text-center text-[0.6875rem] font-semibold leading-tight text-foreground sm:mt-2.5 sm:text-xs">
        <span className="transition-colors sm:group-hover:text-accent">{category.name}</span>
      </h3>
    </Link>
  );
}
