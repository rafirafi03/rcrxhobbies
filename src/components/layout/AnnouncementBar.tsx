"use client";

import { SITE_CONFIG } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getPhoneUrl } from "@/lib/whatsapp";

const trustItems = [
  "24/7 Support",
  "Secure Payments",
  "Best Prices",
  "RC Expert Support",
  "WhatsApp Ordering",
  `Free Shipping ${formatPrice(SITE_CONFIG.freeShippingThreshold)}+`,
];

export default function AnnouncementBar() {
  return (
    <div className="border-b border-accent-muted bg-accent-light">
      <div className="page-container flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-accent-dark sm:text-[0.8125rem]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold">Need Assistance?</span>
          <a href={getPhoneUrl()} className="font-medium hover:underline">
            {SITE_CONFIG.phoneDisplay}
          </a>
          <span className="hidden text-muted sm:inline">|</span>
          <a href={`mailto:${SITE_CONFIG.email}`} className="hidden font-medium hover:underline sm:inline">
            {SITE_CONFIG.email}
          </a>
        </div>
      </div>

      <div className="overflow-hidden border-t border-accent-muted/60 bg-white py-2">
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
    </div>
  );
}
