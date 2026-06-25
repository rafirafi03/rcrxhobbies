"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import AppImage from "@/components/ui/AppImage";
import ReelPlayerModal from "@/components/sections/ReelPlayerModal";
import { SITE_CONFIG } from "@/lib/constants";
import { reels } from "@/data/reels";
import type { ReelItem } from "@/types";

interface InstagramReelsProps {
  variant?: "home" | "page";
}

function ReelCard({
  reel,
  index,
  onPlay,
  compact,
}: {
  reel: ReelItem;
  index: number;
  onPlay: (reel: ReelItem) => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onPlay(reel)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-16px" }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`group w-[9.5rem] shrink-0 snap-center text-left sm:w-auto ${
        compact ? "" : "h-full"
      }`}
      aria-label={`Play reel: ${reel.title}`}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow active:border-accent/40 sm:group-hover:shadow-md">
        <div className="relative aspect-[9/16] overflow-hidden bg-slate-100">
          <AppImage
            src={reel.thumbnail}
            alt={reel.title}
            fill
            sizes="(max-width: 640px) 40vw, 15vw"
            className="object-cover transition-transform duration-300 sm:group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
          <div className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm">
            <InstagramIcon className="h-3.5 w-3.5 text-foreground" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-accent shadow-md transition-transform sm:group-hover:scale-110">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
          </div>
          <p className="absolute right-2 bottom-2 left-2 line-clamp-2 text-[0.6875rem] font-semibold leading-tight text-white">
            {reel.title}
          </p>
        </div>
        <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
          <p className="text-[0.625rem] font-semibold tracking-wide text-muted uppercase">
            {reel.views} views
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default function InstagramReels({ variant = "page" }: InstagramReelsProps) {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const isHome = variant === "home";

  return (
    <>
      <section
        id="reels"
        className={
          isHome
            ? "border-t border-border bg-accent-light/30 pb-8 pt-6 sm:pb-10 sm:pt-8"
            : "bg-background py-24 sm:py-32"
        }
      >
        <div className="page-container">
          {isHome ? (
            <SectionHeader
              label="Instagram Reels"
              title="RC Cars in Action"
              description="Tap a reel to watch racing highlights right here on the site."
              href={SITE_CONFIG.instagram}
              linkText="Follow Us"
            />
          ) : (
            <SectionHeading
              label="Instagram"
              title="Behind the Wheel"
              description="Watch RC and racing highlights. Tap any reel to play on the site."
            />
          )}

          {/* Mobile: horizontal scroll · Desktop: grid */}
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5 lg:gap-5">
            {reels.map((reel, i) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                index={i}
                compact={isHome}
                onPlay={setActiveReel}
              />
            ))}
          </div>

          {!isHome && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-14 text-center"
            >
              <Link
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn-outline group inline-flex"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                Follow @rcrxhobbies
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <ReelPlayerModal reel={activeReel} onClose={() => setActiveReel(null)} />
    </>
  );
}
