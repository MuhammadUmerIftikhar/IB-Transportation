import { siteUrl } from "./site";

/**
 * IndexNow (https://www.indexnow.org) instantly notifies Bing — which powers Copilot and
 * ChatGPT search — plus Yandex, Seznam and others that a page changed. Google discovers
 * changes through the sitemap instead.
 *
 * The key is public by design; it's verified via /<key>.txt in /public.
 */
export const INDEXNOW_KEY = "0b092d272e46638c38bd8835183324c9";

export async function submitToIndexNow(paths: string[]) {
  const urlList = [...new Set(paths)].map((path) => (path.startsWith("http") ? path : `${siteUrl}${path}`));
  if (urlList.length === 0 || siteUrl.includes("localhost")) return { skipped: true as const };
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(siteUrl).host,
      key: INDEXNOW_KEY,
      keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  return { status: response.status, urls: urlList.length };
}
