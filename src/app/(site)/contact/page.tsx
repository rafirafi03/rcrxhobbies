import ContactContent from "../../../components/pages/ContactContent";
import { getSiteSettings } from "../../../lib/sanity/queries";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.contact.name || "RCRX Hobbies";
  return {
    title: `Contact | ${name}`,
    description:
      settings?.contact.address
        ? `Visit our showroom at ${settings.contact.address} or reach us via phone, WhatsApp, or email.`
        : "Get in touch with us via phone, WhatsApp, or email.",
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
