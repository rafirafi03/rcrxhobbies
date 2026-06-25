"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import type { ReelItem } from "@/types";

interface ReelPlayerModalProps {
  reel: ReelItem | null;
  onClose: () => void;
}

export default function ReelPlayerModal({ reel, onClose }: ReelPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!reel) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 150);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [reel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {reel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Playing reel: ${reel.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-[min(100%,22rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-lg active:bg-slate-100"
              aria-label="Close reel player"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              <div className="relative aspect-[9/16] bg-black">
                <video
                  ref={videoRef}
                  key={reel.id}
                  src={reel.videoUrl}
                  poster={reel.thumbnail}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="border-t border-white/10 bg-slate-900 px-4 py-3">
                <p className="text-sm font-semibold text-white">{reel.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{reel.views} views</p>
                {reel.instagramUrl && (
                  <Link
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                    View on Instagram
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
