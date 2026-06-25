import ContactContent from "@/components/pages/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RCRX Hobbies",
  description: "Visit our showroom in Kochi or reach us via phone, WhatsApp, or email.",
};

export default function ContactPage() {
  return <ContactContent />;
}
