import { PROMO_CODES, SITE_CONFIG } from "./constants";
import { formatPrice } from "./format";
import { getProductById } from "./products";
import type { CartItem, OrderSummary } from "@/types";

export function calculateOrderSummary(
  items: CartItem[],
  promoCode?: string
): OrderSummary {
  let subtotal = 0;
  let itemCount = 0;

  for (const item of items) {
    const product = getProductById(item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
      itemCount += item.quantity;
    }
  }

  let discount = 0;
  let promoApplied: string | null = null;
  const code = promoCode?.trim().toUpperCase();

  if (code && PROMO_CODES[code]) {
    const promo = PROMO_CODES[code];
    if (!promo.minOrder || subtotal >= promo.minOrder) {
      promoApplied = code;
      discount =
        promo.discount < 1
          ? Math.round(subtotal * promo.discount)
          : promo.discount;
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping =
    afterDiscount >= SITE_CONFIG.freeShippingThreshold
      ? 0
      : SITE_CONFIG.standardShipping;

  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    itemCount,
    promoApplied,
  };
}

export function getCartProducts(items: CartItem[]) {
  return items
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: NonNullable<ReturnType<typeof getProductById>>; quantity: number }[];
}

export function formatOrderSummaryLines(summary: OrderSummary): string[] {
  const lines = [`Subtotal: ${formatPrice(summary.subtotal)}`];
  if (summary.discount > 0) {
    lines.push(`Discount (${summary.promoApplied}): -${formatPrice(summary.discount)}`);
  }
  lines.push(
    `Shipping: ${summary.shipping === 0 ? "FREE" : formatPrice(summary.shipping)}`
  );
  lines.push(`*Grand Total: ${formatPrice(summary.total)}*`);
  return lines;
}
