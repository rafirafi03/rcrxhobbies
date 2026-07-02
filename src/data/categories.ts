import type { Category } from "../types";
import { IMG } from "../lib/images";

export const categories: Category[] = [
  {
    slug: "drift-rc",
    name: "Drift RC",
    description: "Precision drift machines engineered for controlled slides and track dominance.",
    image: IMG.drift,
  },
  {
    slug: "off-road",
    name: "Off-Road",
    description: "Rugged trucks and buggies built to conquer trails, jumps, and all-terrain challenges.",
    image: IMG.offroad,
  },
  {
    slug: "on-road",
    name: "On-Road",
    description: "Sleek circuit racers designed for blistering speed on paved surfaces.",
    image: IMG.onroad,
  },
  {
    slug: "rock-crawler",
    name: "Rock Crawler",
    description: "Scale crawlers with portal axles and unmatched obstacle-climbing capability.",
    image: IMG.crawler,
  },
  {
    slug: "mini-rc",
    name: "Mini RC",
    description: "Compact indoor racers delivering full-scale thrills in miniature form.",
    image: IMG.mini,
  },
  {
    slug: "nitro",
    name: "Nitro",
    description: "Authentic nitro-powered machines with real engine sound and raw performance.",
    image: IMG.nitro,
  },
];
