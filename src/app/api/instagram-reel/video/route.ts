import { NextRequest, NextResponse } from "next/server";
import { getCachedVideoCdnUrl } from "../../../../lib/instagram-cache";
import {
  fetchInstagramReelMedia,
  INSTAGRAM_VIDEO_HEADERS,
  resolveInstagramVideoCdnUrl,
  validateReelUrl,
} from "../../../../lib/instagram";

export async function GET(request: NextRequest) {
  const reelUrl = request.nextUrl.searchParams.get("url");

  if (!reelUrl || !validateReelUrl(reelUrl)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  let videoUrl = getCachedVideoCdnUrl(reelUrl);
  if (!videoUrl) {
    await fetchInstagramReelMedia(reelUrl);
    videoUrl = getCachedVideoCdnUrl(reelUrl) ?? (await resolveInstagramVideoCdnUrl(reelUrl));
  }

  if (!videoUrl) {
    return NextResponse.json({ error: "Video not available" }, { status: 404 });
  }

  if (videoUrl.startsWith("/videos/")) {
    return NextResponse.redirect(new URL(videoUrl, request.url));
  }

  const range = request.headers.get("range");
  const upstreamHeaders: HeadersInit = { ...INSTAGRAM_VIDEO_HEADERS };
  if (range) upstreamHeaders.Range = range;

  try {
    const upstream = await fetch(videoUrl, { headers: upstreamHeaders });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json({ error: "Failed to stream video" }, { status: 502 });
    }

    const responseHeaders = new Headers();
    const passthrough = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
    ] as const;

    for (const key of passthrough) {
      const value = upstream.headers.get(key);
      if (value) responseHeaders.set(key, value);
    }

    if (!responseHeaders.has("content-type")) {
      responseHeaders.set("content-type", "video/mp4");
    }

    responseHeaders.set("cache-control", "public, max-age=3600");
    responseHeaders.set("accept-ranges", "bytes");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ error: "Failed to stream video" }, { status: 502 });
  }
}
