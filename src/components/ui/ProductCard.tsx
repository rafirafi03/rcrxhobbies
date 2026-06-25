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
      className={`flex items-center gap-0.5 text-muted ${compact ? "text-[0.625rem]" : "text-xs"}`}
    >
      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
      {!compact && product.reviewCount > 0 && (
        <span className="text-muted-light">({product.reviewCount})</span>
      )}
    </div>
  );
}

function ProductActions({
  product,
  onAddToCart,
  layout = "grid",
}: {
  product: Product;
  onAddToCart: () => void;
  layout?: "grid" | "list";
}) {
  const isList = layout === "list";

  return (
    <div className={`card-actions ${isList ? "card-actions-list" : ""}`}>
      <Link
        href={getProductPath(product.id)}
        className="card-btn card-btn-secondary"
        aria-label={`View details for ${product.name}`}
      >
        <Eye className="card-btn-icon h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="truncate">{isList ? "View Details" : "View"}</span>
      </Link>
      <button
        type="button"
        onClick={onAddToCart}
        disabled={!product.inStock}
        className="card-btn card-btn-primary"
        aria-label={product.inStock ? `Add ${product.name} to cart` : "Sold out"}
      >
        <ShoppingBag className="card-btn-icon h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        <span className="truncate">
          {product.inStock ? (
            <>
              <span className="sm:hidden">Cart</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </>
          ) : (
            "Sold Out"
          )}
        </span>
      </button>
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

  const handleAddToCart = () => addToCart(product.id);

  if (variant === "list") {
    return (
      <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow active:border-accent/30 sm:flex-row sm:hover:shadow-md">
        <Link
          href={getProductPath(product.id)}
          className="relative aspect-[16/10] w-full shrink-0 bg-slate-50 sm:aspect-auto sm:h-40 sm:w-40 md:h-44 md:w-44"
        >
          <AppImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 ui-badge ui-badge-sale">-{discount}%</span>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-accent sm:text-xs">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="rounded bg-accent-light px-1.5 py-0.5 text-[0.625rem] font-semibold text-accent">
                    {product.badge}
                  </span>
                )}
              </div>
              <Link href={getProductPath(product.id)}>
                <h3 className="mt-1 text-sm font-semibold leading-snug text-foreground sm:text-base">
                  {product.name}
                </h3>
              </Link>
            </div>
            <WishlistButton
              productId={product.id}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white sm:h-9 sm:w-9"
            />
          </div>

          <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted sm:text-sm">
            {product.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-base font-bold text-foreground sm:text-lg">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-light line-through sm:text-sm">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <ProductRating product={product} />
          </div>

          <ProductActions product={product} onAddToCart={handleAddToCart} layout="list" />
        </div>
      </article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-16px" }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-[border-color,box-shadow] active:border-accent/40 sm:rounded-xl sm:hover:border-accent/25 sm:hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link href={getProductPath(product.id)} className="relative block h-full">
          <AppImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 sm:group-hover:scale-105"
          />
        </Link>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-1 p-2 sm:p-2.5">
          <div className="flex flex-col gap-1">
            {discount > 0 && (
              <span className="ui-badge ui-badge-sale w-fit">-{discount}%</span>
            )}
            {product.badge && (
              <span className="ui-badge ui-badge-blue w-fit text-[0.625rem]">{product.badge}</span>
            )}
          </div>
          <WishlistButton
            productId={product.id}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm sm:h-8 sm:w-8"
          />
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
            <span className="rounded-md bg-foreground px-2 py-0.5 text-[0.625rem] font-semibold text-white sm:px-2.5 sm:py-1 sm:text-xs">
              Sold Out
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="absolute right-2 bottom-2 hidden h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-md transition-transform hover:bg-accent-hover active:scale-95 disabled:opacity-50 sm:group-hover:flex"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-3.5">
        <p className="truncate text-[0.625rem] font-semibold uppercase tracking-wide text-accent sm:text-[0.6875rem]">
          {product.category}
        </p>

        <Link href={getProductPath(product.id)} className="mt-0.5 block min-h-[2.25rem] sm:min-h-[2.5rem]">
          <h3 className="line-clamp-2 text-[0.75rem] font-semibold leading-snug text-foreground sm:text-sm">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center justify-between gap-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-xs font-bold text-foreground sm:text-sm">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[0.625rem] text-muted-light line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <ProductRating product={product} compact />
        </div>

        <ProductActions product={product} onAddToCart={handleAddToCart} />
      </div>
    </motion.article>
  );
}
