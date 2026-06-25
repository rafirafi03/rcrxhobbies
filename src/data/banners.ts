import { BANNER_IMG } from "@/lib/images";

export interface HeroBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}

export const heroBanners: HeroBanner[] = [
  {
    id: "premium-rc",
    image: BANNER_IMG.premium,
    title: "Premium RC Cars & Parts",
    subtitle: "Curated machines for drift, off-road, and track.",
    href: "/shop",
    cta: "Shop Now",
  },
  {
    id: "drift-collection",
    image: BANNER_IMG.drift,
    title: "Drift & On-Road Legends",
    subtitle: "Precision builds for smooth slides and top speed.",
    href: "/category/drift-rc",
    cta: "Explore Drift RC",
  },
  {
    id: "off-road",
    image: BANNER_IMG.offroad,
    title: "Off-Road & Rock Crawlers",
    subtitle: "Built for trails, jumps, and extreme terrain.",
    href: "/category/off-road",
    cta: "Browse Off-Road",
  },
  {
    id: "whatsapp-order",
    image: BANNER_IMG.contact,
    title: "Order via WhatsApp",
    subtitle: "Fast support and seamless ordering across Kerala.",
    href: "/contact",
    cta: "Contact Us",
  },
];
