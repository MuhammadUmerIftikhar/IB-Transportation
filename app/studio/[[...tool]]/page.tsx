import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) return <StudioSetup />;
  return <NextStudio config={config} />;
}

function StudioSetup() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink-950 px-6 py-16 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold-400 uppercase">
          Content Studio
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">Connect your Sanity project</h1>
        <p className="mt-3 text-white/70">
          The website is running on its built-in default content. To edit content from here:
        </p>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-white/80">
          <li>
            Create a free project at{" "}
            <a className="text-gold-400 underline" href="https://www.sanity.io/manage" target="_blank" rel="noreferrer">
              sanity.io/manage
            </a>{" "}
            (or run <code className="rounded bg-white/10 px-1.5 py-0.5">npx sanity init --env</code>).
          </li>
          <li>
            Copy <code className="rounded bg-white/10 px-1.5 py-0.5">.env.example</code> to{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5">.env.local</code> and set{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code>.
          </li>
          <li>
            In the project&apos;s API settings, add <code className="rounded bg-white/10 px-1.5 py-0.5">http://localhost:3000</code>{" "}
            (and your live domain) as a CORS origin with credentials allowed.
          </li>
          <li>
            Restart the dev server, then run <code className="rounded bg-white/10 px-1.5 py-0.5">npm run seed</code> to
            load the default content into Sanity.
          </li>
        </ol>
      </div>
    </main>
  );
}
