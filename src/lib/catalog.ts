import type { Product, ShopFilters, SortOption } from "../types";
import type { Category, SiteSettings } from "../types";

export function getProductPath(id: string): string {
  return `/products/${id}`;
}

export function getCategoryPath(slug: string): string {
  return `/category/${slug}`;
}

export function getCategoriesPath(): string {
  return "/categories";
}

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryNames(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function slugToCategoryName(categories: Category[], slug: string): string | undefined {
  return categories.find((c) => c.slug === slug)?.name;
}

export function getProductsByCategorySlug(
  products: Product[],
  categories: Category[],
  slug: string
): Product[] {
  const category = slugToCategoryName(categories, slug);
  if (!category) return [];
  return products.filter((p) => p.category === category || p.categorySlug === slug);
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getRelatedProducts(products: Product[], product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.sku.toLowerCase().includes(q)
  );
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        const badgeOrder = (p: Product) =>
          p.badge === "Bestseller" ? 3 : p.badge === "New" ? 2 : p.badge === "Popular" ? 1 : 0;
        return badgeOrder(b) - badgeOrder(a);
      });
  }
}

export function filterProducts(products: Product[], filters: ShopFilters): Product[] {
  let result = products;

  if (filters.search) {
    result = searchProducts(result, filters.search);
  }

  if (filters.category && filters.category !== "All") {
    result = result.filter((p) => p.category === filters.category);
  }

  result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  return sortProducts(result, filters.sort);
}

export function getFeaturedProducts(products: Product[], limit = 8): Product[] {
  const featured = products.filter((p) => p.featured);
  const source = featured.length > 0 ? featured : products;
  return sortProducts(source, "featured").slice(0, limit);
}

export function getCategoryProductCount(
  products: Product[],
  categories: Category[],
  slug: string
): number {
  return getProductsByCategorySlug(products, categories, slug).length;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  seo: {
    siteTitle: "RCRX Hobbies",
    siteDescription: "Premium RC cars and hobby gear in Kerala, India.",
  },
  contact: {
    name: "RCRX Hobbies",
    tagline: "Premium RC Cars & Parts",
    phone: "",
    phoneDisplay: "",
    whatsapp: "",
    email: "",
    address: "",
    hours: "",
  },
  map: {},
};

export const SHIPPING_CONFIG = {
  freeShippingThreshold: 10000,
  standardShipping: 199,
  currency: "INR",
} as const;
