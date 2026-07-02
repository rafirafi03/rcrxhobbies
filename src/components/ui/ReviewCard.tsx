"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review } from "../../types";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${iconClass} ${
            index < Math.round(rating) ? "fill-accent text-accent" : "fill-transparent text-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({
  review,
  index = 0,
  variant = "default",
}: {
  review: Review;
  index?: number;
  variant?: "default" | "product";
}) {
  const isProductPage = variant === "product";
  const initials = (review.avatar || review.name.slice(0, 2)).slice(0, 2).toUpperCase();

  const content = (
    <article className="flex h-full flex-col rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold tracking-wide text-white sm:h-11 sm:w-11 sm:text-sm">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground sm:text-base">{review.name}</p>
              <p className="mt-0.5 text-xs text-muted">{review.date}</p>
            </div>
            <StarRating rating={review.rating} />
          </div>

          {!isProductPage && review.product ? (
            <p className="mt-1.5 line-clamp-1 text-xs text-muted-light">{review.product}</p>
          ) : null}
        </div>
      </div>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">
        {review.comment}
      </blockquote>
    </article>
  );

  if (isProductPage) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      {content}
    </motion.div>
  );
}

export function ReviewSummary({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-accent-light/40 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold leading-none text-foreground">{rating.toFixed(1)}</span>
        <StarRating rating={rating} size="md" />
      </div>
      <span className="text-sm text-muted">
        {count} review{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}
