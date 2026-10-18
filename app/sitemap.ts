import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${process.env.NEXT_PUBLIC_SITE_URL || site.url}/`, changeFrequency: "monthly", priority: 1 }];
}
