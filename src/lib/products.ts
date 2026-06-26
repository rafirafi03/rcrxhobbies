import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ShopFilters, SortOption } from "@/types";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): string | undefined {
  const fromData = categories.find((c) => c.slug === slug);
  if (fromData) return fromData.name;
  return getCategories().find((c) => categoryToSlug(c) === slug);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const category = slugToCategory(slug);
  if (!category) return [];
  return products.filter((p) => p.category === category);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
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
        const badgeOrder = (p: Product) =>
          p.badge === "Bestseller" ? 3 : p.badge === "New" ? 2 : p.badge === "Popular" ? 1 : 0;
        return badgeOrder(b) - badgeOrder(a);
      });
  }
}

export function filterProducts(filters: ShopFilters): Product[] {
  let result = products;

  if (filters.search) {
    result = searchProducts(filters.search);
  }

  if (filters.category && filters.category !== "All") {
    result = result.filter((p) => p.category === filters.category);
  }

  result = result.filter(
    (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
  );

  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  return sortProducts(result, filters.sort);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return sortProducts(products, "featured").slice(0, limit);
}

export function getProductPath(id: string): string {
  return `/products/${id}`;
}

export function getCategoryPath(slug: string): string {
  return `/category/${slug}`;
}

export function getCategoriesPath(): string {
  return "/categories";
}

export function getCategoryProductCount(slug: string): number {
  return getProductsByCategorySlug(slug).length;
}
