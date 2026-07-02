"use client";

import { motion } from "framer-motion";
import AppImage from "./AppImage";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
  image?: string;
  compact?: boolean;
}

export default function PageHero({
  label,
  title,
  description,
  image,
  compact = false,
}: PageHeroProps) {
  if (image) {
    return (
      <section className="relative overflow-hidden bg-accent-dark">
        <div className="absolute inset-0">
          <AppImage src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-dark via-accent-dark/90 to-accent/70" />
        </div>
        <div className={`page-container relative ${compact ? "py-12 lg:py-16" : "py-16 lg:py-24"}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="luxury-label text-white/70">{label}</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">{description}</p>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className={`border-b border-border bg-accent-light/50 ${compact ? "py-10" : "py-14"}`}>
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="luxury-label">{label}</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{description}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
