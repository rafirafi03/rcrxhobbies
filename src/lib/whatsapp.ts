import { SITE_CONFIG } from "./constants";
import { formatPrice } from "./format";
import { getCartProducts, calculateOrderSummary, formatOrderSummaryLines } from "./cart";
import { getProductById } from "./products";
import type { CartItem, CheckoutData } from "@/types";

export function buildCartOrderMessage(
  items: CartItem[],
  checkout: CheckoutData
): string {
  const cartProducts = getCartProducts(items);
  const summary = calculateOrderSummary(items, checkout.promoCode);

  const lines = [
    "🏎️ *NEW RC STORE ORDER*",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    "📦 *ORDER ITEMS*",
  ];

  cartProducts.forEach((item, i) => {
    lines.push(
      `${i + 1}. *${item.product.name}*`,
      `   SKU: ${item.product.sku}`,
      `   Qty: ${item.quantity} × ${formatPrice(item.product.price)} = ${formatPrice(item.product.price * item.quantity)}`
    );
  });

  lines.push(
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    "💰 *ORDER SUMMARY*",
    ...formatOrderSummaryLines(summary).map((l) => `• ${l}`),
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    "👤 *CUSTOMER DETAILS*",
    `• Name: ${checkout.name}`,
    `• Phone: ${checkout.phone}`,
    checkout.email ? `• Email: ${checkout.email}` : "",
    `• Address: ${checkout.address}`,
    `• City: ${checkout.city}`,
    `• Pincode: ${checkout.pincode}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━"
  );

  if (checkout.notes.trim()) {
    lines.push("", "📝 *NOTES*", `• ${checkout.notes.trim()}`, "");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
  }

  lines.push(
    "",
    `✅ Order via ${SITE_CONFIG.name} Store`,
    `📅 ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
  );

  return lines.filter((l) => l !== "").join("\n");
}

export function getWhatsAppCartOrderUrl(
  items: CartItem[],
  checkout: CheckoutData
): string {
  const message = encodeURIComponent(buildCartOrderMessage(items, checkout));
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`;
}

export function buildQuickOrderMessage(
  productId: string,
  quantity: number,
  name: string,
  phone: string,
  address: string,
  notes?: string
): string {
  const product = getProductById(productId);
  if (!product) return "";

  const total = product.price * quantity;
  const lines = [
    "🏎️ *QUICK ORDER*",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    `• *${product.name}* (${product.sku})`,
    `• Qty: ${quantity} × ${formatPrice(product.price)}`,
    `• *Total: ${formatPrice(total)}*`,
    "",
    "👤 *CUSTOMER*",
    `• ${name} | ${phone}`,
    `• ${address}`,
  ];

  if (notes?.trim()) lines.push(`• Notes: ${notes.trim()}`);
  lines.push("", `✅ ${SITE_CONFIG.name}`);

  return lines.join("\n");
}

export function getWhatsAppChatUrl(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${SITE_CONFIG.whatsapp}${text}`;
}

export function getPhoneUrl(): string {
  return `tel:${SITE_CONFIG.phone}`;
}
