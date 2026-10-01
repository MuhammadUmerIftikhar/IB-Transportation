import NextImage, { type ImageProps } from "next/image";
import { Image as SanityCdnImage } from "next-sanity/image";
import type { ImageAsset } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";

type Props = Omit<ImageProps, "src" | "alt" | "loader"> & { image: ImageAsset | undefined; alt: string };

/** Renders a /public image path or a Sanity image (served and resized by Sanity's image CDN). */
export function CmsImage({ image, alt, ...props }: Props) {
  if (!image) return null;
  if (typeof image === "string") return <NextImage src={image} alt={alt} {...props} />;
  if (!image.asset) return null;
  return (
    <SanityCdnImage
      src={urlFor(image).url()}
      alt={image.alt || alt}
      {...(image.lqip ? { placeholder: "blur" as const, blurDataURL: image.lqip } : {})}
      {...props}
    />
  );
}
