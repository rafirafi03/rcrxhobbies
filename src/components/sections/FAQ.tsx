"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  Car,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { FaqSection } from "../../types";
import { useSiteConfig } from "../../context/SiteDataContext";
import { getWhatsAppChatUrl } from "../../lib/whatsapp";
import { EmptyState } from "../ui/ContentState";

const faqIcons: Record<string, LucideIcon> = {
  order: ShoppingBag,
  whatsapp: MessageCircle,
  shipping: Truck,
  payment: CreditCard,
  beginners: Car,
};

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function FAQItem({
  id,
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  id: string;
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = faqIcons[id] ?? HelpCircle;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-16px" }}
      transition={{ delay: index * 0.04, duration: 0.35, ease }}
      className={`faq-item ${isOpen ? "is-open" : ""}`}
    >
      <button
        type="button"
        id={`faq-${id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        onClick={onToggle}
        className="faq-trigger"
      >
        <span className="faq-index" aria-hidden>
          {num}
        </span>

        <span className="faq-icon">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1 text-left">
          <span className="font-display block text-sm font-semibold leading-snug text-foreground sm:text-[0.9375rem]">
            {question}
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-250 ${isOpen ? "rotate-180 text-accent" : ""}`}
          strokeWidth={2.25}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="faq-answer-wrap"
          >
            <p
              id={`faq-panel-${id}`}
              role="region"
              aria-labelledby={`faq-${id}`}
              className="faq-answer"
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ({ faq }: { faq?: FaqSection | null }) {
  const site = useSiteConfig();
  const items = faq?.items ?? [];
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <section
      id="faq"
      className="border-t border-border bg-white pb-10 pt-8 sm:pb-12 sm:pt-10"
    >
      <div className="page-container">
        <div className="lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start lg:gap-12 xl:gap-16">
          <div className="mb-8 lg:sticky lg:top-28 lg:mb-0">
            <p className="luxury-label text-xs sm:text-sm">{faq?.sectionLabel || "FAQ"}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {faq?.sectionTitle || "Got Questions?"}
              <span className="mt-1 block text-accent">{faq?.sectionTitleAccent || "We've Got Answers"}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              {faq?.sectionDescription || "Quick answers on ordering, delivery, and picking your first RC model."}
            </p>

            <p className="mt-5 font-display text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              {items.length} topics · 24/7 WhatsApp
            </p>

            <div className="mt-6 hidden flex-col gap-2.5 lg:flex">
              {site.whatsapp ? (
                <a
                  href={getWhatsAppChatUrl(site.whatsapp, "Hi, I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn-primary justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              ) : null}
              <Link href="/contact" className="luxury-btn-outline justify-center">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {items.map((item, index) => (
              <FAQItem
                key={item.id}
                id={item.id}
                index={index}
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
              />
            ))}
          </div>
        </div>

        <div className="faq-cta-shell mt-8 lg:hidden">
          <div className="faq-cta-banner border border-white/20 bg-gradient-to-br from-primary to-accent p-5 text-white">
            <div className="faq-cta-banner__lines" aria-hidden />
            <div className="relative z-[1]">
              <p className="font-display text-xs font-bold tracking-[0.22em] text-white/70 uppercase">
                Pit stop
              </p>
              <p className="mt-1 text-lg font-bold">Still need help?</p>
              <p className="mt-1 text-sm text-white/85">
                Message us on WhatsApp — we&apos;ll help you find the right RC setup.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                {site.whatsapp ? (
                  <a
                    href={getWhatsAppChatUrl(site.whatsapp, "Hi, I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-accent"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                ) : null}
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
