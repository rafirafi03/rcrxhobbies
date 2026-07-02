import { formatPrice } from "./format";
import { getCartProducts, calculateOrderSummary, formatOrderSummaryLines } from "./cart";
import { getProductById } from "./catalog";
import type { CartItem, CheckoutData, Product } from "../types";

export function buildCartOrderMessage(
  items: CartItem[],
  products: Product[],
  checkout: CheckoutData,
  storeName: string
): string {
  const cartProducts = getCartProducts(items, products);
  const summary = calculateOrderSummary(items, products, checkout.promoCode);

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
    `✅ Order via ${storeName} Store`,
    `📅 ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
  );

  return lines.filter((l) => l !== "").join("\n");
}

export function getWhatsAppCartOrderUrl(
  items: CartItem[],
  products: Product[],
  checkout: CheckoutData,
  whatsapp: string,
  storeName: string
): string {
  const message = encodeURIComponent(buildCartOrderMessage(items, products, checkout, storeName));
  return `https://wa.me/${whatsapp}?text=${message}`;
}

export function buildQuickOrderMessage(
  productId: string,
  products: Product[],
  quantity: number,
  name: string,
  phone: string,
  address: string,
  storeName: string,
  notes?: string
): string {
  const product = getProductById(products, productId);
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
  lines.push("", `✅ ${storeName}`);

  return lines.join("\n");
}

export function getWhatsAppChatUrl(whatsapp: string, message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${whatsapp}${text}`;
}

export function getPhoneUrl(phone: string): string {
  return `tel:${phone}`;
}
