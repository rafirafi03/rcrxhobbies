import { Suspense } from "react";
import ShopContent from "@/components/shop/ShopContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | RCRX Hobbies",
  description: "Browse our full collection of premium RC cars. Filter, sort, and order via WhatsApp.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
