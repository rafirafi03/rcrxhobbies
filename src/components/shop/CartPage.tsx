"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getCartProducts } from "@/lib/cart";
import { getProductPath } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import AppImage from "@/components/ui/AppImage";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useStore();
  const cartProducts = getCartProducts(cart);
  const subtotal = cartProducts.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <ShoppingBag className="mx-auto mb-6 h-12 w-12 text-muted-light" strokeWidth={1} />
        <h1 className="luxury-heading text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-muted">Explore our collection and find your next RC machine</p>
        <Link href="/shop" className="luxury-btn-primary mt-8 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <div className="mb-10 flex items-end justify-between">
        <h1 className="luxury-heading text-4xl">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-[0.6875rem] tracking-[0.12em] text-muted uppercase hover:text-accent"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
        <div className="space-y-4">
            {cartProducts.map(({ product, quantity }) => (
              <Card key={product.id} className="flex gap-6 p-5 sm:p-6" accentTop={false}>
                <Link href={getProductPath(product.id)} className="shrink-0">
                  <CardMedia className="h-32 w-28">
                    <AppImage
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </CardMedia>
                </Link>
                <CardBody className="flex flex-1 flex-col !p-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={getProductPath(product.id)} className="luxury-heading text-lg hover:text-accent">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">{product.sku} · {product.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} className="text-muted hover:text-accent">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QuantitySelector
                      value={quantity}
                      onChange={(q) => updateQuantity(product.id, q)}
                      max={product.stockCount || 99}
                      size="sm"
                    />
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(product.price * quantity)}</p>
                      {quantity > 1 && (
                        <p className="text-xs text-muted">{formatPrice(product.price)} each</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            ← Continue Shopping
          </Link>
        </div>

        <div className="border border-border p-6 lg:p-8 h-fit">
          <h2 className="luxury-heading mb-6 text-xl">Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-base font-medium">
              <span>Estimated Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">Shipping & discounts calculated at checkout</p>
          <Link href="/checkout" className="luxury-btn-primary mt-6 w-full justify-center">
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
