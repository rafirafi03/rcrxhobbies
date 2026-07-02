"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Loader2, Volume2, VolumeX, RotateCcw } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import SectionHeading from "../ui/SectionHeading";
import { getReelVideoSrc } from "../../lib/reels";
import { formatCompactCount } from "../../lib/format";
import type { ReelItem } from "../../types";
import { EmptyState } from "../ui/ContentState";

interface ReelsSectionProps {
  variant?: "home" | "page";
  reels: ReelItem[];
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
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
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

function ReelPlayerModal({
  reel,
  poster,
  onClose,
}: {
  reel: ReelItem;
  poster?: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [muted, setMuted] = useState(true);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);

  const videoSrc = useMemo(() => getReelVideoSrc(reel), [reel]);
  const viewLabel = formatViewLabel(reel.viewCount ?? null, reel.viewCount, reel.views);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    setStatus(videoSrc ? "loading" : "error");
    setMuted(true);
    setShowUnmuteHint(true);
  }, [videoSrc, attempt]);

  const handleCanPlay = useCallback(() => {
    setStatus("ready");
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {
      setStatus("error");
    });
  }, []);

  const handleVideoError = useCallback(() => {
    setStatus("error");
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) setShowUnmuteHint(false);
    void video.play().catch(() => {});
  }, []);

  const handleRetry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/90 p-0 backdrop-blur-md sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${reel.title}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease: reelEase }}
        className="relative flex w-full max-w-[min(100%,22rem)] flex-col overflow-hidden rounded-t-3xl bg-neutral-950 shadow-2xl ring-1 ring-white/10 sm:max-w-sm sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
            />
          ) : null}

          {status === "loading" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/40 text-white">
              <Loader2 className="h-9 w-9 animate-spin text-white" />
              <p className="text-sm font-medium">Preparing video…</p>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 px-8 text-center text-white">
              <p className="text-base font-medium">Couldn&apos;t load this video</p>
              <p className="text-sm text-white/65">Check your connection and try again.</p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white/90"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
            </div>
          )}

          {videoSrc ? (
            <video
              ref={videoRef}
              key={`${videoSrc}-${attempt}`}
              src={videoSrc}
              poster={poster}
              playsInline
              muted={muted}
              controls
              preload="auto"
              className={`relative z-10 h-full w-full object-contain transition-opacity duration-300 ${
                status === "ready" ? "opacity-100" : "opacity-0"
              }`}
              onCanPlay={handleCanPlay}
              onLoadedData={handleCanPlay}
              onError={handleVideoError}
            />
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/70 to-transparent px-4 pb-10 pt-4">
            <div className="pointer-events-auto flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">{reel.title}</p>
                {viewLabel ? (
                  <p className="mt-1 text-[0.6875rem] font-medium tracking-wide text-white/70 uppercase">
                    {viewLabel}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {status === "ready" && muted && showUnmuteHint ? (
            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-neutral-900 shadow-lg transition-transform hover:scale-105"
            >
              <VolumeX className="h-3.5 w-3.5" />
              Tap to unmute
            </button>
          ) : null}

          {status === "ready" && !showUnmuteHint ? (
            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-20 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReelCard({
  reel,
  isActive,
  onPlay,
  emphasizeActive = true,
  className = "",
}: {
  reel: ReelItem;
  isActive: boolean;
  onPlay: (poster: string) => void;
  emphasizeActive?: boolean;
  className?: string;
}) {
  const [media, setMedia] = useState<ReelMedia>({
    thumbnailUrl: reel.thumbnail ?? null,
    videoUrl: reel.videoUrl ?? null,
    viewCount: reel.viewCount ?? null,
  });
  const [loading, setLoading] = useState(!reel.thumbnail);

  const thumbnail = media.thumbnailUrl ?? reel.thumbnail ?? "";
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

  return (
    <motion.article
      variants={reelCardVariants}
      animate={
        emphasizeActive
          ? { scale: isActive ? 1 : 0.88, opacity: isActive ? 1 : 0.45 }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.35, ease: reelEase }}
      className={
        className ||
        (emphasizeActive ? "w-[11.5rem] shrink-0 snap-center sm:w-[12.5rem]" : "w-full")
      }
    >
      <div className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-slate-900 shadow-sm ring-1 ring-black/10 transition-shadow duration-300 md:hover:shadow-md">
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={reel.title}
            className="h-full w-full object-cover md:transition-transform md:duration-500 md:group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-800">
            {loading ? (
              <span className="h-8 w-8 animate-pulse rounded-full bg-slate-600" />
            ) : (
              <Play className="h-8 w-8 text-slate-500" />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

        <button
          type="button"
          onClick={() => onPlay(thumbnail)}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label={`Play ${reel.title}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-lg transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </button>

        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-10">
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
        </div>
      </div>
    </motion.article>
  );
}

function ReelsDesktopRow({
  reels,
  onPlay,
}: {
  reels: ReelItem[];
  onPlay: (reel: ReelItem, poster: string) => void;
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
          onPlay={(poster) => onPlay(reel, poster)}
        />
      ))}
    </motion.div>
  );
}

function ReelsMobileCarousel({
  reels,
  onPlay,
}: {
  reels: ReelItem[];
  onPlay: (reel: ReelItem, poster: string) => void;
}) {
  const REEL_COUNT = reels.length;
  const LOOP_COPIES = 3;
  const MIDDLE_START = REEL_COUNT;
  const loopItems = Array.from({ length: LOOP_COPIES }, (_, copy) =>
    reels.map((reel) => ({ reel, copy, key: `${copy}-${reel.id}` }))
  ).flat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const jumpLockRef = useRef(false);
  const [activePhysicalIndex, setActivePhysicalIndex] = useState(MIDDLE_START);
  const activeLogicalIndex = activePhysicalIndex % REEL_COUNT;

  const scrollToPhysicalIndex = useCallback((physicalIndex: number, smooth = false) => {
    const track = scrollRef.current;
    const item = itemRefs.current[physicalIndex];
    if (!track || !item) return;

    const target = item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
    jumpLockRef.current = !smooth;
    track.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
    if (!smooth) {
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    }
  }, []);

  const reconcileLoop = useCallback(
    (physicalIndex: number) => {
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
              onPlay={(poster) => onPlay(reel, poster)}
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
              index === activeLogicalIndex ? "w-5 bg-accent" : "w-1.5 bg-border hover:bg-accent/40"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function InstagramReels({ variant = "page", reels }: ReelsSectionProps) {
  const [activeReel, setActiveReel] = useState<{ reel: ReelItem; poster: string } | null>(null);
  const isHome = variant === "home";

  const handlePlay = useCallback((reel: ReelItem, poster: string) => {
    setActiveReel({ reel, poster });
  }, []);

  if (reels.length === 0) {
    if (isHome) return null;
    return (
      <section className="bg-background py-24 sm:py-32">
        <div className="page-container">
          <EmptyState title="No videos yet" description="Videos added in admin will appear here." />
        </div>
      </section>
    );
  }

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
              label="Video Reels"
              title="RC Cars in Action"
              description="Watch our latest clips — tap play to watch."
            />
          ) : (
            <SectionHeading
              label="Videos"
              title="Behind the Wheel"
              description="Tap play to watch in full screen."
            />
          )}

          <ReelsMobileCarousel reels={reels} onPlay={handlePlay} />
          <ReelsDesktopRow reels={reels} onPlay={handlePlay} />
        </div>
      </section>

      <AnimatePresence>
        {activeReel ? (
          <ReelPlayerModal
            reel={activeReel.reel}
            poster={activeReel.poster || activeReel.reel.thumbnail}
            onClose={() => setActiveReel(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
