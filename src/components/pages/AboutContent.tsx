"use client";

import { motion } from "framer-motion";
import Gallery from "@/components/sections/Gallery";
import InstagramReels from "@/components/sections/InstagramReels";
import Reviews from "@/components/sections/Reviews";
import PageHero from "@/components/ui/PageHero";
import { SITE_CONFIG } from "@/lib/constants";
import { IMG } from "@/lib/images";

export default function AboutContent() {
  return (
    <>
      <PageHero
        label="About Us"
        title="Driven by Passion, Defined by Quality"
        description="RCRX Hobbies is Kerala's premier destination for high-performance remote control machines."
        image={IMG.racing}
      />

      <section className="py-20 lg:py-28">
        <div className="page-container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="red-line mb-6" />
              <h2 className="luxury-heading text-3xl sm:text-4xl">Our Story</h2>
              <div className="mt-6 space-y-5 text-[0.9375rem] leading-[1.85] text-muted">
                <p>
                  Founded in 2020 in Kochi, RCRX Hobbies began with a simple mission: to bring
                  the world&apos;s finest RC machines to enthusiasts who demand more than
                  off-the-shelf toys.
                </p>
                <p>
                  Every model in our collection is hand-selected, tested, and supported by our
                  team of passionate RC experts. From drift circuits to rock crawling trails,
                  we equip riders at every level.
                </p>
                <p>
                  We believe ordering should be effortless — that&apos;s why every purchase flows
                  through WhatsApp with white-glove personal service. No complicated checkout,
                  just direct communication with people who love RC as much as you do.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { title: "Curated", desc: "Only premium, tested models" },
                { title: "Expert", desc: "RC specialists on every order" },
                { title: "Direct", desc: "WhatsApp ordering & support" },
                { title: "Local", desc: "Based in Kochi, serving India" },
              ].map((item) => (
                <div key={item.title} className="border border-border p-6 lg:p-8">
                  <p className="luxury-heading text-2xl text-accent">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-accent-light/30 py-20">
        <div className="page-container text-center">
          <div className="red-line mx-auto mb-6" />
          <p className="luxury-label mb-4">Our Promise</p>
          <h2 className="luxury-heading mx-auto max-w-3xl text-3xl sm:text-4xl">
            &ldquo;{SITE_CONFIG.description}&rdquo;
          </h2>
        </div>
      </section>

      <Gallery />
      <InstagramReels />
      <Reviews />
    </>
  );
}
