import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { SITE_CONFIG } from "@/lib/constants";
import { getPhoneUrl, getWhatsAppChatUrl } from "@/lib/whatsapp";
import { categories } from "@/data/categories";
import { getCategoryPath } from "@/lib/products";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-900 pb-20 text-slate-300 lg:pb-0">
      <div className="page-container py-12 sm:py-16">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="text-xs font-bold text-white">RC</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">{SITE_CONFIG.name}</p>
                <p className="text-xs text-slate-400">Premium RC Hobbies</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="mb-4 text-sm font-semibold text-white">Pages</p>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-sm font-semibold text-white">Categories</p>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={getCategoryPath(cat.slug)}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-sm font-semibold text-white">Contact</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href={getPhoneUrl()} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-3.5 w-3.5" /> {SITE_CONFIG.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={getWhatsAppChatUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  WhatsApp Inquiry
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {SITE_CONFIG.address}
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-3.5 w-3.5" /> {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  <InstagramIcon className="h-3.5 w-3.5" /> @rcrxhobbies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">White · Blue · Precision</p>
        </div>
      </div>
    </footer>
  );
}
