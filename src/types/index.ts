export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  specs: string[];
  features: string[];
  badge?: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface HeroBanner {
  id: string;
  image: string;
  videoUrl?: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon?: string;
}

export interface FaqSection {
  sectionLabel?: string;
  sectionTitle?: string;
  sectionTitleAccent?: string;
  sectionDescription?: string;
  items: FaqItem[];
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutContent {
  heroLabel?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  storyTitle?: string;
  storyParagraphs?: string[];
  values?: AboutValue[];
  promiseLabel?: string;
  promiseQuote?: string;
}

export interface SiteSettings {
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords?: string;
    ogImage?: string;
  };
  contact: {
    name: string;
    tagline: string;
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    email: string;
    instagram?: string;
    address: string;
    hours: string;
  };
  map: {
    embedUrl?: string;
    mapTitle?: string;
  };
  about?: AboutContent;
  faq?: FaqSection;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  product: string;
  productId?: string;
  date: string;
  avatar: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
}

/** @deprecated Gallery is not in CMS — kept for type compatibility */

export interface ReelItem {
  id: string;
  title: string;
  /** Optional manual play/view count when Instagram does not expose it publicly */
  viewCount?: number;
  /** Optional fallback label when live view count is unavailable */
  views?: string;
  /** Paste Instagram reel or post URL — plays inline on the website */
  reelUrl: string;
  /** Optional manual cover image (auto-fetched from Instagram when omitted) */
  thumbnail?: string;
  /** Optional direct MP4/WebM URL (used when reelUrl is not Instagram) */
  videoUrl?: string;
  /** Link for "View on Instagram" (defaults to reelUrl) */
  instagramUrl?: string;
}

export interface CheckoutData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
  promoCode: string;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "rating"
  | "newest";

export interface ShopFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  search: string;
  sort: SortOption;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  promoApplied: string | null;
}
