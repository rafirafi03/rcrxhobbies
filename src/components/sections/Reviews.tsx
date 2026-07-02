"use client";

import SectionHeading from "../ui/SectionHeading";
import ReviewCard from "../ui/ReviewCard";
import { EmptyState } from "../ui/ContentState";
import type { Review } from "../../types";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <section id="reviews" className="bg-accent-light/30 py-24 lg:py-32">
        <div className="page-container">
          <SectionHeading
            label="Testimonials"
            title="Voices of Excellence"
            description="Real feedback from enthusiasts who trust our collection."
          />
          <EmptyState
            title="No reviews yet"
            description="Published customer reviews will appear here once added in admin."
          />
        </div>
      </section>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="bg-accent-light/30 py-24 lg:py-32">
      <div className="page-container">
        <SectionHeading
          label="Testimonials"
          title="Voices of Excellence"
          description={`${avgRating.toFixed(1)} average rating from ${reviews.length} enthusiast${reviews.length !== 1 ? "s" : ""}.`}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
