export function getInstagramShortcode(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}

/** Convert a public Instagram reel/post URL into an embeddable player URL. */
export function getInstagramEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  const reelMatch = trimmed.match(/instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/i);
  if (reelMatch) {
    return `https://www.instagram.com/reel/${reelMatch[1]}/embed`;
  }

  const postMatch = trimmed.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  if (postMatch) {
    return `https://www.instagram.com/p/${postMatch[1]}/embed`;
  }

  return null;
}

export function isInstagramReelUrl(url: string): boolean {
  return getInstagramEmbedUrl(url) !== null;
}

export function isDirectVideoUrl(url: string): boolean {
  return (
    /\.(mp4|webm|ogg)(\?|$)/i.test(url) ||
    url.includes("mixkit.co/videos") ||
    url.startsWith("/api/instagram-reel/video")
  );
}

/** Resolve what to play on-site: native video preferred, then Instagram embed. */
export function getReelPlayback(
  reel: { reelUrl?: string; videoUrl?: string },
  resolvedVideoUrl?: string | null
): { type: "video"; src: string } | { type: "instagram"; embedUrl: string; openUrl: string } | null {
  const candidates = [resolvedVideoUrl, reel.videoUrl?.trim()].filter(Boolean) as string[];

  for (const src of candidates) {
    if (isDirectVideoUrl(src) && !isInstagramReelUrl(src)) {
      return { type: "video", src };
    }
  }

  if (reel.reelUrl) {
    const embedUrl = getInstagramEmbedUrl(reel.reelUrl);
    if (embedUrl) {
      return { type: "instagram", embedUrl, openUrl: reel.reelUrl };
    }
  }

  return null;
}
