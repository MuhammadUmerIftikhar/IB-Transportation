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
