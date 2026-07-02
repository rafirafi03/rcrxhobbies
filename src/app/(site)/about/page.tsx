import AboutContent from "../../../components/pages/AboutContent";
import { getActiveReels, getPublishedReviews, getSiteSettings } from "../../../lib/sanity/queries";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const about = settings?.about;
  return {
    title: about?.heroTitle ? `${about.heroTitle} | ${settings?.contact.name || "RCRX Hobbies"}` : "About Us | RCRX Hobbies",
    description:
      about?.heroDescription ||
      settings?.seo.siteDescription ||
      "Learn about our passion for premium RC machines.",
  };
}

export default async function AboutPage() {
  const [settings, reels, reviews] = await Promise.all([
    getSiteSettings(),
    getActiveReels(),
    getPublishedReviews(12),
  ]);

  return <AboutContent about={settings?.about} reels={reels} reviews={reviews} />;
}
