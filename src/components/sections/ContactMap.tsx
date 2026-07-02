"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Clock, Mail, ArrowUpRight } from "lucide-react";
import { getPhoneUrl, getWhatsAppChatUrl } from "../../lib/whatsapp";
import SectionHeading from "../ui/SectionHeading";
import { EmptyState } from "../ui/ContentState";
import { useSiteConfig, useSiteData } from "../../context/SiteDataContext";

export default function ContactMap() {
  const site = useSiteConfig();
  const { settings } = useSiteData();
  const mapEmbedUrl = settings.map.embedUrl || site.mapEmbedUrl;

  const contactItems = [
    site.address
      ? { icon: MapPin, label: "Address", content: site.address, href: null as string | null }
      : null,
    site.phoneDisplay
      ? {
          icon: Phone,
          label: "Telephone",
          content: site.phoneDisplay,
          href: getPhoneUrl(site.phone),
        }
      : null,
    site.whatsapp
      ? {
          icon: MessageCircle,
          label: "WhatsApp",
          content: "Private inquiry line",
          href: getWhatsAppChatUrl(site.whatsapp),
          external: true,
        }
      : null,
    site.email
      ? {
          icon: Mail,
          label: "Email",
          content: site.email,
          href: `mailto:${site.email}`,
        }
      : null,
    site.hours ? { icon: Clock, label: "Hours", content: site.hours, href: null as string | null } : null,
  ].filter(Boolean) as Array<{
    icon: typeof MapPin;
    label: string;
    content: string;
    href: string | null;
    external?: boolean;
  }>;

  return (
    <section id="contact" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          label="Visit Us"
          title="The Showroom"
          description="Experience our collection in person. We welcome enthusiasts by appointment."
        />

        {contactItems.length === 0 ? (
          <EmptyState
            title="Contact details not configured"
            description="Add contact information in admin site settings."
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-0">
                {contactItems.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex items-start gap-5 py-6 ${
                      i < contactItems.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-[0.6875rem] tracking-[0.15em] text-muted uppercase">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="group mt-1.5 flex items-center gap-2 text-[0.9375rem] text-foreground transition-colors hover:text-accent"
                        >
                          {item.content}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                      ) : (
                        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-foreground">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                {site.phone ? (
                  <a href={getPhoneUrl(site.phone)} className="luxury-btn-outline flex-1 justify-center">
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                ) : null}
                {site.whatsapp ? (
                  <a
                    href={getWhatsAppChatUrl(site.whatsapp, "Hello, I'd like to schedule a visit.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-btn-accent flex-1 justify-center"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Inquire
                  </a>
                ) : null}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-square overflow-hidden bg-neutral-100 lg:aspect-auto lg:min-h-[500px]"
            >
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={settings.map.mapTitle || `${site.name} Store Location`}
                  className="absolute inset-0 h-full w-full grayscale-[30%] transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full min-h-[500px] items-center justify-center p-8">
                  <EmptyState title="Map not available" description="Add a map embed URL in admin." />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
