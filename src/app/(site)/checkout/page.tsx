import CheckoutPage from "../../../components/shop/CheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | RCRX Hobbies",
};

export default function Checkout() {
  return <CheckoutPage />;
}
