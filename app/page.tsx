import React from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { EditorialBand } from "@/components/home/EditorialBand";
import { WhySieraPearl } from "@/components/home/WhySieraPearl";
import { ReviewsPress } from "@/components/home/ReviewsPress";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Siera Pearl — Fine Natural Pearl Jewelry in 18k Solid Gold",
  description:
    "Explore natural Akoya, Tahitian, South Sea, and Freshwater pearl necklaces, earrings, bracelets, and rings set in certified recycled 18k solid gold.",
  openGraph: {
    title: "Siera Pearl — Fine Natural Pearl Jewelry in 18k Solid Gold",
    description:
      "Natural Akoya, Tahitian, South Sea, and Freshwater pearls set in certified recycled 18k solid gold. Free insured shipping and 30-day unhurried returns.",
    type: "website",
    url: "https://sierapearl.com",
  },
};

export default async function HomePage() {
  const products = await getProducts();

  // Structured Data for SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Siera Pearl",
    description: "Fine natural pearl jewelry set in recycled 18k solid gold.",
    url: "https://sierapearl.com",
    priceRange: "$$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Siera Pearl Fine Jewelry Collection",
      itemListElement: products.slice(0, 10).map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: p.name,
          category: p.cat,
          description: p.description,
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "USD",
            availability: p.in_stock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        },
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Navigation Layer */}
      <AnnouncementBar />
      <Header />

      {/* Main Luxury Home Content — 8 Sections in Strict Specified Sequence */}
      <main id="main-content" className="flex-1">
        {/* Section 1: Hero with Full-Bleed Photograph & Single Primary CTA */}
        <HomeHero />

        {/* Section 2: 5 Category Photo Tiles with Labels Beneath */}
        <CategoryTiles />

        {/* Section 3: 4-Column Bestsellers Grid with Dual-Photo ProductCards */}
        <BestsellersSection products={products} />

        {/* Section 4: Craft & Marine Sanctuary Sourcing Editorial Band */}
        <EditorialBand />

        {/* Section 5: The Siera Standard (3 Factual Pillars, Zero Icon Badges) */}
        <WhySieraPearl />

        {/* Section 6: Verified Patron Reviews & Press Citations */}
        <ReviewsPress />

        {/* Section 7: The Siera Journal Newsletter Subscription */}
        <NewsletterSection />
      </main>

      {/* Section 8: Global Luxury Footer */}
      <Footer />

      {/* Cart Drawer for Instant Quick-Add Interactivity */}
      <CartDrawer />
    </div>
  );
}
