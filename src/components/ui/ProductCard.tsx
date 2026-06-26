"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { formatPrice, calcDiscountPercent } from "@/lib/format";
import { getProductPath } from "@/lib/products";
import WishlistButton from "@/components/ui/WishlistButton";
import AppImage from "@/components/ui/AppImage";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "grid" | "list";
}

function ProductRating({ product, compact = false }: { product: Product; compact?: boolean }) {
  if (product.rating <= 0) return null;

  return (
    <div
      className={`flex items-center gap-0.5 ${compact ? "text-[0.625rem]" : "text-xs"} text-muted`}
    >
      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({
  product,
  index = 0,
  variant = "grid",
}: ProductCardProps) {
  const { addToCart } = useStore();
  const discount = product.originalPrice
    ? calcDiscountPercent(product.price, product.originalPrice)
    : 0;

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart(product.id);
  };

  if (variant === "list") {
    return (
      <article className="group grid grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:border-accent/20 hover:shadow-md sm:grid-cols-[10rem_minmax(0,1fr)] md:grid-cols-[11rem_minmax(0,1fr)]">
        <Link
          href={getProductPath(product.id)}
          className="relative block min-h-[8.5rem] overflow-hidden bg-neutral-100 sm:min-h-[9.5rem]"
        >
          <AppImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 120px, 176px"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 z-10 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[0.625rem] font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="absolute top-2 right-2 z-10 rounded-md bg-accent px-1.5 py-0.5 text-[0.625rem] font-bold text-white">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
              <span className="rounded-md bg-foreground px-2 py-0.5 text-[0.625rem] font-semibold text-white">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-md bg-accent-light px-1.5 py-0.5 text-[0.625rem] font-semibold text-accent">
                {product.category}
              </span>
              <Link href={getProductPath(product.id)}>
                <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
                  {product.name}
                </h3>
              </Link>
            </div>
            <WishlistButton
              productId={product.id}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white"
            />
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted sm:line-clamp-3 sm:text-sm">
            {product.description}
          </p>

          <div className="mt-auto pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-base font-bold text-foreground sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-light line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <ProductRating product={product} />
            </div>

            <div className="mt-3 flex gap-2">
              <Link
                href={getProductPath(product.id)}
                className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Eye className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">View</span>
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-45"
              >
                <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{product.inStock ? "Add to Cart" : "Sold Out"}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12px" }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:border-accent/20 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 sm:aspect-square">
        <Link href={getProductPath(product.id)} className="relative block h-full">
          <AppImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[0.625rem] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="w-fit rounded-md bg-accent px-1.5 py-0.5 text-[0.625rem] font-bold text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm"
        />

        {!product.inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
            <span className="rounded-lg bg-foreground px-3 py-1 text-xs font-semibold text-white">
              Sold Out
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <span className="w-fit rounded-md bg-accent-light px-1.5 py-0.5 text-[0.625rem] font-semibold text-accent">
          {product.category}
        </span>

        <Link href={getProductPath(product.id)} className="mt-1.5 block flex-1">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between gap-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[0.625rem] text-muted-light line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <ProductRating product={product} compact />
        </div>

        <div className="mt-2.5 flex gap-1.5 sm:hidden">
          <Link
            href={getProductPath(product.id)}
            className="flex h-8 flex-1 items-center justify-center rounded-lg border border-border text-[0.6875rem] font-semibold text-foreground"
          >
            View
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex h-8 flex-1 items-center justify-center rounded-lg bg-accent text-[0.6875rem] font-semibold text-white disabled:opacity-45"
          >
            Cart
          </button>
        </div>

        <div className="mt-2.5 hidden gap-2 sm:flex">
          <Link
            href={getProductPath(product.id)}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-45"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
