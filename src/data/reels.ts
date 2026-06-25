import type { ReelItem } from "@/types";
import { pexels } from "@/lib/images";
import { REEL_VIDEO } from "@/lib/videos";
import { SITE_CONFIG } from "@/lib/constants";

export const reels: ReelItem[] = [
  {
    id: "1",
    thumbnail: pexels(2127021, 480, 854),
    title: "Epic Drift Compilation 🔥",
    views: "12.4K",
    videoUrl: REEL_VIDEO.wetRoad,
    instagramUrl: SITE_CONFIG.instagram,
  },
  {
    id: "2",
    thumbnail: pexels(919073, 480, 854),
    title: "Supercar Speed Run",
    views: "8.7K",
    videoUrl: REEL_VIDEO.whiteSports,
    instagramUrl: SITE_CONFIG.instagram,
  },
  {
    id: "3",
    thumbnail: pexels(1706900, 480, 854),
    title: "Track Day Highlights 💨",
    views: "15.2K",
    videoUrl: REEL_VIDEO.redMountain,
    instagramUrl: SITE_CONFIG.instagram,
  },
  {
    id: "4",
    thumbnail: pexels(1035108, 480, 854),
    title: "On-Road Racing Action",
    views: "6.3K",
    videoUrl: REEL_VIDEO.highway,
    instagramUrl: SITE_CONFIG.instagram,
  },
  {
    id: "5",
    thumbnail: pexels(627678, 480, 854),
    title: "Cockpit POV Lap",
    views: "9.1K",
    videoUrl: REEL_VIDEO.rearDrive,
    instagramUrl: SITE_CONFIG.instagram,
  },
];
