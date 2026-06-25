import type { ReelItem } from "@/types";

/**
 * Instagram reels on the home page.
 *
 * ADD A REEL (2 steps):
 * 1. Copy Instagram reel link → paste as `reelUrl`
 * 2. Set title — thumbnail + view count load automatically from Instagram
 *
 * Optional overrides in `reel()`:
 * - `viewCount` — manual play/view count from Instagram
 * - `thumbnail` — custom cover image URL
 * - `videoUrl` — custom MP4 path in `public/videos/reels/`
 */
const IG_PROFILE = "https://www.instagram.com/tonybenjo_rc_rx/";

function reel(
  id: string,
  reelUrl: string,
  title: string,
  extras?: Pick<ReelItem, "thumbnail" | "videoUrl" | "views" | "viewCount">
): ReelItem {
  return {
    id,
    reelUrl,
    title,
    videoUrl: extras?.videoUrl,
    thumbnail: extras?.thumbnail,
    views: extras?.views,
    viewCount: extras?.viewCount,
    instagramUrl: reelUrl,
  };
}

export const reels: ReelItem[] = [
  reel("1", "https://www.instagram.com/reel/DLO08YJTc2K/", "Epic Drift Compilation 🔥"),
  reel("2", "https://www.instagram.com/p/C_FnokDv6iS/", "RC Action Clip"),
  reel("3", "https://www.instagram.com/reel/DLO08YJTc2K/", "Track Day Highlights 💨"),
  reel("4", "https://www.instagram.com/reel/DZ2YKhxBUMn/", "On-Road Racing Action"),
  reel("5", "https://www.instagram.com/reel/DYzN6ylhfnf/", "Cockpit POV Lap"),
];

export const REELS_INSTAGRAM_PROFILE = IG_PROFILE;
