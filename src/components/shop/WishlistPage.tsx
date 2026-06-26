"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const products = wishlist.map((id) => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
        <Heart className="mx-auto mb-6 h-12 w-12 text-muted-light" strokeWidth={1} />
        <h1 className="luxury-heading text-3xl">Your wishlist is empty</h1>
        <p className="mt-3 text-muted">Save items you love and come back later</p>
        <Link href="/shop" className="luxury-btn-primary mt-8 inline-flex">
          <ShoppingBag className="h-4 w-4" />
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="luxury-heading mb-2 text-4xl">Wishlist</h1>
      <p className="mb-10 text-sm text-muted">{products.length} saved item{products.length !== 1 ? "s" : ""}</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product!.id} product={product!} index={i} />
        ))}
      </div>
    </div>
  );
}
