import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

const trustItems = [
  "24/7 Support",
  "Secure Payments",
  "Best Prices",
  "RC Expert Support",
  "WhatsApp Ordering",
  `Free Shipping ${formatPrice(SITE_CONFIG.freeShippingThreshold)}+`,
];

export default function TrustMarquee() {
  return (
    <div className="overflow-hidden border-b border-border bg-white py-2">
      <div className="flex">
        <div className="trust-marquee-track flex shrink-0 items-center">
          {[...trustItems, ...trustItems].map((item, i) => (
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
