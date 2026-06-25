import { NextRequest, NextResponse } from "next/server";
import { fetchInstagramReelMedia, validateReelUrl } from "@/lib/instagram";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !validateReelUrl(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const media = await fetchInstagramReelMedia(url);

    if (!media.thumbnailUrl && !media.videoUrl) {
      return NextResponse.json(
        {
          thumbnailUrl: null,
          videoUrl: null,
          title: null,
          viewCount: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reel media" }, { status: 502 });
  }
}
