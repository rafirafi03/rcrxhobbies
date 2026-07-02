import CartPage from "../../../components/shop/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | RCRX Hobbies",
};

export default function Cart() {
  return <CartPage />;
}
