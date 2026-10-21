import React from "react";
import type { Metadata } from "next";
import { Shield, AlertTriangle } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Natural Pearl Care & Longevity Ritual — Siera Pearl",
  description:
    "Expert instructions for preserving the deep lustre and orient of natural pearls and 18k solid gold across generations.",
  openGraph: {
    title: "Natural Pearl Care & Longevity Ritual — Siera Pearl",
    description:
      "Expert instructions for preserving the deep lustre and orient of natural pearls across generations.",
    type: "website",
  },
};

export default function CareGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="py-14 sm:py-20 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-3">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Care Guide" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Heirloom Preservation
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal tracking-tight">
              Natural Pearl Care Ritual
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto leading-relaxed">
              Pearls are organic gemstones created in living waters. With gentle, mindful care, their deep mirror lustre will endure for lifetimes.
            </p>
          </div>
        </section>

        {/* Ritual Steps */}
        <div className="site-container max-w-4xl py-16 sm:py-20 space-y-16">
          {/* Rule 1: Last On, First Off */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Ritual 01
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal mt-1">
                The Golden Rule: Last On, First Off
              </h2>
            </div>
            <div className="md:col-span-8 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed space-y-3">
              <p>
                Cosmetics, hairsprays, body lotions, and perfumes contain mild alcohols and acidic compounds that can slowly erode the delicate aragonite crystals of a pearl&apos;s nacre over time.
              </p>
              <p>
                Always apply all beauty products, fragrances, and styling sprays first. Allow your skin to dry completely before fastening your pearl necklace, earrings, or rings. When returning home, make your pearls the first items you remove.
              </p>
            </div>
          </div>

          {/* Rule 2: Cleaning */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-10 border-t border-[var(--border)]">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Ritual 02
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal mt-1">
                Gentle Cleansing
              </h2>
            </div>
            <div className="md:col-span-8 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed space-y-4">
              <p>
                After each wear, wipe your pearls with a soft, lint-free microfibre or silk cloth slightly dampened with lukewarm water to remove natural skin oils and trace perspiration.
              </p>
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-[2px] text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Never Use Ultrasonic Cleaners or Steamers</span>
                </div>
                <p className="font-light leading-relaxed">
                  High-frequency ultrasonic vibrations will fracture the microscopic crystalline lattice of pearl nacre, and steam will dehydrate organic pearls. Never submerge strung pearl necklaces in water, as this weakens the Japanese silk cords.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 3: Storage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-10 border-t border-[var(--border)]">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Ritual 03
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal mt-1">
                Proper Storage &amp; Hydration
              </h2>
            </div>
            <div className="md:col-span-8 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed space-y-3">
              <p>
                Pearls rank 2.5 to 4.5 on the Mohs hardness scale. Storing them loose alongside diamonds, sapphires, or hard metallic clasps can cause surface scratches.
              </p>
              <p>
                Always store your pieces flat in the warm ivory velvet presentation case provided, or wrapped in a breathable silk pouch. Never store pearls in airtight plastic containers or safety deposit boxes for years without humidity, as pearls require ambient moisture from the air to maintain their orient.
              </p>
            </div>
          </div>

          {/* Rule 4: Restringing & Lifetime Atelier Support */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-10 border-t border-[var(--border)]">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Ritual 04
              </span>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal mt-1">
                Restringing &amp; Inspection
              </h2>
            </div>
            <div className="md:col-span-8 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed space-y-4">
              <p>
                With frequent wear, the fine Japanese silk knots between each pearl will naturally stretch. We recommend having pearl strands evaluated every 12 to 24 months.
              </p>
              <div className="p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--brand)]" />
                  <h4 className="font-serif text-base text-[var(--text)] font-medium">
                    Complimentary Siera Restringing Inspection
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                  Every registered Siera Pearl jewel includes complimentary annual inspection, clasp ultrasonic testing, and knot tension appraisal. Contact our concierge at <a href="mailto:concierge@sierapearl.com" className="text-[var(--brand)] underline">concierge@sierapearl.com</a> to arrange service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
