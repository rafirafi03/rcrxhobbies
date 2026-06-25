/** Local fallback when a remote image fails to load. */
export const FALLBACK_IMAGE = "/images/placeholder.svg";

/**
 * Verified Pexels photo IDs — sports / racing cars only (no buildings or garages).
 * @see https://www.pexels.com/search/racing%20car/
 */
const RACE_PHOTO = {
  f1: 2127021,
  redSports: 3802510,
  yellowSports: 112460,
  lamborghini: 919073,
  track1: 2449445,
  track2: 3874337,
  porsche: 1706900,
  audi: 1035108,
  bmw: 627678,
  roadRace: 337909,
  supercar: 2445548,
  highway: 170811,
} as const;

/** Build a stable Pexels URL for Next.js image optimization. */
export function pexels(id: number, width = 800, height?: number): string {
  const params = new URLSearchParams({
    auto: "compress",
    cs: "tinysrgb",
    w: String(width),
    fit: "crop",
  });
  if (height) params.set("h", String(height));
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${params}`;
}

/** Racing-car images for products, categories, and sections. */
export const IMG = {
  drift: pexels(RACE_PHOTO.redSports),
  offroad: pexels(RACE_PHOTO.supercar),
  onroad: pexels(RACE_PHOTO.porsche),
  crawler: pexels(RACE_PHOTO.audi),
  mini: pexels(RACE_PHOTO.bmw),
  nitro: pexels(RACE_PHOTO.lamborghini),
  sport: pexels(RACE_PHOTO.track1),
  racing: pexels(RACE_PHOTO.f1),
  track: pexels(RACE_PHOTO.roadRace),
  supercar: pexels(RACE_PHOTO.track2),
  yellow: pexels(RACE_PHOTO.yellowSports),
  highway: pexels(RACE_PHOTO.highway),
} as const;

export const BANNER_IMG = {
  premium: pexels(RACE_PHOTO.f1, 1400, 600),
  drift: pexels(RACE_PHOTO.redSports, 1400, 600),
  offroad: pexels(RACE_PHOTO.lamborghini, 1400, 600),
  contact: pexels(RACE_PHOTO.porsche, 1400, 600),
} as const;

/** All gallery / reel thumbnails — racing cars only. */
export const RACING_GALLERY = [
  IMG.racing,
  IMG.drift,
  IMG.onroad,
  IMG.nitro,
  IMG.sport,
  IMG.supercar,
  IMG.yellow,
  IMG.track,
] as const;
