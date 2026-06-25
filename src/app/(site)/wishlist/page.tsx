import WishlistPage from "@/components/shop/WishlistPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist | RCRX Hobbies",
};

export default function Wishlist() {
  return <WishlistPage />;
}
