"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { getReelPlayback } from "@/lib/reels";
import { formatCompactCount } from "@/lib/format";
import { reels, REELS_INSTAGRAM_PROFILE } from "@/data/reels";
import type { ReelItem } from "@/types";

interface InstagramReelsProps {
  variant?: "home" | "page";
}

interface ReelMedia {
  thumbnailUrl: string | null;
  videoUrl: string | null;
  viewCount: number | null;
}

const reelEase = [0.25, 0.46, 0.45, 0.94] as const;

const reelListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const reelCardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: reelEase },
  },
};

function formatViewLabel(
  viewCount: number | null,
  manualCount?: number,
  fallback?: string
): string | null {
  const count = viewCount ?? manualCount ?? null;
  if (count != null) return `${formatCompactCount(count)} views`;
  if (fallback) return fallback;
  return null;
}

function ReelCard({
  reel,
  isActive,
  isPlaying,
  onPlay,
  onStop,
  emphasizeActive = true,
  className = "",
}: {
  reel: ReelItem;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  emphasizeActive?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [media, setMedia] = useState<ReelMedia>({
    thumbnailUrl: reel.thumbnail ?? null,
    videoUrl: reel.videoUrl ?? null,
    viewCount: reel.viewCount ?? null,
  });
  const [loading, setLoading] = useState(!reel.thumbnail);
  const [pendingPlay, setPendingPlay] = useState(false);

  const playback = getReelPlayback(reel, media.videoUrl);
  const thumbnail = media.thumbnailUrl ?? reel.thumbnail ?? "";
  const videoSrc = playback?.type === "video" ? playback.src : null;
  const viewLabel = formatViewLabel(media.viewCount, reel.viewCount, reel.views);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/instagram-reel?url=${encodeURIComponent(reel.reelUrl)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ReelMedia | null) => {
        if (cancelled || !data) return;
        setMedia((prev) => ({
          thumbnailUrl: data.thumbnailUrl ?? prev.thumbnailUrl,
          videoUrl: data.videoUrl ?? prev.videoUrl ?? reel.videoUrl ?? null,
          viewCount: data.viewCount ?? prev.viewCount,
        }));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reel.reelUrl, reel.thumbnail, reel.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    if (isPlaying || pendingPlay) {
      video.currentTime = 0;
      void video.play().catch(() => {});
      if (pendingPlay) setPendingPlay(false);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isPlaying, pendingPlay, videoSrc]);

  const handleStop = useCallback(() => {
    setPendingPlay(false);
    onStop();
  }, [onStop]);

  const handlePlay = useCallback(() => {
    if (videoSrc) {
      onPlay();
      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = 0;
        void video.play().catch(() => {});
      });
      return;
    }

    onPlay();
    if (playback?.type === "instagram") return;
    setPendingPlay(true);
  }, [onPlay, playback, videoSrc]);

  const showVideo = Boolean((isPlaying || pendingPlay) && videoSrc);
  const showEmbed = isPlaying && !videoSrc && playback?.type === "instagram";
  const showOverlay = !(isPlaying || pendingPlay);

  return (
    <motion.article
      variants={reelCardVariants}
      animate={
        emphasizeActive
          ? {
              scale: isActive || isPlaying ? 1 : 0.88,
              opacity: isActive || isPlaying ? 1 : 0.45,
            }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.35, ease: reelEase }}
      className={
        className ||
        (emphasizeActive ? "w-[11.5rem] shrink-0 snap-center sm:w-[12.5rem]" : "w-full")
      }
    >
      <div
        className={`group relative aspect-[9/16] overflow-hidden rounded-2xl bg-slate-900 shadow-sm ring-1 ring-black/10 transition-shadow duration-300 md:hover:shadow-md ${
          isPlaying || pendingPlay ? "ring-2 ring-accent shadow-md" : ""
        }`}
      >
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={thumbnail || undefined}
            playsInline
            preload="metadata"
            controls={showVideo}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ${
              showVideo ? "z-20 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          />
        )}

        {showEmbed && (
          <iframe
            key={playback.embedUrl}
            src={`${playback.embedUrl}?autoplay=1`}
            title={reel.title}
            className="absolute inset-0 z-20 h-full w-full border-0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            scrolling="no"
          />
        )}

        <AnimatePresence>
          {(isPlaying || pendingPlay) && (
            <motion.button
              key="close"
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={handleStop}
              className="absolute top-2 right-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
              aria-label="Close reel"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showOverlay && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: reelEase }}
              className="absolute inset-0"
            >
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img
                  src={thumbnail}
                  alt={reel.title}
                  className="h-full w-full object-cover md:transition-transform md:duration-500 md:group-hover:scale-105"
                  loading="eager"
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: reelEase }}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-800">
                  {loading ? (
                    <motion.span
                      className="h-8 w-8 rounded-full bg-slate-600"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : (
                    <InstagramIcon className="h-8 w-8 text-slate-500" />
                  )}
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3 }}
                className="absolute top-2.5 left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-sm"
              >
                <InstagramIcon className="h-3.5 w-3.5 text-foreground" />
              </motion.div>

              <button
                type="button"
                onClick={handlePlay}
                disabled={!playback}
                className="absolute inset-0 z-10 flex items-center justify-center disabled:cursor-not-allowed"
                aria-label={`Play ${reel.title}`}
              >
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-lg sm:h-12 sm:w-12"
                >
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </motion.span>
              </button>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35, ease: reelEase }}
                className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-10"
              >
                <div className="mb-1 h-2.5">
                  {viewLabel ? (
                    <p className="text-[0.625rem] font-semibold tracking-wide text-white/90 uppercase">
                      {viewLabel}
                    </p>
                  ) : loading ? (
                    <span className="block h-2.5 w-14 rounded bg-white/30" />
                  ) : null}
                </div>
                <p className="line-clamp-2 text-[0.6875rem] font-semibold leading-tight text-white sm:text-xs">
                  {reel.title}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

const REEL_COUNT = reels.length;
const LOOP_COPIES = 3;
const MIDDLE_START = REEL_COUNT;

const loopItems = Array.from({ length: LOOP_COPIES }, (_, copy) =>
  reels.map((reel) => ({ reel, copy, key: `${copy}-${reel.id}` }))
).flat();

function ReelsDesktopRow({
  playingId,
  onPlay,
  onStop,
}: {
  playingId: string | null;
  onPlay: (id: string) => void;
  onStop: () => void;
}) {
  return (
    <motion.div
      className="hidden gap-5 lg:grid lg:grid-cols-3 xl:grid-cols-5"
      variants={reelListVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {reels.map((reel) => (
        <ReelCard
          key={reel.id}
          reel={reel}
          isActive={false}
          emphasizeActive={false}
          isPlaying={playingId === reel.id}
          onPlay={() => onPlay(reel.id)}
          onStop={onStop}
        />
      ))}
    </motion.div>
  );
}

function ReelsMobileCarousel({
  playingId,
  onPlay,
  onStop,
}: {
  playingId: string | null;
  onPlay: (id: string) => void;
  onStop: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const jumpLockRef = useRef(false);
  const [activePhysicalIndex, setActivePhysicalIndex] = useState(MIDDLE_START);
  const activeLogicalIndex = activePhysicalIndex % REEL_COUNT;

  const scrollToPhysicalIndex = useCallback(
    (physicalIndex: number, smooth = false) => {
      const track = scrollRef.current;
      const item = itemRefs.current[physicalIndex];
      if (!track || !item) return;

      const target =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;

      jumpLockRef.current = !smooth;
      track.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
      if (!smooth) {
        requestAnimationFrame(() => {
          jumpLockRef.current = false;
        });
      }
    },
    []
  );

  const reconcileLoop = useCallback(
    (physicalIndex: number) => {
      // Keep one clone card on each side so peeking past the ends does not snap back.
      if (physicalIndex < REEL_COUNT - 1) {
        scrollToPhysicalIndex(physicalIndex + REEL_COUNT, false);
        setActivePhysicalIndex(physicalIndex + REEL_COUNT);
        return;
      }

      if (physicalIndex > REEL_COUNT * 2) {
        scrollToPhysicalIndex(physicalIndex - REEL_COUNT, false);
        setActivePhysicalIndex(physicalIndex - REEL_COUNT);
      }
    },
    [scrollToPhysicalIndex]
  );

  const findClosestPhysicalIndex = useCallback(() => {
    const track = scrollRef.current;
    if (!track) return MIDDLE_START;

    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = MIDDLE_START;
    let minDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(center - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    return closest;
  }, []);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      scrollToPhysicalIndex(MIDDLE_START, false);
    });
  }, [scrollToPhysicalIndex]);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track) return;

    let frame = 0;

    const onScroll = () => {
      if (jumpLockRef.current) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const closest = findClosestPhysicalIndex();
        setActivePhysicalIndex(closest);

        if (closest < REEL_COUNT - 1 || closest > REEL_COUNT * 2) {
          reconcileLoop(closest);
        }
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [findClosestPhysicalIndex, reconcileLoop]);

  const scrollToLogicalIndex = useCallback(
    (logicalIndex: number) => {
      scrollToPhysicalIndex(logicalIndex + MIDDLE_START, true);
      setActivePhysicalIndex(logicalIndex + MIDDLE_START);
    },
    [scrollToPhysicalIndex]
  );

  return (
    <div className="relative lg:hidden">
      <motion.div
        ref={scrollRef}
        className="-mx-4 flex items-center gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-4 pb-3 pt-1 snap-x snap-mandatory scrollbar-none touch-pan-x sm:-mx-6 sm:gap-4 sm:px-6 md:-mx-0 md:px-0"
        variants={reelListVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {loopItems.map(({ reel, key }, index) => (
          <div
            key={key}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="shrink-0 snap-center"
          >
            <ReelCard
              reel={reel}
              isActive={index === activePhysicalIndex}
              isPlaying={playingId === reel.id}
              onPlay={() => onPlay(reel.id)}
              onStop={onStop}
            />
          </div>
        ))}
      </motion.div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {reels.map((reel, index) => (
          <button
            key={reel.id}
            type="button"
            onClick={() => scrollToLogicalIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeLogicalIndex
                ? "w-5 bg-accent"
                : "w-1.5 bg-border hover:bg-accent/40"
            }`}
            aria-label={`Go to reel ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function InstagramReels({ variant = "page" }: InstagramReelsProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const isHome = variant === "home";

  return (
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
            description="Real reel thumbnails — tap play to watch instantly."
            href={REELS_INSTAGRAM_PROFILE}
            linkText="Follow Us"
          />
        ) : (
          <SectionHeading
            label="Instagram"
            title="Behind the Wheel"
            description="Tap play to watch reels instantly in the feed."
          />
        )}

        <ReelsMobileCarousel
          playingId={playingId}
          onPlay={setPlayingId}
          onStop={() => setPlayingId(null)}
        />
        <ReelsDesktopRow
          playingId={playingId}
          onPlay={setPlayingId}
          onStop={() => setPlayingId(null)}
        />

        {!isHome && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: reelEase }}
            className="mt-14 text-center"
          >
            <Link
              href={REELS_INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn-outline group inline-flex"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              Follow on Instagram
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
