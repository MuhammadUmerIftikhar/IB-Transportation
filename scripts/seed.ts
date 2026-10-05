/**
 * Loads the website's default content (lib/fallback.ts) into your Sanity dataset,
 * including uploading the photos from /public/images.
 *
 *   npm run seed            → creates documents that don't exist yet (safe to re-run)
 *   npm run seed -- --force → overwrites existing documents with the defaults
 *
 * Requires `npx sanity login` and NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { fallbackFaqs, fallbackRoutes, fallbackServices, fallbackSettings, fallbackVehicles } from "../lib/fallback";
import type { ImageAsset } from "../lib/types";

const client = getCliClient({ apiVersion: "2025-09-01" });
const force = process.argv.includes("--force");
const uploaded = new Map<string, string>();

async function uploadImage(source: ImageAsset | undefined, alt: string) {
  if (typeof source !== "string") return undefined;
  if (!uploaded.has(source)) {
    console.log(`  ↑ uploading ${source}`);
    const asset = await client.assets.upload(
      "image",
      createReadStream(path.join(process.cwd(), "public", source)),
      { filename: path.basename(source) },
    );
    uploaded.set(source, asset._id);
  }
  return { _type: "image", alt, asset: { _type: "reference", _ref: uploaded.get(source)! } };
}

const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }));

async function main() {
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}${force ? " (force)" : ""}…`);

  const { heroImage, stats, whyChooseUs, email, ...settings } = fallbackSettings;
  const docs: Record<string, unknown>[] = [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      ...settings,
      ...(email ? { email } : {}),
      heroImage: await uploadImage(heroImage, "Dubai skyline and highways at dusk"),
      stats: withKeys(stats, "stat"),
      whyChooseUs: withKeys(whyChooseUs, "why"),
    },
  ];

  for (const [i, { _id, slug, image, ...service }] of fallbackServices.entries()) {
    docs.push({
      _id,
      _type: "service",
      ...service,
      slug: { _type: "slug", current: slug },
      image: await uploadImage(image, service.title),
      order: (i + 1) * 10,
    });
  }

  // Vehicle photos are also added to vehicles that already exist but have no photo yet
  // (setIfMissing never overwrites a photo chosen in the Studio).
  const photoPatches: { _id: string; image: unknown; facing?: string }[] = [];
  for (const [i, { _id, slug, image, ...vehicle }] of fallbackVehicles.entries()) {
    const photo = image ? await uploadImage(image, vehicle.name) : undefined;
    docs.push({
      _id,
      _type: "vehicle",
      ...vehicle,
      slug: { _type: "slug", current: slug },
      ...(photo ? { image: photo } : {}),
      order: (i + 1) * 10,
    });
    if (photo) photoPatches.push({ _id, image: photo, facing: vehicle.facing });
  }

  for (const [i, { _id, slug, image, ...route }] of fallbackRoutes.entries()) {
    docs.push({
      _id,
      _type: "route",
      ...route,
      slug: { _type: "slug", current: slug },
      ...(image ? { image: await uploadImage(image, `${route.from} to ${route.to}`) } : {}),
      order: (i + 1) * 10,
    });
  }

  for (const [i, { _id, ...faq }] of fallbackFaqs.entries()) {
    docs.push({ _id, _type: "faq", ...faq, order: (i + 1) * 10 });
  }

  const tx = client.transaction();
  for (const doc of docs) {
    const withId = doc as { _id: string; _type: string };
    if (force) tx.createOrReplace(withId);
    else tx.createIfNotExists(withId);
  }
  if (!force) {
    const withoutPhoto = new Set(await client.fetch<string[]>(`*[_type == "vehicle" && !defined(image)]._id`));
    for (const { _id, image, facing } of photoPatches) {
      if (withoutPhoto.has(_id)) tx.patch(_id, (patch) => patch.set({ image, ...(facing ? { facing } : {}) }));
    }
  }
  await tx.commit();
  console.log(`✓ ${docs.length} documents ${force ? "written" : "created (existing ones were left untouched)"}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
