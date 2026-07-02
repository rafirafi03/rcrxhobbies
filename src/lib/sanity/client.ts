import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "z8bsql6v";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityRead = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});
