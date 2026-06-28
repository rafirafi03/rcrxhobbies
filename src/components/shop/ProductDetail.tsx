"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
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

type DetailTab = "description" | "specs" | "features";

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specs" },
  { id: "features", label: "Features" },
];

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("description");
  const galleryRef = useRef<HTMLDivElement>(null);
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

  const whatsAppUrl = getWhatsAppChatUrl(
    `Hi, I'm interested in ${product.name} (${product.sku})`
  );

  const syncGalleryScroll = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const slideWidth = gallery.clientWidth;
    if (!slideWidth) return;

    const index = Math.round(gallery.scrollLeft / slideWidth);
    setSelectedImage(Math.min(index, product.images.length - 1));
  }, [product.images.length]);

  function scrollToImage(index: number) {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.scrollTo({ left: index * gallery.clientWidth, behavior: "smooth" });
    setSelectedImage(index);
  }

  function handleAddToCart() {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart(product.id, quantity);
  }

  const categoryPath = getCategoryPath(categoryToSlug(product.category));

  return (
    <div className="overflow-x-hidden bg-white pb-[calc(9.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      {/* Desktop breadcrumbs */}
      <div className="hidden border-b border-border bg-accent-light/20 lg:block">
        <div className="page-container py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.category, href: categoryPath },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Mobile gallery — full width, edge to edge */}
      <div className="relative lg:hidden">
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          <Link
            href={categoryPath}
            className="tap-target flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur-sm"
            aria-label="Back to category"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <WishlistButton
            productId={product.id}
            className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-white/95 shadow-md backdrop-blur-sm"
          />
        </div>

        <div
          ref={galleryRef}
          onScroll={syncGalleryScroll}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto bg-neutral-100"
        >
          {product.images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square w-full min-w-full shrink-0 snap-center"
            >
              <AppImage
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {product.images.length > 1 && (
          <>
            <div className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {selectedImage + 1} / {product.images.length}
            </div>
            <div className="flex justify-center gap-1.5 py-2.5">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedImage === i ? "w-6 bg-accent" : "w-1.5 bg-border"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="page-container py-4 sm:py-6 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
          {/* Desktop gallery */}
          <div className="hidden lg:col-span-7 lg:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-border"
            >
              <AppImage
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                priority
                sizes="58vw"
                className="object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
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

          {/* Product info */}
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Link
                href={categoryPath}
                className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-accent uppercase"
              >
                {product.category}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <div className="mt-2 flex items-start justify-between gap-3">
                <h1 className="luxury-heading text-xl leading-snug break-words text-foreground sm:text-2xl lg:text-4xl">
                  {product.name}
                </h1>
                <WishlistButton
                  productId={product.id}
                  className="hidden h-11 w-11 shrink-0 rounded-full border border-border lg:flex"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-muted">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                <span className="w-full text-xs text-muted-light sm:w-auto">
                  SKU: {product.sku}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-muted-light line-through sm:text-base">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-white">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In Stock · {product.stockCount} left
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    Out of Stock
                  </span>
                )}
                {product.badge && (
                  <span className="rounded-full bg-foreground px-3 py-1 text-[0.625rem] font-semibold tracking-wide text-white uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <p className="mt-4 hidden text-sm leading-relaxed text-muted sm:text-[0.9375rem] lg:block">
                {product.description}
              </p>

              {/* Desktop purchase box */}
              {product.inStock && (
                <div className="mt-8 hidden rounded-2xl border border-border bg-accent-light/30 p-6 lg:block">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="mb-2 text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                        Quantity
                      </p>
                      <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        max={product.stockCount}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="luxury-btn-primary flex-1 justify-center"
                      >
                        {added ? (
                          <>
                            <Check className="h-4 w-4" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-4 w-4" /> Add to Cart
                          </>
                        )}
                      </button>
                      <Link
                        href="/checkout"
                        onClick={handleBuyNow}
                        className="luxury-btn-outline flex-1 justify-center !border-accent !text-accent hover:!bg-accent hover:!text-white"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Order on WhatsApp instead
                  </a>
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2 lg:mt-6 lg:gap-3">
                {[
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Shield, label: "Genuine Parts" },
                  { icon: RotateCcw, label: "7-Day Returns" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-white p-2.5 text-center sm:gap-2 sm:p-3"
                  >
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    <span className="text-[0.5625rem] leading-tight font-medium tracking-wide text-muted uppercase sm:text-[0.625rem]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 border-t border-border pt-6 lg:mt-16 lg:pt-16">
          <div className="lg:hidden">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1">
              {detailTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-1 py-2.5 text-center text-[0.6875rem] font-semibold transition-colors sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-white text-accent shadow-sm"
                      : "text-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                {activeTab === "description" && (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-foreground">{product.description}</p>
                    <p className="text-sm leading-[1.8] text-muted">{product.longDescription}</p>
                  </div>
                )}
                {activeTab === "specs" && (
                  <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                    {product.specs.map((spec) => (
                      <li
                        key={spec}
                        className="flex items-start justify-between gap-3 px-3 py-3 text-sm sm:px-4 sm:py-3.5"
                      >
                        <span className="min-w-0 flex-1 text-muted">{spec}</span>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "features" && (
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 rounded-xl border border-border bg-white p-3 text-sm text-muted sm:gap-3 sm:p-3.5"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="min-w-0 flex-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden gap-10 lg:grid lg:grid-cols-2">
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
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {product.specs.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <span className="text-muted">{spec}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {product.features.length > 0 && (
            <div className="mt-10 hidden lg:block">
              <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.15em] text-foreground uppercase">
                <span className="h-px w-6 bg-accent" />
                Highlights
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 text-sm text-muted"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {productReviews.length > 0 && (
          <section className="mt-8 border-t border-border pt-8 lg:mt-16 lg:pt-16">
            <h2 className="luxury-heading mb-4 text-lg sm:mb-8 sm:text-2xl">Customer Reviews</h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {productReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="[&_section]:py-8 [&_section]:sm:py-12 [&_h2]:!text-xl [&_h2]:sm:!text-2xl [&_.mb-10]:!mb-6 [&_.mb-10]:sm:!mb-10">
          <RelatedProducts product={product} />
          <RecentlyViewed excludeId={product.id} />
        </div>
      </div>

      {/* Mobile sticky purchase bar */}
      {product.inStock && (
        <div
          className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="page-container space-y-2.5 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-bold leading-tight text-foreground">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice && (
                  <p className="text-xs text-muted-light line-through">
                    {formatPrice(product.originalPrice)}
                    <span className="ml-1.5 text-accent">-{discount}%</span>
                  </p>
                )}
              </div>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 active:bg-emerald-100"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp
              </a>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stockCount}
                size="sm"
              />
              <button
                type="button"
                onClick={handleAddToCart}
                className="luxury-btn-primary min-h-[2.75rem] min-w-0 flex-1 justify-center !px-3 !py-2.5 !text-xs sm:!text-sm"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 shrink-0" />
                    <span className="truncate">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 shrink-0" />
                    <span className="truncate">Add to Cart</span>
                  </>
                )}
              </button>
              <Link
                href="/checkout"
                onClick={handleBuyNow}
                className="luxury-btn-outline flex min-h-[2.75rem] shrink-0 items-center justify-center !border-accent !px-3 !py-2.5 !text-xs !text-accent sm:!px-4 sm:!text-sm"
              >
                Buy
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
