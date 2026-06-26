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
  Wrench,
  RotateCcw,
  MapPin,
  HelpCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { faqs } from "@/data/faq";
import { getWhatsAppChatUrl } from "@/lib/whatsapp";

const faqIcons: Record<string, LucideIcon> = {
  order: ShoppingBag,
  whatsapp: MessageCircle,
  shipping: Truck,
  payment: CreditCard,
  beginners: Car,
  parts: Wrench,
  returns: RotateCcw,
  store: MapPin,
};

const reelEase = [0.25, 0.46, 0.45, 0.94] as const;

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: reelEase }}
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-accent/25 bg-white shadow-md shadow-accent/5 ring-1 ring-accent/10"
          : "border-border bg-white/90 shadow-sm hover:border-accent/15 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        id={`faq-${id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left sm:gap-4 sm:p-5"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11 ${
            isOpen ? "bg-accent text-white" : "bg-accent-light text-accent"
          }`}
        >
          <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1 pt-0.5">
          <span className="block text-sm font-semibold leading-snug text-foreground sm:text-base">
            {question}
          </span>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 block text-sm leading-relaxed text-muted sm:text-[0.9375rem]"
                id={`faq-panel-${id}`}
                role="region"
                aria-labelledby={`faq-${id}`}
              >
                {answer}
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            isOpen ? "bg-accent text-white" : "bg-neutral-100 text-muted"
          }`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
    </motion.div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-border bg-gradient-to-b from-accent-light/40 via-white to-white pb-10 pt-8 sm:pb-12 sm:pt-10"
    >
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="page-container relative">
        <div className="lg:grid lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-10 xl:gap-14">
          {/* Intro + CTA — sticky on desktop */}
          <div className="mb-8 lg:sticky lg:top-28 lg:mb-0">
            <p className="luxury-label text-xs sm:text-sm">FAQ</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Got Questions?
              <span className="mt-1 block text-accent">We&apos;ve Got Answers</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              Everything you need to know about ordering RC models, delivery across India, and
              visiting our Kochi store.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <p className="text-2xl font-bold text-accent">{faqs.length}</p>
                <p className="mt-0.5 text-xs font-medium text-muted">Help topics</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                <p className="text-2xl font-bold text-accent">24/7</p>
                <p className="mt-0.5 text-xs font-medium text-muted">WhatsApp support</p>
              </div>
            </div>

            <div className="mt-6 hidden flex-col gap-2.5 lg:flex">
              <a
                href={getWhatsAppChatUrl("Hi, I have a question about RCRX Hobbies.")}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn-primary justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
              <Link href="/contact" className="luxury-btn-outline justify-center">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Accordion list */}
          <div className="space-y-3 sm:space-y-3.5">
            {faqs.map((item, index) => (
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

        {/* Mobile CTA */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-br from-accent to-accent-hover p-5 text-white shadow-lg shadow-accent/20 lg:hidden">
          <p className="text-lg font-bold">Still need help?</p>
          <p className="mt-1 text-sm text-white/85">
            Chat with our team — we&apos;ll help you find the perfect RC setup.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={getWhatsAppChatUrl("Hi, I have a question about RCRX Hobbies.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-accent"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
