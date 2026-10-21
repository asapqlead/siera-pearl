import { MetadataRoute } from "next";
import { INITIAL_PRODUCTS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sierapearl.com";
  const now = new Date();

  // Static high-value routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-returns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/care-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/size-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Dynamic product entries (all 30 SKUs)
  const productEntries: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.badge === "Bestseller" ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...productEntries];
}
