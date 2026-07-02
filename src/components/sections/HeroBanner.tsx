"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { HeroBanner as HeroBannerType } from "../../types";
import AppImage from "../ui/AppImage";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

export default function HeroBanner({ banners }: { banners: HeroBannerType[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const paused = useRef(false);

  const count = banners.length;

  const goTo = useCallback((next: number) => {
    if (count === 0) return;
    setDirection(next > index ? 1 : -1);
    setIndex((next + count) % count);
  }, [index, count]);

  const next = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const prev = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => {
      if (!paused.current) {
        setDirection(1);
        setIndex((i) => (i + 1) % count);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  const slide = banners[index];
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    paused.current = true;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    paused.current = false;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
  }

  return (
    <section className="bg-surface-soft pb-1 pt-3 sm:pb-2 sm:pt-4">
      <div className="page-container">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-slate-900 shadow-lg"
          onMouseEnter={() => {
            paused.current = true;
          }}
          onMouseLeave={() => {
            paused.current = false;
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative h-[168px] sm:h-[220px] md:h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={slide.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <AppImage
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-dark/85 via-accent-dark/45 to-accent-dark/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-dark/50 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-10">
                  <h2 className="max-w-[14rem] text-lg font-bold leading-tight text-white sm:max-w-md sm:text-2xl md:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="mt-1.5 max-w-[12rem] text-xs text-white/85 sm:mt-2 sm:max-w-sm sm:text-sm">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.href}
                    className="hero-banner-cta mt-3 inline-flex w-fit items-center gap-1.5 sm:mt-4"
                  >
                    {slide.cta}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={prev}
            className="tap-target absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 text-foreground shadow-md active:bg-white sm:flex"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="tap-target absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 text-foreground shadow-md active:bg-white sm:flex"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
