export const SITE_CONFIG = {
  name: "RCRX Hobbies",
  tagline: "Premium RC Cars & Parts",
  description:
    "Discover high-performance RC cars, drift machines, and off-road beasts. Order directly via WhatsApp.",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@rcrxhobbies.com",
  instagram: "https://instagram.com/rcrxhobbies",
  address: "123 RC Racing Avenue, Kochi, Kerala 682001, India",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8387!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnNTIuMyJOIDc2wrAxNicwMi4yIkU!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  hours: "Mon – Sat: 10:00 AM – 8:00 PM",
  freeShippingThreshold: 10000,
  standardShipping: 199,
  currency: "INR",
} as const;

export const PROMO_CODES: Record<
  string,
  { discount: number; label: string; minOrder?: number }
> = {
  RCRX10: { discount: 0.1, label: "10% off entire order" },
  WELCOME500: { discount: 500, label: "₹500 flat discount", minOrder: 5000 },
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "rating", label: "Top Rated" },
] as const;
