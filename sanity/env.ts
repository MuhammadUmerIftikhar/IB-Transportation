export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** The site renders built-in default content until a Sanity project is connected. */
export const isSanityConfigured = projectId.length > 0;
