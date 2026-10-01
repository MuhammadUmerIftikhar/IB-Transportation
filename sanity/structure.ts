import { CarFront, CircleHelp, MessageSquareQuote, Route, Settings } from "lucide-react";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("IB Transportation")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(Settings)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("service").title("Services").icon(Route),
      S.documentTypeListItem("vehicle").title("Fleet").icon(CarFront),
      S.divider(),
      S.documentTypeListItem("faq").title("FAQs").icon(CircleHelp),
      S.documentTypeListItem("testimonial").title("Customer reviews").icon(MessageSquareQuote),
    ]);
