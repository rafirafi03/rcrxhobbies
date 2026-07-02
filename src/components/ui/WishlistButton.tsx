"use client";

import { Heart } from "lucide-react";
import { useStore } from "../../context/StoreContext";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const active = isInWishlist(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`flex items-center justify-center transition-colors ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 ${active ? "fill-accent text-accent" : "text-muted hover:text-foreground"}`}
        strokeWidth={1.5}
      />
    </button>
  );
}
