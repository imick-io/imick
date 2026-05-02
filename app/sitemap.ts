import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"

const ROUTES = ["/", "/about", "/contact", "/sponsor"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : 0.8,
  }))
}
