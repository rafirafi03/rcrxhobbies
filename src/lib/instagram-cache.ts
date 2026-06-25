interface CacheEntry {
  cdnUrl: string;
  expires: number;
}

const videoCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export function cacheVideoCdnUrl(reelUrl: string, cdnUrl: string): void {
  videoCache.set(reelUrl, {
    cdnUrl,
    expires: Date.now() + CACHE_TTL_MS,
  });
}

export function getCachedVideoCdnUrl(reelUrl: string): string | null {
  const entry = videoCache.get(reelUrl);
  if (!entry || entry.expires < Date.now()) {
    videoCache.delete(reelUrl);
    return null;
  }
  return entry.cdnUrl;
}
