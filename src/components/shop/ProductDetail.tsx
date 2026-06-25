"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, MessageCircle, Check, Star, Truck, Shield, RotateCcw } from "lucide-react";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import ReviewCard from "@/components/ui/ReviewCard";
import { formatPrice, calcDiscountPercent } from "@/lib/format";
import { getWhatsAppChatUrl } from "@/lib/whatsapp";
import { categoryToSlug, getCategoryPath } from "@/lib/products";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import QuantitySelector from "@/components/ui/QuantitySelector";
import WishlistButton from "@/components/ui/WishlistButton";
import RelatedProducts from "@/components/shop/RelatedProducts";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import AppImage from "@/components/ui/AppImage";
import { reviews } from "@/data/reviews";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, addToRecentlyViewed } = useStore();

  useEffect(() => {
    addToRecentlyViewed(product.id);
  }, [product.id, addToRecentlyViewed]);

  const discount = product.originalPrice
    ? calcDiscountPercent(product.price, product.originalPrice)
    : 0;

  const productReviews = reviews.filter(
    (r) => r.product === product.name || r.productId === product.id
  );

  function handleAddToCart() {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="bg-white">
      {/* Compact top bar — no hero */}
      <div className="border-b border-border bg-accent-light/20">
        <div className="page-container py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.category, href: getCategoryPath(categoryToSlug(product.category)) },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="page-container py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden bg-neutral-50 ring-1 ring-border"
            >
              <AppImage
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden ring-2 transition-all ${
                      selectedImage === i
                        ? "ring-accent"
                        : "ring-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <AppImage src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info — sticky purchase panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={getCategoryPath(categoryToSlug(product.category))}
                    className="text-[0.6875rem] font-semibold tracking-[0.2em] text-accent uppercase hover:underline"
                  >
                    {product.category}
                  </Link>
                  <h1 className="luxury-heading mt-2 text-3xl text-foreground sm:text-4xl">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-xs text-muted-light">SKU: {product.sku}</p>
                </div>
                <WishlistButton productId={product.id} className="shrink-0 rounded-full border border-border p-3" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3 border-b border-border pb-6">
                <span className="text-3xl font-semibold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-light line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="mt-6 text-[0.9375rem] leading-relaxed text-muted">
                {product.description}
              </p>

              <div className="mt-4">
                {product.inStock ? (
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    In Stock · {product.stockCount} units
                  </p>
                ) : (
                  <p className="text-sm font-medium text-accent">Out of Stock</p>
                )}
              </div>

              {product.badge && (
                <span className="mt-4 inline-block bg-foreground px-3 py-1 text-[0.625rem] font-semibold tracking-[0.15em] text-white uppercase">
                  {product.badge}
                </span>
              )}

              {/* Purchase box */}
              {product.inStock && (
                <div className="mt-8 border border-border bg-accent-light/30 p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="mb-2 text-[0.6875rem] tracking-[0.12em] text-muted uppercase">Quantity</p>
                      <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        max={product.stockCount}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleAddToCart}
                        className="luxury-btn-primary flex-1 justify-center"
                      >
                        {added ? (
                          <><Check className="h-4 w-4" /> Added</>
                        ) : (
                          <><ShoppingBag className="h-4 w-4" /> Add to Cart</>
                        )}
                      </button>
                      <Link
                        href="/checkout"
                        onClick={() => addToCart(product.id, quantity)}
                        className="luxury-btn-outline flex-1 justify-center !border-accent !text-accent hover:!bg-accent hover:!text-white"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                  <a
                    href={getWhatsAppChatUrl(`Hi, I'm interested in ${product.name} (${product.sku})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Order on WhatsApp instead
                  </a>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Shield, label: "Genuine Parts" },
                  { icon: RotateCcw, label: "7-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 border border-border bg-white p-3 text-center">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    <span className="text-[0.625rem] leading-tight tracking-wide text-muted uppercase">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details tabs section */}
        <div className="mt-16 grid gap-10 border-t border-border pt-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
              <span className="h-px w-6 bg-accent" />
              Description
            </h2>
            <p className="text-[0.9375rem] leading-[1.85] text-muted">{product.longDescription}</p>
          </div>
          <div>
            <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
              <span className="h-px w-6 bg-accent" />
              Specifications
            </h2>
            <ul className="divide-y divide-border border border-border">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-muted">{spec}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {product.features.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
              <span className="h-px w-6 bg-accent" />
              Highlights
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 border border-border bg-white p-4 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {productReviews.length > 0 && (
          <section className="mt-16 border-t border-border pt-16">
            <h2 className="luxury-heading mb-8 text-2xl">Customer Reviews</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {productReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          </section>
        )}

        <RelatedProducts product={product} />
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
