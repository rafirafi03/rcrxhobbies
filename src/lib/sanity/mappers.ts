import type {
  AboutContent,
  Category,
  FaqSection,
  HeroBanner,
  Product,
  ReelItem,
  Review,
} from "../../types";
import { imageUrl, fileUrl } from "./image";

interface SanityImage {
  asset?: { _ref?: string };
}

interface SanitySlug {
  current?: string;
}

interface SanityProductRow {
  _id: string;
  name?: string;
  slug?: SanitySlug;
  price?: number;
  compareAtPrice?: number;
  description?: string;
  longDescription?: string;
  specs?: string[];
  features?: string[];
  badge?: string;
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  featured?: boolean;
  image?: SanityImage;
  images?: SanityImage[];
  category?: { name?: string; slug?: SanitySlug };
}

interface SanityCategoryRow {
  _id: string;
  name?: string;
  slug?: SanitySlug;
  description?: string;
  image?: SanityImage;
}

interface SanityHeroRow {
  _id: string;
  title?: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  image?: SanityImage;
  video?: { asset?: { _ref?: string } };
}

interface SanityReelRow {
  _id: string;
  title?: string;
  reelUrl?: string;
  viewCount?: number;
  viewsLabel?: string;
}

interface SanityReviewRow {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  dateLabel: string;
  avatar?: string;
  product?: string;
  productId?: string;
}

interface SanitySiteSettingsRow {
  seo?: {
    siteTitle?: string;
    siteDescription?: string;
    keywords?: string;
    ogImage?: SanityImage;
  };
  contact?: {
    name?: string;
    tagline?: string;
    phone?: string;
    phoneDisplay?: string;
    whatsapp?: string;
    email?: string;
    instagram?: string;
    address?: string;
    hours?: string;
  };
  map?: {
    embedUrl?: string;
    mapTitle?: string;
  };
  about?: {
    heroLabel?: string;
    heroTitle?: string;
    heroDescription?: string;
    heroImage?: SanityImage;
    storyTitle?: string;
    storyParagraphs?: string[];
    values?: { title?: string; description?: string }[];
    promiseLabel?: string;
    promiseQuote?: string;
  };
  faq?: {
    sectionLabel?: string;
    sectionTitle?: string;
    sectionTitleAccent?: string;
    sectionDescription?: string;
    items?: { id?: string; question?: string; answer?: string; icon?: string }[];
  };
}

export function mapProduct(row: SanityProductRow): Product | null {
  const slug = row.slug?.current;
  if (!slug || !row.name) return null;

  const gallery = (row.images || [])
    .map((img) => imageUrl(img, 1200))
    .filter(Boolean);
  const mainImage = imageUrl(row.image, 1200) || gallery[0] || "";

  return {
    id: slug,
    name: row.name,
    category: row.category?.name || "Uncategorized",
    categorySlug: row.category?.slug?.current,
    price: row.price ?? 0,
    originalPrice: row.compareAtPrice && row.compareAtPrice > (row.price ?? 0) ? row.compareAtPrice : undefined,
    image: mainImage,
    images: gallery.length > 0 ? gallery : mainImage ? [mainImage] : [],
    description: row.description || "",
    longDescription: row.longDescription || row.description || "",
    specs: row.specs || [],
    features: row.features || [],
    badge: row.badge || undefined,
    inStock: row.inStock ?? true,
    stockCount: row.stockCount ?? 0,
    sku: row.sku || "",
    rating: row.rating ?? 0,
    reviewCount: row.reviewCount ?? 0,
    tags: row.tags || [],
    featured: row.featured ?? false,
  };
}

export function mapCategory(row: SanityCategoryRow): Category | null {
  const slug = row.slug?.current;
  if (!slug || !row.name) return null;
  return {
    slug,
    name: row.name,
    description: row.description || "",
    image: imageUrl(row.image, 800),
  };
}

export function mapHeroBanner(row: SanityHeroRow): HeroBanner | null {
  if (!row.title) return null;
  const image = imageUrl(row.image, 1920);
  if (!image) return null;
  return {
    id: row._id,
    image,
    videoUrl: row.video?.asset?._ref ? fileUrl(row.video.asset._ref) : undefined,
    title: row.title,
    subtitle: row.subtitle || "",
    href: row.href || "/shop",
    cta: row.cta || "Shop Now",
  };
}

export function mapReel(row: SanityReelRow): ReelItem | null {
  if (!row.reelUrl || !row.title) return null;
  return {
    id: row._id,
    title: row.title,
    reelUrl: row.reelUrl,
    viewCount: row.viewCount ?? undefined,
    views: row.viewsLabel || undefined,
    instagramUrl: row.reelUrl,
  };
}

export function mapReview(row: SanityReviewRow): Review {
  return {
    id: row._id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    product: row.product || "",
    productId: row.productId,
    date: row.dateLabel,
    avatar: row.avatar || row.name.slice(0, 2).toUpperCase(),
  };
}

export function mapSiteSettings(row: SanitySiteSettingsRow | null) {
  if (!row) return null;

  const about: AboutContent | undefined = row.about
    ? {
        heroLabel: row.about.heroLabel,
        heroTitle: row.about.heroTitle,
        heroDescription: row.about.heroDescription,
        heroImage: row.about.heroImage ? imageUrl(row.about.heroImage, 1600) : undefined,
        storyTitle: row.about.storyTitle,
        storyParagraphs: row.about.storyParagraphs || [],
        values: (row.about.values || [])
          .filter((v) => v.title && v.description)
          .map((v) => ({ title: v.title!, description: v.description! })),
        promiseLabel: row.about.promiseLabel,
        promiseQuote: row.about.promiseQuote,
      }
    : undefined;

  const faq: FaqSection | undefined = row.faq?.items?.length
    ? {
        sectionLabel: row.faq.sectionLabel,
        sectionTitle: row.faq.sectionTitle,
        sectionTitleAccent: row.faq.sectionTitleAccent,
        sectionDescription: row.faq.sectionDescription,
        items: row.faq.items
          .filter((item) => item.id && item.question && item.answer)
          .map((item) => ({
            id: item.id!,
            question: item.question!,
            answer: item.answer!,
            icon: item.icon,
          })),
      }
    : undefined;

  return {
    seo: {
      siteTitle: row.seo?.siteTitle || row.contact?.name || "RCRX Hobbies",
      siteDescription: row.seo?.siteDescription || "",
      keywords: row.seo?.keywords,
      ogImage: row.seo?.ogImage ? imageUrl(row.seo.ogImage, 1200) : undefined,
    },
    contact: {
      name: row.contact?.name || "RCRX Hobbies",
      tagline: row.contact?.tagline || "",
      phone: row.contact?.phone || "",
      phoneDisplay: row.contact?.phoneDisplay || row.contact?.phone || "",
      whatsapp: row.contact?.whatsapp || "",
      email: row.contact?.email || "",
      instagram: row.contact?.instagram,
      address: row.contact?.address || "",
      hours: row.contact?.hours || "",
    },
    map: {
      embedUrl: row.map?.embedUrl,
      mapTitle: row.map?.mapTitle,
    },
    about,
    faq,
  };
}

export type {
  SanityProductRow,
  SanityCategoryRow,
  SanityHeroRow,
  SanityReelRow,
  SanityReviewRow,
  SanitySiteSettingsRow,
};
