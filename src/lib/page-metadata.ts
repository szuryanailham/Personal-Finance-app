import type { Metadata } from "next";
import defaultImage from "@/components/images/illustrations/demo-application.png";
import { SITE_URL } from "@/lib/seo";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function createPageMetadata({ title, description, path, image = defaultImage.src, type = "website" }: PageMetadataOptions): Metadata {
  const canonical = new URL(path, SITE_URL).href;

  return {
    alternates: { canonical },
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Artoku",
      locale: "id_ID",
      type,
      images: [{ url: new URL(image, SITE_URL).href, alt: title }],
    },
  };
}
