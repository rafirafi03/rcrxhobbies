"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MessageCircle,
  Check,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import type { Product, Review } from "../../types";
import { useStore } from "../../context/StoreContext";
import { useSiteConfig } from "../../context/SiteDataContext";
import ReviewCard, { ReviewSummary } from "../ui/ReviewCard";
import { formatPrice, calcDiscountPercent } from "../../lib/format";
import { getWhatsAppChatUrl } from "../../lib/whatsapp";
import { categoryToSlug, getCategoryPath } from "../../lib/products";
import Breadcrumbs from "../ui/Breadcrumbs";
import QuantitySelector from "../ui/QuantitySelector";
import WishlistButton from "../ui/WishlistButton";
import RelatedProducts from "./RelatedProducts";
import RecentlyViewed from "./RecentlyViewed";
import AppImage from "../ui/AppImage";

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
}

type DetailTab = "description" | "specs" | "features";

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specs", label: "Specs" },
  { id: "features", label: "Features" },
];

const purchaseBtnClass =
  "luxury-btn-primary w-full min-h-[3rem] justify-center !px-4 !py-3 !text-sm";

const buyNowBtnClass =
  "luxury-btn-outline w-full min-h-[3rem] justify-center !border-primary !px-4 !py-3 !text-sm !text-primary hover:!bg-primary hover:!text-white";

function ProductGallery({
  product,
  selectedImage,
  onSelectImage,
}: {
  product: Product;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}) {
  const activeImage = product.images[selectedImage] || product.image;

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50 sm:aspect-[5/4] lg:aspect-auto lg:h-80 xl:h-[22rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <AppImage
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {product.images.length > 1 && (
        <div className="mt-3 w-full min-w-0">
          <div className="flex gap-2.5 overflow-x-auto overscroll-x-contain px-0.5 py-1 scrollbar-none [-webkit-overflow-scrolling:touch]">
            {product.images.map((img, i) => {
              const isSelected = selectedImage === i;
              return (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => onSelectImage(i)}
                  className={`relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 transition-all sm:h-16 sm:w-16 ${
                    isSelected
                      ? "border-2 border-accent opacity-100 shadow-sm"
                      : "border border-border opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={isSelected}
                >
                  <AppImage src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({ product, reviews }: ProductDetailProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("description");
  const { addToCart, buyNow, addToRecentlyViewed } = useStore();
  const site = useSiteConfig();

  useEffect(() => {
    addToRecentlyViewed(product.id);
  }, [product.id, addToRecentlyViewed]);

  const discount = product.originalPrice
    ? calcDiscountPercent(product.price, product.originalPrice)
    : 0;

  const productReviews = reviews;
  const reviewAverage =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0;

  const whatsAppUrl = getWhatsAppChatUrl(
    site.whatsapp,
    `Hi, I'm interested in ${product.name} (${product.sku})`
  );

  const categoryPath = getCategoryPath(categoryToSlug(product.category));

  function handleAddToCart() {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    buyNow(product.id, quantity);
    router.push("/checkout");
  }

  return (
    <div className="overflow-x-hidden bg-white pb-[calc(9.5rem+env(safe-area-inset-bottom))] lg:pb-0">
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

      <div className="page-container pb-4 pt-3 sm:pb-6 sm:pt-4 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <ProductGallery
              product={product}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />
          </div>

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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border sm:h-11 sm:w-11"
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

              {product.inStock && (
                <div className="mt-8 hidden rounded-2xl border border-border bg-accent-light/30 p-6 lg:block">
                  <div className="mb-4">
                    <p className="mb-2 text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                      Quantity
                    </p>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      max={product.stockCount}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={handleAddToCart} className={purchaseBtnClass}>
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
                    <button type="button" onClick={handleBuyNow} className={buyNowBtnClass}>
                      Buy Now
                    </button>
                  </div>
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
            <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="luxury-heading text-lg sm:text-2xl">Customer Reviews</h2>
                <p className="mt-1 text-sm text-muted">What buyers are saying about this model</p>
              </div>
              <ReviewSummary rating={reviewAverage} count={productReviews.length} />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {productReviews.map((review) => (
                <ReviewCard key={review.id} review={review} variant="product" />
              ))}
            </div>
          </section>
        )}

        <div className="[&_section]:py-8 [&_section]:sm:py-12 [&_h2]:!text-xl [&_h2]:sm:!text-2xl [&_.mb-10]:!mb-6 [&_.mb-10]:sm:!mb-10">
          <RelatedProducts product={product} />
          <RecentlyViewed excludeId={product.id} />
        </div>
      </div>

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

            <div className="flex items-center gap-2">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stockCount}
                size="sm"
              />
              <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                <button type="button" onClick={handleAddToCart} className={`${purchaseBtnClass} !min-h-[2.75rem] !text-xs sm:!text-sm`}>
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
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={`${buyNowBtnClass} !min-h-[2.75rem] !text-xs sm:!text-sm`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
