import { existsSync } from "fs";
import path from "path";
import { ultraigdl } from "ultra-igdl";
import { cacheVideoCdnUrl } from "./instagram-cache";
import { getInstagramShortcode, isInstagramReelUrl } from "./reels";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const FB_UA =
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

export interface InstagramReelMedia {
  thumbnailUrl: string | null;
  videoUrl: string | null;
  title: string | null;
  viewCount: number | null;
}

interface ReelEngagement {
  viewCount: number | null;
}

function createUltraIgClient() {
  const sessionId = process.env.INSTAGRAM_SESSION_ID?.trim();
  return new ultraigdl(sessionId ? { sessionId } : undefined);
}

function decodeJsonUrl(value: string): string {
  return value.replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/\\"/g, '"');
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    );
}

function normalizeMediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  return decodeHtmlEntities(decodeJsonUrl(value.trim()));
}

function getProxiedVideoPath(reelUrl: string): string {
  return `/api/instagram-reel/video?url=${encodeURIComponent(reelUrl)}`;
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /property="og:image" content="([^"]+)"/i,
    /content="([^"]+)" property="og:image"/i,
    /"og:image" content="([^"]+)"/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return normalizeMediaUrl(match[1]);
  }
  return null;
}

function extractVideoUrl(html: string): string | null {
  const patterns = [
    /"video_url":"([^"]+)"/,
    /"contentUrl":"(https:[^"]+\.mp4[^"]*)"/,
    /video_versions":\s*\[\s*\{\s*"url":\s*"([^"]+)"/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return normalizeMediaUrl(match[1]);
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match =
    html.match(/property="og:title" content="([^"]+)"/i) ??
    html.match(/content="([^"]+)" property="og:title"/i);
  return match?.[1] ? decodeHtmlEntities(decodeJsonUrl(match[1])) : null;
}

function parseCompactCount(token: string): number | null {
  const match = token.trim().match(/^([\d,.]+)\s*([KMB])?$/i);
  if (!match) return null;

  const suffix = (match[2] ?? "").toUpperCase();
  const numeric = Number.parseFloat(match[1].replace(/,/g, ""));
  if (Number.isNaN(numeric)) return null;

  if (suffix === "K") return Math.round(numeric * 1_000);
  if (suffix === "M") return Math.round(numeric * 1_000_000);
  if (suffix === "B") return Math.round(numeric * 1_000_000_000);
  return Math.round(numeric);
}

function extractEngagementFromText(text: string): ReelEngagement {
  const decoded = decodeHtmlEntities(text);
  const views =
    decoded.match(/([\d,.]+[KMB]?)\s+views?/i) ??
    decoded.match(/([\d,.]+[KMB]?)\s+plays?/i);

  return {
    viewCount: views?.[1] ? parseCompactCount(views[1]) : null,
  };
}

function extractEngagementFromHtml(html: string): ReelEngagement {
  const ogDescription =
    html.match(/property="og:description" content="([^"]+)"/i)?.[1] ??
    html.match(/content="([^"]+)" property="og:description"/i)?.[1] ??
    html.match(/name="description" content="([^"]+)"/i)?.[1];

  const fromDescription = ogDescription
    ? extractEngagementFromText(ogDescription)
    : { viewCount: null };

  const playCount = html.match(/"play_count":(\d+)/)?.[1];
  const videoViewCount = html.match(/"video_view_count":(\d+)/)?.[1];
  const viewCount = html.match(/"view_count":(\d+)/)?.[1];

  const parsedViewCount =
    (playCount ? Number.parseInt(playCount, 10) : null) ??
    (videoViewCount ? Number.parseInt(videoViewCount, 10) : null) ??
    (viewCount ? Number.parseInt(viewCount, 10) : null) ??
    fromDescription.viewCount;

  return { viewCount: parsedViewCount };
}

function engagementFromUltraResult(
  engagement?: { likes?: number; comments?: number; views?: number }
): ReelEngagement {
  return { viewCount: engagement?.views ?? null };
}

function mergeViewCount(...sources: Array<number | null | undefined>): number | null {
  for (const value of sources) {
    if (value != null) return value;
  }
  return null;
}

function extractMediaId(html: string): string | null {
  return (
    html.match(/instagram:\/\/media\?id=(\d+)/)?.[1] ??
    html.match(/"media_id":"(\d+)"/)?.[1] ??
    null
  );
}

async function fetchPlayCountWithSession(
  reelUrl: string,
  sessionId?: string
): Promise<number | null> {
  try {
    const metaRes = await fetch(reelUrl, {
      headers: { "User-Agent": FB_UA },
      redirect: "follow",
      next: { revalidate: 3600 },
    });
    if (!metaRes.ok) return null;

    const mediaId = extractMediaId(await metaRes.text());
    if (!mediaId) return null;

    const pageRes = await fetch(reelUrl, {
      headers: { "User-Agent": BROWSER_UA, Accept: "text/html" },
      redirect: "follow",
      next: { revalidate: 3600 },
    });
    const setCookie = pageRes.headers.getSetCookie?.() ?? [];
    const guestCookie = setCookie.map((entry) => entry.split(";")[0]).join("; ");
    const csrf = guestCookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";

    const cookie = sessionId
      ? `sessionid=${sessionId}${csrf ? `; csrftoken=${csrf}` : ""}`
      : guestCookie;

    if (!cookie) return null;

    const apiRes = await fetch(
      `https://www.instagram.com/api/v1/media/${mediaId}/info/?media_id=${mediaId}`,
      {
        headers: {
          "User-Agent": BROWSER_UA,
          "X-IG-App-ID": "936619743392459",
          Cookie: cookie,
          "X-CSRFToken": csrf,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Referer: reelUrl,
        },
        next: { revalidate: 3600 },
      }
    );

    const contentType = apiRes.headers.get("content-type") ?? "";
    if (!apiRes.ok || !contentType.includes("application/json")) return null;

    const payload = (await apiRes.json()) as {
      items?: Array<{ play_count?: number; view_count?: number }>;
    };
    const item = payload.items?.[0];
    if (!item) return null;

    return item.play_count ?? item.view_count ?? null;
  } catch {
    return null;
  }
}

async function fetchNoembed(url: string): Promise<Partial<InstagramReelMedia>> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as { thumbnail_url?: string; title?: string };
    return {
      thumbnailUrl: normalizeMediaUrl(data.thumbnail_url),
      title: data.title ? decodeHtmlEntities(data.title) : null,
    };
  } catch {
    return {};
  }
}

async function fetchInstagramOembed(url: string): Promise<Partial<InstagramReelMedia>> {
  try {
    const res = await fetch(
      `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true&maxwidth=640`,
      { headers: { Accept: "application/json" }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return {};
    const data = (await res.json()) as { thumbnail_url?: string; title?: string };
    return {
      thumbnailUrl: normalizeMediaUrl(data.thumbnail_url),
      title: data.title ? decodeHtmlEntities(data.title) : null,
    };
  } catch {
    return {};
  }
}

async function scrapeInstagramPage(url: string): Promise<Partial<InstagramReelMedia>> {
  for (const userAgent of [FB_UA, BROWSER_UA]) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const html = await res.text();
      const thumbnailUrl = extractOgImage(html);
      const videoUrl = extractVideoUrl(html);
      const title = extractTitle(html);
      const engagement = extractEngagementFromHtml(html);
      if (thumbnailUrl || videoUrl || engagement.viewCount) {
        return { thumbnailUrl, videoUrl, title, ...engagement };
      }
    } catch {
      // try next user agent
    }
  }
  return {};
}

async function fetchViaUltraIgdl(url: string): Promise<Partial<InstagramReelMedia>> {
  try {
    const ig = createUltraIgClient();
    const result = await ig.download(url);
    if (!("media" in result) || !result.media?.length) return {};

    const video = result.media.find((item) => item.type === "video");
    const image = result.media.find((item) => item.type === "image");
    const engagement = engagementFromUltraResult(result.engagement);

    const thumbnailUrl = normalizeMediaUrl(image?.url ?? video?.thumbnail);
    const cdnVideoUrl = normalizeMediaUrl(video?.url);

    if (cdnVideoUrl) {
      cacheVideoCdnUrl(url, cdnVideoUrl);
    }

    return {
      thumbnailUrl,
      videoUrl: cdnVideoUrl,
      title: result.caption ? decodeHtmlEntities(result.caption) : null,
      viewCount: engagement.viewCount,
    };
  } catch {
    return {};
  }
}

async function resolveThumbnailViaRedirect(reelUrl: string): Promise<string | null> {
  const shortcode = getInstagramShortcode(reelUrl);
  if (!shortcode) return null;

  try {
    const res = await fetch(`https://www.instagram.com/p/${shortcode}/media/?size=l`, {
      headers: { "User-Agent": FB_UA },
      redirect: "manual",
      next: { revalidate: 3600 },
    });
    const location = res.headers.get("location");
    return normalizeMediaUrl(location);
  } catch {
    return null;
  }
}

function getLocalVideoUrl(reelUrl: string): string | null {
  const shortcode = getInstagramShortcode(reelUrl);
  if (!shortcode) return null;
  const filePath = path.join(process.cwd(), "public", "videos", "reels", `${shortcode}.mp4`);
  if (existsSync(filePath)) {
    return `/videos/reels/${shortcode}.mp4`;
  }
  return null;
}

export async function resolveInstagramVideoCdnUrl(reelUrl: string): Promise<string | null> {
  const localVideo = getLocalVideoUrl(reelUrl);
  if (localVideo) return localVideo;

  const ultra = await fetchViaUltraIgdl(reelUrl);
  if (ultra.videoUrl) return ultra.videoUrl;

  const scraped = await scrapeInstagramPage(reelUrl);
  if (scraped.videoUrl) {
    cacheVideoCdnUrl(reelUrl, scraped.videoUrl);
    return scraped.videoUrl;
  }

  return null;
}

export async function fetchInstagramReelMedia(reelUrl: string): Promise<InstagramReelMedia> {
  const localVideo = getLocalVideoUrl(reelUrl);
  const sessionId = process.env.INSTAGRAM_SESSION_ID?.trim();

  const [ultra, noembed, oembed, scraped, redirectThumb, apiViews] = await Promise.all([
    fetchViaUltraIgdl(reelUrl),
    fetchNoembed(reelUrl),
    fetchInstagramOembed(reelUrl),
    scrapeInstagramPage(reelUrl),
    resolveThumbnailViaRedirect(reelUrl),
    fetchPlayCountWithSession(reelUrl, sessionId),
  ]);

  const thumbnailUrl =
    ultra.thumbnailUrl ??
    noembed.thumbnailUrl ??
    oembed.thumbnailUrl ??
    scraped.thumbnailUrl ??
    redirectThumb ??
    null;

  const cdnVideoUrl = localVideo ?? ultra.videoUrl ?? scraped.videoUrl ?? null;

  if (cdnVideoUrl && !localVideo) {
    cacheVideoCdnUrl(reelUrl, cdnVideoUrl);
  }

  return {
    thumbnailUrl,
    videoUrl: cdnVideoUrl ? (localVideo ?? getProxiedVideoPath(reelUrl)) : null,
    title:
      ultra.title ??
      noembed.title ??
      oembed.title ??
      scraped.title ??
      null,
    viewCount: mergeViewCount(apiViews, ultra.viewCount, scraped.viewCount),
  };
}

export function validateReelUrl(url: string): boolean {
  return isInstagramReelUrl(url);
}

export const INSTAGRAM_VIDEO_HEADERS = {
  "User-Agent": BROWSER_UA,
  Referer: "https://www.instagram.com/",
  Origin: "https://www.instagram.com",
} as const;
