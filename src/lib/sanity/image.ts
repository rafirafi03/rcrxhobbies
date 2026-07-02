import imageUrlBuilder from "@sanity/image-url";
import { sanityRead } from "./client";
import { FALLBACK_IMAGE } from "../images";

const builder = imageUrlBuilder(sanityRead);

type SanityImageSource = Parameters<typeof builder.image>[0];

export function imageUrl(source?: SanityImageSource | null, width = 800): string {
  if (!source) return FALLBACK_IMAGE;
  try {
    return builder.image(source).width(width).auto("format").url();
  } catch {
    return FALLBACK_IMAGE;
  }
}

export function fileUrl(ref?: string): string {
  if (!ref) return "";
  const [, id, extension] = ref.split("-");
  if (!id || !extension) return "";
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "z8bsql6v";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
}
