import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Clock,
  MessageCircle,
  Navigation,
  Gauge,
  Users,
  Layers,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { getWhatsAppChatUrl } from "@/lib/whatsapp";
import { IMG } from "@/lib/images";
import AppImage from "@/components/ui/AppImage";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONFIG.address)}`;

const experience = [
  { icon: Gauge, title: "Live demos", desc: "Try models in-store" },
  { icon: Users, title: "Expert team", desc: "Advice at every level" },
  { icon: Layers, title: "Full range", desc: "Cars, parts & upgrades" },
];

export default function BrandCTA() {
  return (
    <section
      className="store-showcase"
      aria-labelledby="store-showcase-heading"
    >
      <div className="page-container">
        <div className="store-showcase__shell">
          <div className="store-showcase__card group">
            <div className="store-showcase__visual">
              <AppImage
                src={IMG.racing}
                alt="RCRX showroom in Kochi"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <div className="store-showcase__visual-overlay" aria-hidden />
              <span className="store-showcase__watermark" aria-hidden>
                KOCHI
              </span>
              <div className="store-showcase__visual-tag">
                <span className="store-showcase__live" aria-hidden />
                Official Showroom
              </div>
            </div>

            <div className="store-showcase__panel">
              <div className="store-showcase__panel-lines" aria-hidden />

              <p className="luxury-label text-xs">RCRX Experience Centre</p>
              <h2
                id="store-showcase-heading"
                className="store-showcase__title luxury-heading mt-2"
              >
                Experience RC.
                <span className="text-accent"> In person.</span>
              </h2>
              <p className="store-showcase__lead">
                Visit our Kochi showroom to explore RC cars and hobby gear with hands-on demos
                and guidance from the {SITE_CONFIG.name} team.
              </p>

              <dl className="store-showcase__specs">
                <div className="store-showcase__spec">
                  <dt>
                    <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Location
                  </dt>
                  <dd>Kochi, Kerala</dd>
                </div>
                <div className="store-showcase__spec">
                  <dt>
                    <Clock className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Hours
                  </dt>
                  <dd>{SITE_CONFIG.hours}</dd>
                </div>
                <div className="store-showcase__spec">
                  <dt>
                    <MessageCircle className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Support
                  </dt>
                  <dd>24/7 WhatsApp</dd>
                </div>
              </dl>

              <p className="store-showcase__address">
                <MapPin className="inline h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                {SITE_CONFIG.address}
              </p>

              <ul className="store-showcase__experience">
                {experience.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="store-showcase__experience-item">
                    <span className="store-showcase__experience-icon">
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div>
                      <p className="store-showcase__experience-title">{title}</p>
                      <p className="store-showcase__experience-desc">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="store-showcase__actions">
                <Link href="/contact" className="luxury-btn-primary store-showcase__btn">
                  Plan your visit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn-outline store-showcase__btn !border-accent !text-accent hover:!bg-accent hover:!text-white"
                >
                  <Navigation className="h-4 w-4" />
                  Directions
                </a>
                <a
                  href={getWhatsAppChatUrl("Hi, I'd like to visit your Kochi showroom.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-showcase__link"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
