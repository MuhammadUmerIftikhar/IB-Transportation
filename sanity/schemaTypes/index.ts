import { faq } from "./faq";
import { route } from "./route";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonial";
import { vehicle } from "./vehicle";

export const schemaTypes = [siteSettings, service, route, vehicle, faq, testimonial];

/** Document types that exist exactly once. */
export const singletonTypes = new Set(["siteSettings"]);
