export interface Product {
  id: string;
  name: string;
  category: string;
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
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
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

export interface ReelItem {
  id: string;
  thumbnail: string;
  title: string;
  views: string;
  videoUrl: string;
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
