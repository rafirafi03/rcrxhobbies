"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className={`mb-10 sm:mb-14 lg:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <div className={`mb-5 flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
        <div className={`h-0.5 w-10 ${light ? "bg-white/60" : "bg-accent"}`} />
        <span className={`luxury-label ${light ? "!text-white/80" : ""}`}>{label}</span>
        {align === "center" && <div className={`h-0.5 w-10 ${light ? "bg-white/60" : "bg-accent"}`} />}
      </div>
      <h2 className={`luxury-heading text-[1.75rem] sm:text-4xl lg:text-5xl ${light ? "text-white" : ""}`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mx-auto mt-3 max-w-xl text-[0.875rem] leading-relaxed sm:mt-4 sm:text-[0.9375rem] ${
            align === "center" ? "" : "mx-0"
          } ${light ? "text-white/60" : "text-muted"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
