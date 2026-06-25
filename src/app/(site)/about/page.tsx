import AboutContent from "@/components/pages/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | RCRX Hobbies",
  description: "Learn about RCRX Hobbies — Kerala's premier destination for premium RC cars since 2020.",
};

export default function AboutPage() {
  return <AboutContent />;
}
