# IB Transportation — website

Animated marketing site for **IB Transportation** (airport transfers, hotel pick & drop, tours and group transport across the UAE), built with **Next.js 16**, **Sanity 6**, **Framer Motion** and **Tailwind CSS 4**.

Every "Book Now" button opens WhatsApp chat with **+971 55 745 8352**, with a pre-filled message (service, vehicle, or the full trip details from the booking form).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

The site works immediately with built-in default content (`lib/fallback.ts`). Connect Sanity when you want to edit content without touching code.

## Connect Sanity (content editing)

1. Create a free project at <https://www.sanity.io/manage> (or run `npx sanity init --env`).
2. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` (dataset defaults to `production`).
3. In the Sanity project → **API → CORS origins**, add `http://localhost:3000` and your live domain, with **Allow credentials** ticked.
4. Restart `npm run dev`, then load the default content into Sanity:
   ```bash
   npx sanity login
   npm run seed          # creates documents that don't exist yet (safe to re-run)
   ```
5. Edit content at **/studio** — Site Settings (phone, WhatsApp number, hero text, stats, "why choose us"), Services, Fleet, FAQs and Customer reviews.

Published changes appear on the site within 60 seconds. For instant updates, add a webhook in Sanity (**API → Webhooks**) pointing to `https://your-domain.com/api/revalidate` with a secret, and set the same value as `SANITY_REVALIDATE_SECRET`.

Notes:
- If a collection is empty in Sanity, the site shows the built-in defaults for it.
- **Customer reviews** are hidden until you add real ones in the Studio.
- Vehicles without an uploaded photo use the built-in illustration for their type. Upload real photos of your fleet (side view on a plain background looks best).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run seed` | Copy default content + photos into Sanity |

## Deploy

Deploy to [Vercel](https://vercel.com/new) (or any Node host). Set the environment variables from `.env.example`, including `NEXT_PUBLIC_SITE_URL` (used for SEO, sitemap and social previews), and add the live domain to Sanity's CORS origins.

## Project structure

```
app/(site)/            Home page and /services/[slug] pages (navbar, footer, WhatsApp buttons)
app/studio/            Embedded Sanity Studio at /studio
app/api/revalidate/    Webhook for instant content updates
components/sections/   Page sections (hero, booking form, services, fleet, FAQ, …)
components/ui/         Buttons, reveal animations, tilt cards, icons
lib/fallback.ts        Default content (also used by `npm run seed`)
lib/contact.ts         WhatsApp / phone link and message builders
sanity/schemaTypes/    Content model
```

## Image credits

Photos in `public/images` (including the vehicle cut-outs in `public/images/fleet`) are from [Unsplash](https://unsplash.com) and [Pexels](https://www.pexels.com) under their free licenses (commercial use allowed, no attribution required). Vehicle backgrounds were removed and licence plates blurred. Replace them with photos of your own fleet any time via Sanity — set "Photo faces" so the vehicle drives in the right way.

## SEO & AI search (built in, runs automatically)

- **Transfer route pages** — every *Transfer route* in Sanity becomes a landing page at `/transfers/<slug>` (e.g. *Dubai Airport to Abu Dhabi Transfer*) with its own title, description, FAQ, booking form pre-filled with the route, and structured data. Add a route in the Studio → the page, sitemap entry and search-engine ping happen on their own. Write a unique 2–3 sentence summary for each — unique content is what ranks.
- **Structured data (schema.org)** on every page: Organization, WebSite, LocalBusiness (24/7 hours, all 7 emirates, services and fleet), Service, BreadcrumbList and FAQPage — how Google, AI Overviews and AI assistants understand the business.
- **Sitemap** (`/sitemap.xml`) with real last-modified dates from Sanity, **robots.txt**, canonical URLs and full social previews on every page.
- **`/llms.txt`** — a plain-text fact sheet for AI assistants, generated from Sanity.
- **IndexNow** — on every publish, the Sanity webhook tells Bing (which powers Copilot and ChatGPT search), Yandex and others exactly which pages changed. Run `npm run indexnow` to submit every URL at once (e.g. after a launch).

**One-time setup** (needed for the automation to report to you):
1. **Google Search Console** — add `https://www.ib-transportation.com` (DNS or HTML-tag verification via `GOOGLE_SITE_VERIFICATION`), then submit `https://www.ib-transportation.com/sitemap.xml`.
2. **Bing Webmaster Tools** — sign in and *Import from Google Search Console* (or use `BING_SITE_VERIFICATION`).
3. **Sanity webhook** — sanity.io/manage → API → Webhooks: URL `https://www.ib-transportation.com/api/revalidate`, trigger on create/update/delete, projection `{_type, "slug": slug.current}`, secret = `SANITY_REVALIDATE_SECRET` (set the same value in Vercel).
