import { cache } from "react";
import { sanityRead } from "./client";
import {
  mapCategory,
  mapHeroBanner,
  mapProduct,
  mapReel,
  mapReview,
  mapSiteSettings,
  type SanityCategoryRow,
  type SanityHeroRow,
  type SanityProductRow,
  type SanityReelRow,
  type SanityReviewRow,
  type SanitySiteSettingsRow,
} from "./mappers";
import type { Category, HeroBanner, Product, ReelItem, Review, SiteSettings } from "../../types";

const PRODUCT_FIELDS = `_id, name, slug, price, compareAtPrice, description, longDescription,
  specs, features, badge, inStock, stockCount, sku, rating, reviewCount, tags, featured,
  image, images, "category": category->{ name, slug }`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  seo { siteTitle, siteDescription, keywords, ogImage },
  contact { name, tagline, phone, phoneDisplay, whatsapp, email, instagram, address, hours },
  map { embedUrl, mapTitle },
  about {
    heroLabel, heroTitle, heroDescription, heroImage,
    storyTitle, storyParagraphs, values[]{ title, description },
    promiseLabel, promiseQuote
  },
  faq {
    sectionLabel, sectionTitle, sectionTitleAccent, sectionDescription,
    items[]{ id, question, answer, icon }
  }
}`;

const REVIEW_FIELDS = `_id, name, rating, comment, dateLabel, avatar, "product": product->name, "productId": product->slug.current`;

export class CmsError extends Error {
  constructor(message = "Failed to load content") {
    super(message);
    this.name = "CmsError";
  }
}

async function fetchOrThrow<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityRead.fetch<T>(query, params ?? {});
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const row = await fetchOrThrow<SanitySiteSettingsRow | null>(SITE_SETTINGS_QUERY);
  return mapSiteSettings(row);
});

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const rows = await fetchOrThrow<SanityProductRow[]>(
    `*[_type == "product"] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`
  );
  return rows.map(mapProduct).filter((p): p is Product => p !== null);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const row = await fetchOrThrow<SanityProductRow | null>(
    `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`,
    { slug }
  );
  return row ? mapProduct(row) : null;
});

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const rows = await fetchOrThrow<SanityCategoryRow[]>(
    `*[_type == "category"] | order(name asc) { _id, name, slug, description, image }`
  );
  return rows.map(mapCategory).filter((c): c is Category => c !== null);
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const row = await fetchOrThrow<SanityCategoryRow | null>(
    `*[_type == "category" && slug.current == $slug][0] { _id, name, slug, description, image }`,
    { slug }
  );
  return row ? mapCategory(row) : null;
});

export const getActiveHeroBanners = cache(async (): Promise<HeroBanner[]> => {
  const rows = await fetchOrThrow<SanityHeroRow[]>(
    `*[_type == "heroBanner" && isActive != false] | order(order asc) {
      _id, title, subtitle, image, video, href, cta
    }`
  );
  return rows.map(mapHeroBanner).filter((b): b is HeroBanner => b !== null);
});

export const getActiveReels = cache(async (): Promise<ReelItem[]> => {
  const rows = await fetchOrThrow<SanityReelRow[]>(
    `*[_type == "reel" && isActive != false] | order(order asc) {
      _id, title, reelUrl, viewCount, viewsLabel
    }`
  );
  return rows.map(mapReel).filter((r): r is ReelItem => r !== null);
});

export const getPublishedReviews = cache(async (limit = 12): Promise<Review[]> => {
  const rows = await fetchOrThrow<SanityReviewRow[]>(
    `*[_type == "review" && isPublished != false] | order(_createdAt desc)[0...$limit] { ${REVIEW_FIELDS} }`,
    { limit }
  );
  return rows.map(mapReview);
});

export const getReviewsForProductSlug = cache(async (productSlug: string): Promise<Review[]> => {
  const rows = await fetchOrThrow<SanityReviewRow[]>(
    `*[_type == "review" && isPublished != false && product->slug.current == $productSlug] | order(_createdAt desc) { ${REVIEW_FIELDS} }`,
    { productSlug }
  );
  return rows.map(mapReview);
});

export const getProductSlugs = cache(async (): Promise<string[]> => {
  const rows = await fetchOrThrow<{ slug?: { current?: string } }[]>(
    `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
  );
  return rows.map((r) => r.slug?.current).filter((s): s is string => Boolean(s));
});

export const getCategorySlugs = cache(async (): Promise<string[]> => {
  const rows = await fetchOrThrow<{ slug?: { current?: string } }[]>(
    `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`
  );
  return rows.map((r) => r.slug?.current).filter((s): s is string => Boolean(s));
});

export interface SiteCatalog {
  products: Product[];
  categories: Category[];
  settings: SiteSettings | null;
}

export const loadSiteCatalog = cache(async (): Promise<SiteCatalog> => {
  const [products, categories, settings] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getSiteSettings(),
  ]);
  return { products, categories, settings };
});
