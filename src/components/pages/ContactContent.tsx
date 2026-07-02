"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Clock, Mail } from "lucide-react";
import PageHero from "../ui/PageHero";
import { EmptyState } from "../ui/ContentState";
import { useSiteConfig, useSiteData } from "../../context/SiteDataContext";
import { getPhoneUrl, getWhatsAppChatUrl } from "../../lib/whatsapp";

export default function ContactContent() {
  const site = useSiteConfig();
  const { settings } = useSiteData();
  const mapEmbedUrl = settings.map.embedUrl || site.mapEmbedUrl;

  const contactItems = [
    { icon: MapPin, label: "Address", value: site.address, href: null as string | null },
    { icon: Phone, label: "Phone", value: site.phoneDisplay, href: getPhoneUrl(site.phone) },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us instantly",
      href: getWhatsAppChatUrl(site.whatsapp),
      external: true,
    },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Hours", value: site.hours, href: null as string | null },
  ].filter((item) => item.value);

  const hasContact = contactItems.length > 0;

  return (
    <>
      <PageHero
        label="Contact"
        title="We'd Love to Hear From You"
        description="Visit our showroom, call us directly, or send a WhatsApp message. We're here to help."
      />

      <section className="py-20 lg:py-28">
        <div className="page-container">
          {!hasContact ? (
            <EmptyState
              title="Contact details not configured"
              description="Add phone, email, and address in admin site settings."
            />
          ) : (
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="red-line mb-6" />
                <h2 className="luxury-heading mb-10 text-3xl">Get in Touch</h2>

                <ul className="space-y-0">
                  {contactItems.map((item, i) => (
                    <li
                      key={item.label}
                      className={`flex items-start gap-5 py-7 ${
                        i < contactItems.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent-light text-accent">
                        <item.icon className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[0.6875rem] tracking-[0.15em] text-muted uppercase">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={"external" in item && item.external ? "_blank" : undefined}
                            rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                            className="mt-1.5 block text-[0.9375rem] text-foreground transition-colors hover:text-accent"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1.5 text-[0.9375rem] leading-relaxed">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-4">
                  {site.phone ? (
                    <a href={getPhoneUrl(site.phone)} className="luxury-btn-outline">
                      <Phone className="h-4 w-4" /> Call Now
                    </a>
                  ) : null}
                  {site.whatsapp ? (
                    <a
                      href={getWhatsAppChatUrl(site.whatsapp, "Hello, I'd like to get in touch.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="luxury-btn-primary"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp Us
                    </a>
                  ) : null}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative min-h-[420px] overflow-hidden border border-border lg:min-h-full"
              >
                {mapEmbedUrl ? (
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "480px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={settings.map.mapTitle || `${site.name} Location`}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <div className="flex h-full min-h-[480px] items-center justify-center p-8">
                    <EmptyState
                      title="Map not available"
                      description="Add a map embed URL in admin site settings."
                    />
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
