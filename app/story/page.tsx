import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { STORY_IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our Story & Craft Philosophy — Siera Pearl",
  description:
    "Discover the origins of Siera Pearl. Organic marine lagoon cultivation, certified recycled 18k solid gold, and generational goldsmithing.",
  openGraph: {
    title: "Our Story & Craft Philosophy — Siera Pearl",
    description:
      "Organic marine lagoon cultivation, certified recycled 18k solid gold, and generational goldsmithing.",
    type: "website",
  },
};

export default function StoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Editorial Hero */}
        <section className="relative py-16 sm:py-24 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-4">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Our Story" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-medium">
              Provenance &amp; Purpose
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] font-normal leading-tight tracking-tight">
              A gem born complete, needing no faceting from mankind.
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light max-w-2xl mx-auto leading-relaxed pt-2">
              Siera Pearl was founded to connect protected oceanic lagoons directly with our master goldsmiths — bypassing traditional retail layers to preserve authentic pearl luster and heirloom craftsmanship.
            </p>
          </div>
        </section>

        {/* Narrative Section 1: The Lagoon Sanctuary */}
        <section className="py-20 sm:py-28 border-b border-[var(--border)]">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                  01 / Organic Cultivation
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal leading-snug">
                  Nurtured in pristine oceanic reserves.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  <p>
                    Unlike mineral gemstones cut from underground rock, pearls are created inside living oysters in untouched waters. Every Siera pearl begins in marine reserves where unhurried cultivation produces extraordinary nacre density.
                  </p>
                  <p>
                    Our oysters remain submerged for two to four full years in nutrient-rich marine currents. We never use chemical growth accelerants or synthetic coatings. The resulting mirror-grade orient and deep iridescence are entirely organic.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-6 text-xs text-[var(--text-tertiary)]">
                  <div>
                    <strong className="block font-serif text-xl sm:text-2xl text-[var(--text)] font-normal">
                      2–4 Years
                    </strong>
                    <span>Cultivation Period</span>
                  </div>
                  <div className="border-l border-[var(--border)] pl-6">
                    <strong className="block font-serif text-xl sm:text-2xl text-[var(--text)] font-normal">
                      Zero
                    </strong>
                    <span>Chemical Coatings</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[var(--surface-muted)] rounded-[2px]">
                  <Image
                    src={STORY_IMAGES.lagoon.src}
                    alt={STORY_IMAGES.lagoon.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section 2: Generational Goldsmithing */}
        <section className="py-20 sm:py-28 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[var(--border)] rounded-[2px]">
                  <Image
                    src={STORY_IMAGES.craft.src}
                    alt={STORY_IMAGES.craft.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 lg:pl-6">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                  02 / Master Atelier
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal leading-snug">
                  18k solid gold. Hand-matched with patience.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  <p>
                    Matching a single pearl strand requires inspecting hundreds of pearls under natural north light to harmonize tone, diameter, and overtone.
                  </p>
                  <p>
                    Each jewel is set exclusively in certified recycled 18k solid gold (solid 750 alloy) — never plated, hollowed, or vermeil. Our strands are knotted by hand on durable pure Japanese silk thread, creating a supple drape that rests effortlessly against the collarbone.
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-6 text-xs text-[var(--text-tertiary)]">
                  <div>
                    <strong className="block font-serif text-xl sm:text-2xl text-[var(--text)] font-normal">
                      18k / 750
                    </strong>
                    <span>Recycled Solid Gold</span>
                  </div>
                  <div className="border-l border-[var(--border)] pl-6">
                    <strong className="block font-serif text-xl sm:text-2xl text-[var(--text)] font-normal">
                      Pure Silk
                    </strong>
                    <span>Japanese Thread</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section 3: The Presentation & Guarantee */}
        <section className="py-20 sm:py-28 border-b border-[var(--border)]">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                  03 / Heirloom Assurance
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal leading-snug">
                  Designed to endure for generations.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  <p>
                    Fine pearl jewelry is meant to be passed down through families. Every acquisition arrives in a warm ivory presentation case alongside an individual certificate of authenticity signed by our chief gemologist.
                  </p>
                  <p>
                    To ensure your pieces maintain their integrity across decades, we offer complimentary lifetime restringing inspection and ultrasonic clasp testing for every registered Siera jewel.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs uppercase tracking-widest font-medium px-8 py-3.5 rounded-[2px] transition-colors"
                  >
                    <span>Explore the Fine Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[var(--surface-muted)] rounded-[2px]">
                  <Image
                    src={STORY_IMAGES.packaging.src}
                    alt={STORY_IMAGES.packaging.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
