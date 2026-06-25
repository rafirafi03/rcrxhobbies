"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Clock, Mail } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { SITE_CONFIG } from "@/lib/constants";
import { getPhoneUrl, getWhatsAppChatUrl } from "@/lib/whatsapp";

export default function ContactContent() {
  return (
    <>
      <PageHero
        label="Contact"
        title="We'd Love to Hear From You"
        description="Visit our showroom, call us directly, or send a WhatsApp message. We're here to help."
      />

      <section className="py-20 lg:py-28">
        <div className="page-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="red-line mb-6" />
              <h2 className="luxury-heading mb-10 text-3xl">Get in Touch</h2>

              <ul className="space-y-0">
                {[
                  { icon: MapPin, label: "Address", value: SITE_CONFIG.address, href: null },
                  { icon: Phone, label: "Phone", value: SITE_CONFIG.phoneDisplay, href: getPhoneUrl() },
                  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us instantly", href: getWhatsAppChatUrl(), external: true },
                  { icon: Mail, label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                  { icon: Clock, label: "Hours", value: SITE_CONFIG.hours, href: null },
                ].map((item, i) => (
                  <li
                    key={item.label}
                    className={`flex items-start gap-5 py-7 ${
                      i < 4 ? "border-b border-border" : ""
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
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
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
                <a href={getPhoneUrl()} className="luxury-btn-outline">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href={getWhatsAppChatUrl("Hello, I'd like to get in touch.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn-primary"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative min-h-[420px] overflow-hidden border border-border lg:min-h-full"
            >
              <iframe
                src={SITE_CONFIG.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "480px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RCRX Hobbies Location"
                className="absolute inset-0 h-full w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
