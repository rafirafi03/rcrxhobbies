import type { SiteSettings } from "../types";
import { SHIPPING_CONFIG } from "./catalog";

export function getSiteConfig(settings: SiteSettings) {
  return {
    name: settings.contact.name,
    tagline: settings.contact.tagline,
    description: settings.seo.siteDescription,
    phone: settings.contact.phone,
    phoneDisplay: settings.contact.phoneDisplay,
    whatsapp: settings.contact.whatsapp,
    email: settings.contact.email,
    instagram: settings.contact.instagram || "",
    address: settings.contact.address,
    mapEmbedUrl: settings.map.embedUrl || "",
    hours: settings.contact.hours,
    freeShippingThreshold: SHIPPING_CONFIG.freeShippingThreshold,
    standardShipping: SHIPPING_CONFIG.standardShipping,
    currency: SHIPPING_CONFIG.currency,
  };
}

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "rating", label: "Top Rated" },
] as const;
