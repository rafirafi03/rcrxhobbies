"use client";

import { motion } from "framer-motion";
import InstagramReels from "../sections/InstagramReels";
import Reviews from "../sections/Reviews";
import PageHero from "../ui/PageHero";
import { EmptyState } from "../ui/ContentState";
import type { AboutContent as AboutCms, ReelItem, Review } from "../../types";

interface AboutPageContentProps {
  about?: AboutCms | null;
  reels: ReelItem[];
  reviews: Review[];
}

export default function AboutContent({ about, reels, reviews }: AboutPageContentProps) {
  const hasStory =
    about?.storyParagraphs?.length ||
    about?.values?.length ||
    about?.promiseQuote;

  return (
    <>
      <PageHero
        label={about?.heroLabel || "About Us"}
        title={about?.heroTitle || "Our Story"}
        description={
          about?.heroDescription ||
          "Learn more about our passion for premium RC machines and hobby culture."
        }
        image={about?.heroImage}
      />

      {hasStory ? (
        <>
          <section className="py-20 lg:py-28">
            <div className="page-container">
              <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                {about?.storyParagraphs?.length ? (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="red-line mb-6" />
                    <h2 className="luxury-heading text-3xl sm:text-4xl">
                      {about.storyTitle || "Our Story"}
                    </h2>
                    <div className="mt-6 space-y-5 text-[0.9375rem] leading-[1.85] text-muted">
                      {about.storyParagraphs.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>
                ) : null}

                {about?.values?.length ? (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className={`grid grid-cols-2 gap-4 ${!about?.storyParagraphs?.length ? "lg:col-span-2" : ""}`}
                  >
                    {about.values.map((item) => (
                      <div key={item.title} className="border border-border p-6 lg:p-8">
                        <p className="luxury-heading text-2xl text-accent">{item.title}</p>
                        <p className="mt-2 text-sm text-muted">{item.description}</p>
                      </div>
                    ))}
                  </motion.div>
                ) : null}
              </div>
            </div>
          </section>

          {about?.promiseQuote ? (
            <section className="border-y border-border bg-accent-light/30 py-20">
              <div className="page-container text-center">
                <div className="red-line mx-auto mb-6" />
                {about.promiseLabel ? (
                  <p className="luxury-label mb-4">{about.promiseLabel}</p>
                ) : null}
                <h2 className="luxury-heading mx-auto max-w-3xl text-3xl sm:text-4xl">
                  &ldquo;{about.promiseQuote}&rdquo;
                </h2>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="py-20 lg:py-28">
          <div className="page-container">
            <EmptyState
              title="About content coming soon"
              description="Add your story, values, and promise in the admin site settings."
            />
          </div>
        </section>
      )}

      <InstagramReels variant="page" reels={reels} />
      <Reviews reviews={reviews} />
    </>
  );
}
