import { defineCliConfig } from "sanity/cli";

// Make `.env.local` available to Sanity CLI commands (e.g. `npm run seed`).
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local — rely on environment variables instead.
}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
