import type { GalleryItem } from "@/types";
import { RACING_GALLERY } from "@/lib/images";

export const galleryItems: GalleryItem[] = [
  { id: "1", image: RACING_GALLERY[0], title: "Drift Session", category: "Events" },
  { id: "2", image: RACING_GALLERY[1], title: "Off-Road Trail", category: "Adventure" },
  { id: "3", image: RACING_GALLERY[2], title: "Track Day", category: "Racing" },
  { id: "4", image: RACING_GALLERY[3], title: "Rock Crawling", category: "Adventure" },
  { id: "5", image: RACING_GALLERY[4], title: "Mini Racing", category: "Events" },
  { id: "6", image: RACING_GALLERY[5], title: "Nitro Power", category: "Racing" },
  { id: "7", image: RACING_GALLERY[6], title: "Speed Run", category: "Racing" },
  { id: "8", image: RACING_GALLERY[7], title: "Circuit Lap", category: "Racing" },
];
