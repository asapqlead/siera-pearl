import React from "react";
import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Fine Jewelry Sizing Guide — Siera Pearl",
  description:
    "Comprehensive international conversion charts and measurement rituals for rings, bracelets, and pearl necklaces.",
  openGraph: {
    title: "Fine Jewelry Sizing Guide — Siera Pearl",
    description:
      "International conversion charts for rings, bracelets, and pearl necklaces.",
    type: "website",
  },
};

const RING_SIZES = [
  { us: "4", uk: "H", eu: "47", diameterMm: "14.9", circumferenceMm: "46.8" },
  { us: "5", uk: "J 1/2", eu: "49", diameterMm: "15.7", circumferenceMm: "49.3" },
  { us: "6", uk: "L 1/2", eu: "51.5", diameterMm: "16.5", circumferenceMm: "51.9" },
  { us: "7", uk: "N 1/2", eu: "54", diameterMm: "17.3", circumferenceMm: "54.4" },
  { us: "8", uk: "P 1/2", eu: "56.5", diameterMm: "18.1", circumferenceMm: "57.0" },
  { us: "9", uk: "R 1/2", eu: "59", diameterMm: "18.9", circumferenceMm: "59.5" },
  { us: "10", uk: "T 1/2", eu: "61.5", diameterMm: "19.8", circumferenceMm: "62.1" },
];

const BRACELET_SIZES = [
  { size: "Small (S)", lengthInches: '6.3"', lengthCm: "16.0 cm", wristFit: "Fits wrists 14.0 – 15.5 cm" },
  { size: "Medium (M)", lengthInches: '6.9"', lengthCm: "17.5 cm", wristFit: "Fits wrists 15.6 – 17.0 cm (Standard)" },
  { size: "Large (L)", lengthInches: '7.5"', lengthCm: "19.0 cm", wristFit: "Fits wrists 17.1 – 18.5 cm" },
];

const NECKLACE_LENGTHS = [
  { name: "Choker", length: '14" / 35 cm', placement: "Wraps closely around the throat; ideal for open necklines." },
  { name: "Collar", length: '16" / 40 cm', placement: "Rests gently along the base of the throat at the collarbone." },
  { name: "Princess", length: '18" / 45 cm', placement: "Our most classic length; rests gracefully over the collarbone." },
  { name: "Matinee", length: '20"–24" / 50–60 cm', placement: "Falls between collarbone and center of the bust; versatile styling." },
  { name: "Opera", length: '30"–36" / 75–90 cm', placement: "Rests below the bust line; can be worn single or doubled." },
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="py-14 sm:py-20 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-3">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Size Guide" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Precision Fit
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal tracking-tight">
              Fine Jewelry Sizing Guide
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto leading-relaxed">
              Find your ideal fit with our international conversion tables and measurement guidance for rings, bracelets, and necklace strands.
            </p>
          </div>
        </section>

        <div className="site-container max-w-4xl py-16 sm:py-20 space-y-16">
          {/* 1. Ring Sizing */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 01
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Ring Sizing &amp; Conversions
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light">
                If your measurement falls between two sizes, we recommend ordering the larger size.
              </p>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4 sm:px-6 font-medium">US Size</th>
                    <th className="py-3 px-4 sm:px-6 font-medium">UK / AU</th>
                    <th className="py-3 px-4 sm:px-6 font-medium">EU</th>
                    <th className="py-3 px-4 sm:px-6 font-medium">Inside Diameter</th>
                    <th className="py-3 px-4 sm:px-6 font-medium text-right">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {RING_SIZES.map((row) => (
                    <tr key={row.us}>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-[var(--text)]">{row.us}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-[var(--text-secondary)]">{row.uk}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-[var(--text-secondary)]">{row.eu}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-[var(--text-secondary)] font-mono">{row.diameterMm} mm</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right text-[var(--text-secondary)] font-mono">{row.circumferenceMm} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] text-xs text-[var(--text-secondary)] font-light space-y-2">
              <h4 className="font-serif text-base text-[var(--text)] font-medium">
                How to Measure Your Ring Finger at Home
              </h4>
              <p className="leading-relaxed">
                Wrap a narrow strip of paper or non-stretchy string around the base of your chosen finger. Mark where the ends overlap with a fine pen. Measure the length against a millimeter ruler to find your circumference, then refer to the chart above.
              </p>
            </div>
          </div>

          {/* 2. Bracelet Sizing */}
          <div className="space-y-6 pt-6 border-t border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 02
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Bracelet Sizing
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light">
                Measure snugly around your wrist bone with a tailor&apos;s tape, then add 1.5 cm for comfortable pearl drape.
              </p>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-6 font-medium">Size</th>
                    <th className="py-3 px-6 font-medium">Length (Inches)</th>
                    <th className="py-3 px-6 font-medium">Length (Centimeters)</th>
                    <th className="py-3 px-6 font-medium text-right">Ideal Wrist Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {BRACELET_SIZES.map((row) => (
                    <tr key={row.size}>
                      <td className="py-3.5 px-6 font-medium text-[var(--text)]">{row.size}</td>
                      <td className="py-3.5 px-6 text-[var(--text-secondary)] font-mono">{row.lengthInches}</td>
                      <td className="py-3.5 px-6 text-[var(--text-secondary)] font-mono">{row.lengthCm}</td>
                      <td className="py-3.5 px-6 text-right text-[var(--text-secondary)] font-light">{row.wristFit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Necklace Sizing */}
          <div className="space-y-6 pt-6 border-t border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 03
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Necklace Length Guide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NECKLACE_LENGTHS.map((item) => (
                <div key={item.name} className="p-6 bg-white border border-[var(--border)] rounded-[2px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-[var(--text)] font-medium">{item.name}</h3>
                    <span className="text-xs font-mono text-[var(--accent)]">{item.length}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    {item.placement}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] text-xs text-[var(--text-secondary)] font-light flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text)] font-medium block">
                  Need a Bespoke Strand Length?
                </strong>
                Our master ateliers hand-knot strands to custom centimeter specifications. Contact our concierge at <a href="mailto:concierge@sierapearl.com" className="text-[var(--brand)] underline">concierge@sierapearl.com</a> for private assistance.
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
