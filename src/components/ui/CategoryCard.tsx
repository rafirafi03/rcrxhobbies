import Link from "next/link";
import type { Category } from "@/types";
import { getCategoryPath, getCategoryProductCount } from "@/lib/products";
import AppImage from "@/components/ui/AppImage";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  featured?: boolean;
  /** Circular icon style — home page only */
  rounded?: boolean;
}

export default function CategoryCard({
  category,
  featured = false,
  rounded = false,
}: CategoryCardProps) {
  const productCount = getCategoryProductCount(category.slug);

  if (featured) {
    return (
      <Link
        href={getCategoryPath(category.slug)}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:border-accent/30 hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
          <AppImage
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
              {productCount} item{productCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="absolute right-4 bottom-4 left-4">
            <h3 className="text-xl font-bold text-white sm:text-2xl">{category.name}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
            {category.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all group-hover:gap-2.5">
            Explore collection
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  if (rounded) {
    const size = "h-24 w-24 sm:h-28 sm:w-28 lg:h-[7.75rem] lg:w-[7.75rem]";

    return (
      <Link
        href={getCategoryPath(category.slug)}
        className="group flex w-[7rem] shrink-0 snap-center flex-col items-center sm:w-full sm:shrink"
      >
        <div
          className={`${size} overflow-hidden rounded-full border-2 border-border bg-white p-0.5 shadow-sm transition-all active:border-accent active:shadow-md sm:group-hover:border-accent sm:group-hover:shadow-md`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-100">
            <AppImage
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 124px"
              className="object-cover transition-transform duration-300 sm:group-hover:scale-110"
            />
          </div>
        </div>
        <h3 className="mt-2.5 line-clamp-2 w-full px-0.5 text-center text-xs font-semibold leading-tight text-foreground sm:mt-3 sm:text-sm">
          <span className="transition-colors sm:group-hover:text-accent">{category.name}</span>
        </h3>
      </Link>
    );
  }

  return (
    <Link
      href={getCategoryPath(category.slug)}
      className="group flex w-[5.25rem] shrink-0 snap-center flex-col sm:w-full sm:shrink"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all group-active:border-accent/40 sm:group-hover:border-accent/30 sm:group-hover:shadow-md">
        <AppImage
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 80px, 160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        {productCount > 0 && (
          <span className="absolute top-1.5 right-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[0.5625rem] font-bold text-foreground shadow-sm">
            {productCount}
          </span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-center text-[0.6875rem] font-semibold leading-tight text-foreground sm:text-xs">
        <span className="transition-colors group-hover:text-accent">{category.name}</span>
      </h3>
    </Link>
  );
}
