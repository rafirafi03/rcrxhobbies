"use client";

import { formatPrice } from "../../lib/format";
import { SHIPPING_CONFIG } from "../../lib/catalog";

const trustItems = (freeShippingThreshold: number) => [
  "24/7 Support",
  "Secure Payments",
  "Best Prices",
  "RC Expert Support",
  "WhatsApp Ordering",
  `Free Shipping ${formatPrice(freeShippingThreshold)}+`,
];

export default function TrustMarquee() {
  const items = trustItems(SHIPPING_CONFIG.freeShippingThreshold);

  return (
    <div className="overflow-hidden border-b border-border bg-surface-soft py-2.5">
      <div className="flex">
        <div className="trust-marquee-track flex shrink-0 items-center">
          {[...items, ...items].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex shrink-0 items-center px-6 text-xs font-medium text-muted"
            >
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
