"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { galleryItems } from "@/data/gallery";
import AppImage from "@/components/ui/AppImage";

export default function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const activeItem = galleryItems.find((item) => item.id === lightbox);

  return (
    <section id="gallery" className="section-y bg-surface">
      <div className="page-container">
        <SectionHeading
          label="Visual Archive"
          title="Moments in Motion"
          description="A curated glimpse into the world of precision RC — from track days to off-road expeditions."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                delay: i * 0.06,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={
                i === 0 || i === 5 ? "col-span-2 row-span-2" : ""
              }
            >
              <button
                onClick={() => setLightbox(item.id)}
                className="block h-full w-full text-left"
              >
                <Card interactive className="flex h-full flex-col">
                  <CardMedia
                    className={
                      i === 0 || i === 5
                        ? "aspect-square"
                        : "aspect-square"
                    }
                  >
                    <AppImage
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-600 [.ui-card-interactive:hover_&]:scale-[1.04]"
                    />
                    <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-white/95 text-foreground sm:top-4 sm:right-4 sm:h-9 sm:w-9 sm:opacity-0 sm:transition-opacity [.ui-card-interactive:hover_&]:sm:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </CardMedia>
                  <CardBody className="flex-1 !p-3 sm:!p-4">
                    <p className="text-[0.5625rem] font-semibold tracking-[0.16em] text-accent uppercase sm:text-[0.625rem] sm:tracking-[0.18em]">
                      {item.category}
                    </p>
                    <p className="luxury-heading mt-1 line-clamp-2 text-base leading-snug sm:mt-1.5 sm:text-lg">
                      {item.title}
                    </p>
                  </CardBody>
                </Card>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative max-h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AppImage
                src={activeItem.image}
                alt={activeItem.title}
                width={1200}
                height={900}
                className="max-h-[85vh] w-full object-contain"
              />
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <p className="text-[0.625rem] tracking-[0.2em] text-white/60 uppercase">
                  {activeItem.category}
                </p>
                <p className="luxury-heading mt-1 text-2xl text-white">
                  {activeItem.title}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 p-2 text-white/80 transition-colors hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
