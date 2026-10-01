import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook: refreshes the whole site as soon as content is published.
 * Configure at sanity.io/manage → API → Webhooks:
 *   URL: https://your-domain.com/api/revalidate, trigger on create/update/delete,
 *   secret: the same value as SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse("SANITY_REVALIDATE_SECRET is not set", { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
  } catch (error) {
    console.error("[revalidate]", error);
    return new NextResponse("Bad request", { status: 400 });
  }
}
