import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 text-lg leading-relaxed text-ink-700/80 first:mt-0">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 font-display text-3xl font-bold tracking-tight text-ink-900">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 font-display text-2xl font-bold tracking-tight text-ink-900">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-gold-400 pl-5 text-lg text-ink-800 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink-700/80 marker:text-gold-500">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-ink-700/80 marker:text-gold-600">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:/.test(href);
      return (
        <a
          href={href}
          className="font-medium text-gold-600 underline decoration-gold-400/50 underline-offset-4 hover:decoration-gold-500"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
