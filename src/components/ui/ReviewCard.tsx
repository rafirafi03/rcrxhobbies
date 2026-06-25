"use client";

import { motion } from "framer-motion";
import type { Review } from "@/types";

export default function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <article className="flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {review.avatar}
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <span
                key={j}
                className={`text-sm ${j < review.rating ? "text-accent" : "text-border"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <blockquote className="flex-1 text-sm leading-relaxed text-muted">
          &ldquo;{review.comment}&rdquo;
        </blockquote>

        <footer className="mt-4 border-t border-border pt-4">
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="mt-0.5 text-xs text-muted">
            {review.product} · {review.date}
          </p>
        </footer>
      </article>
    </motion.div>
  );
}
