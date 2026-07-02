import { SHIPPING_CONFIG } from "./catalog";
import { getProductById } from "./catalog";
import { formatPrice } from "./format";
import type { CartItem, OrderSummary, Product } from "../types";

export function calculateOrderSummary(
  items: CartItem[],
  products: Product[],
  promoCode?: string
): OrderSummary {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const product = getProductById(products, item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
      itemCount += item.quantity;
    }
  }

  const afterDiscount = subtotal;
  const shipping =
    afterDiscount >= SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.standardShipping;

  return {
    subtotal,
    discount: 0,
    shipping,
    total: afterDiscount + shipping,
    itemCount,
    promoApplied: promoCode?.trim() ? promoCode.trim().toUpperCase() : null,
  };
}

export function getCartProducts(items: CartItem[], products: Product[]) {
  return items
    .map((item) => {
      const product = getProductById(products, item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number }[];
}

export function formatOrderSummaryLines(summary: OrderSummary): string[] {
  const lines = [`Subtotal: ${formatPrice(summary.subtotal)}`];
  if (summary.discount > 0) {
    lines.push(`Discount (${summary.promoApplied}): -${formatPrice(summary.discount)}`);
  }
  lines.push(`Shipping: ${summary.shipping === 0 ? "FREE" : formatPrice(summary.shipping)}`);
  lines.push(`*Grand Total: ${formatPrice(summary.total)}*`);
  return lines;
}
