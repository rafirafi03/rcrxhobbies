"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useStore, useActiveCart, useCartSummary } from "../../context/StoreContext";
import { useSiteData, useSiteConfig } from "../../context/SiteDataContext";
import { getCartProducts } from "../../lib/cart";
import { getWhatsAppCartOrderUrl } from "../../lib/whatsapp";
import { formatPrice } from "../../lib/format";
import Breadcrumbs from "../ui/Breadcrumbs";
import OrderSummaryCard from "./OrderSummaryCard";
import AppImage from "../ui/AppImage";
import type { CheckoutData } from "../../types";

export default function CheckoutPage() {
  const { clearCart, checkoutOverride, clearCheckoutOverride } = useStore();
  const { products } = useSiteData();
  const site = useSiteConfig();
  const activeCart = useActiveCart();
  const [form, setForm] = useState<CheckoutData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
    promoCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartProducts = getCartProducts(activeCart, products);
  const summary = useCartSummary();

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || cartProducts.length === 0) return;
    const url = getWhatsAppCartOrderUrl(activeCart, products, form, site.whatsapp, site.name);
    window.open(url, "_blank");
    if (checkoutOverride) {
      clearCheckoutOverride();
    } else {
      clearCart();
    }
  }

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
        <h1 className="luxury-heading text-3xl">Nothing to checkout</h1>
        <Link href="/shop" className="luxury-btn-primary mt-8 inline-flex">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(checkoutOverride
            ? [{ label: "Shop", href: "/shop" }]
            : [{ label: "Cart", href: "/cart" }]),
          { label: "Checkout" },
        ]}
      />
      <h1 className="luxury-heading mb-10 text-4xl">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-3">
          <section>
            <h2 className="mb-6 text-[0.6875rem] tracking-[0.15em] text-muted uppercase">
              Contact Information
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">Full Name *</label>
                <input
                  className={`luxury-input ${errors.name ? "!border-accent" : ""}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
                {errors.name && <p className="mt-1 text-xs text-accent">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">Phone *</label>
                <input
                  className={`luxury-input ${errors.phone ? "!border-accent" : ""}`}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">Email</label>
                <input
                  className="luxury-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-[0.6875rem] tracking-[0.15em] text-muted uppercase">
              Shipping Address
            </h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">Address *</label>
                <input
                  className={`luxury-input ${errors.address ? "!border-accent" : ""}`}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House no, street, landmark"
                />
                {errors.address && <p className="mt-1 text-xs text-accent">{errors.address}</p>}
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">City *</label>
                  <input
                    className={`luxury-input ${errors.city ? "!border-accent" : ""}`}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-xs text-accent">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] uppercase">Pincode *</label>
                  <input
                    className={`luxury-input ${errors.pincode ? "!border-accent" : ""}`}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="682001"
                  />
                  {errors.pincode && <p className="mt-1 text-xs text-accent">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
              Order Notes
            </label>
            <textarea
              className="luxury-input resize-none"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Delivery preferences, gift message, etc."
            />
          </section>

          <button type="submit" className="luxury-btn-accent w-full justify-center sm:w-auto">
            <MessageCircle className="h-4 w-4" />
            Place Order via WhatsApp
          </button>

          <p className="text-xs text-muted">
            No payment gateway — your complete order will be sent to WhatsApp for confirmation and payment coordination.
          </p>
        </form>

        <div className="space-y-6 lg:col-span-2">
          <OrderSummaryCard summary={summary} showShippingNote={false} />

          <div className="border border-border p-6 text-sm">
            <h3 className="mb-4 text-[0.6875rem] tracking-[0.15em] text-muted uppercase">
              Order Items ({summary.itemCount})
            </h3>
            <ul className="space-y-4">
              {cartProducts.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3">
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md">
                    <AppImage src={product.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted">
                      Qty: {quantity} · {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
