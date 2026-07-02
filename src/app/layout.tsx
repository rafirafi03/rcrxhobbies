import Providers from "../components/Providers";
import type { Metadata } from "next";
import { Barlow, Rajdhani } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "../lib/sanity/queries";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.contact.name || "RCRX Hobbies";
  const tagline = settings?.contact.tagline || "Premium RC Machines";
  const description =
    settings?.seo.siteDescription ||
    "Kerala's premier destination for high-performance remote control machines.";

  return {
    title: `${name} | ${tagline}`,
    description,
    keywords: settings?.seo.keywords?.split(",").map((k) => k.trim()) || [
      "RC cars",
      "remote control cars",
      "drift RC",
      "off-road RC",
      "Kochi",
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${rajdhani.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
