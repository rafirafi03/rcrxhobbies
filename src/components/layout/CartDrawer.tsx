"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useSiteData } from "../../context/SiteDataContext";
import { getCartProducts } from "../../lib/cart";
import { getProductPath } from "../../lib/products";
import { formatPrice } from "../../lib/format";
import QuantitySelector from "../ui/QuantitySelector";
import { Card, CardBody, CardMedia } from "../ui/Card";
import AppImage from "../ui/AppImage";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCheckoutOverride,
    cartCount,
  } = useStore();
  const { products } = useSiteData();

  const cartProducts = getCartProducts(cart, products);
  const subtotal = cartProducts.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[71] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="luxury-label mb-0.5">Your Cart</p>
                <p className="text-sm text-muted">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-muted hover:text-foreground"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="mb-4 h-10 w-10 text-muted-light" strokeWidth={1} />
                  <p className="luxury-heading text-xl text-foreground">Cart is empty</p>
                  <p className="mt-2 text-sm text-muted">Discover our premium RC collection</p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="luxury-btn-primary mt-8"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cartProducts.map(({ product, quantity }) => (
                    <li key={product.id}>
                      <Card className="flex gap-4 p-4" accentTop={false}>
                        <Link
                          href={getProductPath(product.id)}
                          onClick={() => setCartOpen(false)}
                          className="shrink-0"
                        >
                          <CardMedia className="h-24 w-20">
                            <AppImage
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </CardMedia>
                        </Link>
                        <CardBody className="flex flex-1 flex-col !p-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={getProductPath(product.id)}
                                onClick={() => setCartOpen(false)}
                                className="text-sm font-medium text-foreground hover:text-accent"
                              >
                                {product.name}
                              </Link>
                              <p className="mt-0.5 text-xs text-muted">{product.sku}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-xs text-muted hover:text-accent"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <QuantitySelector
                              value={quantity}
                              onChange={(q) => updateQuantity(product.id, q)}
                              max={product.stockCount || 99}
                              size="sm"
                            />
                            <p className="text-sm font-medium">
                              {formatPrice(product.price * quantity)}
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartProducts.length > 0 && (
              <div className="border-t border-border px-6 py-6">
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="luxury-btn-outline mb-3 w-full justify-center"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => {
                    clearCheckoutOverride();
                    setCartOpen(false);
                  }}
                  className="luxury-btn-primary w-full justify-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
