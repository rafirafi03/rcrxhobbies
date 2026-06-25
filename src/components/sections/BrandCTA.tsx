import Link from "next/link";
import { ArrowRight, MapPin, Headphones, Eye, Car } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { getWhatsAppChatUrl } from "@/lib/whatsapp";
import { IMG } from "@/lib/images";
import AppImage from "@/components/ui/AppImage";

const highlights = [
  { icon: MapPin, title: "Kochi Store", desc: "Visit and explore products in person." },
  { icon: Headphones, title: "Trusted Support", desc: "Online and offline help for hobby buyers." },
  { icon: Eye, title: "Hands-on Experience", desc: "See RC models before you buy." },
  { icon: Car, title: "RC & Collectibles", desc: "Cars, crawlers, trucks and models." },
];

export default function BrandCTA() {
  return (
    <section className="section-y bg-accent-light/40">
      <div className="page-container">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[220px] lg:min-h-[400px]">
              <AppImage
                src={IMG.racing}
                alt="RCRX racing collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/70 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-accent-dark/20" />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold text-accent">RCRX Kochi</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Visit our RC hobby store in Kochi
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                Explore RC cars, crawlers, and hobby products in person. Get hands-on
                experience backed by {SITE_CONFIG.name} expert support.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3 rounded-xl bg-accent-light/60 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="mt-0.5 text-xs text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="luxury-btn-primary w-full justify-center sm:w-auto">
                  Visit Store
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn-outline w-full justify-center sm:w-auto"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
