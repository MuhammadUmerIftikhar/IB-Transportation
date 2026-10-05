/**
 * Submits every URL in the live sitemap to IndexNow (Bing, Copilot, ChatGPT search, Yandex…).
 * Run after a big launch or redesign:   npm run indexnow
 * (Day-to-day changes are announced automatically by the Sanity webhook.)
 */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ib-transportation.com").replace(/\/$/, "");
const KEY = "0b092d272e46638c38bd8835183324c9"; // keep in sync with lib/indexnow.ts

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
if (urlList.length === 0) throw new Error("No URLs found in the sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
