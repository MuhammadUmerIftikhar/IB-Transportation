import { revalidatePath } from "next/cache";
import { after, type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { getRoutes, getServices } from "@/lib/data";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * Sanity webhook: runs every time content is published.
 *   1. refreshes the whole site immediately (instead of waiting up to 60s)
 *   2. tells search engines which pages changed (IndexNow → Bing, Copilot, ChatGPT search…)
 *
 * Configure at sanity.io/manage → API → Webhooks:
 *   URL: https://www.ib-transportation.com/api/revalidate
 *   Trigger on: create, update, delete · Projection: {_type, "slug": slug.current}
 *   Secret: the same value as the SANITY_REVALIDATE_SECRET environment variable.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse("SANITY_REVALIDATE_SECRET is not set", { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(req, secret, true);
    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    revalidatePath("/", "layout");

    // Announce the changed pages once the response has been sent (doesn't slow the webhook down)
    after(async () => {
      const paths = await changedPaths(body?._type, body?.slug);
      const result = await submitToIndexNow(paths).catch((error) => ({ error: String(error) }));
      console.log("[indexnow]", body?._type, paths.length, "urls", result);
    });

    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (error) {
    console.error("[revalidate]", error);
    return new NextResponse("Bad request", { status: 400 });
  }
}

/** Which public pages a change to this document type affects. */
async function changedPaths(type?: string, slug?: string): Promise<string[]> {
  if (type === "service" && slug) return ["/", "/services", `/services/${slug}`];
  if (type === "route" && slug) return ["/", "/transfers", `/transfers/${slug}`];
  // settings, fleet, FAQs and reviews appear on every page
  const [services, routes] = await Promise.all([getServices(), getRoutes()]);
  const pages = ["/", "/services", "/fleet", "/transfers", "/about", "/faq", "/contact"];
  return [...pages, ...services.map((s) => `/services/${s.slug}`), ...routes.map((r) => `/transfers/${r.slug}`)];
}
