import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { Stagger, StaggerItem } from "../ui/reveal";
import { SectionHeading } from "../ui/section-heading";

/** Customer reviews from Sanity. Renders nothing until at least one review is added. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section id="reviews" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Reviews" title="What our" highlight="riders say" />
        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial._id}>
              <figure className="group relative h-full rounded-[28px] border border-ink-900/5 bg-sand-50 p-7 shadow-soft transition duration-500 ease-spring hover:-translate-y-1.5 hover:shadow-lift">
                <Quote className="absolute top-6 right-6 size-10 text-gold-400/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" aria-hidden />
                <div className="flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`size-4 ${i < testimonial.rating ? "fill-gold-400 text-gold-400" : "text-ink-900/15"}`} aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-ink-800">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="bg-brand-gradient flex size-10 items-center justify-center rounded-full font-display font-bold text-ink-950">
                    {testimonial.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-display font-semibold">{testimonial.name}</span>
                    {testimonial.location && <span className="text-sm text-ink-700/60">{testimonial.location}</span>}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
