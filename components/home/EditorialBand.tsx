import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STORY_IMAGES } from "@/lib/images";

export function EditorialBand() {
  return (
    <section className="py-20 sm:py-28 bg-[var(--surface-muted)] border-b border-[var(--border)] overflow-hidden">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Craft Photography */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[var(--border)] rounded-[2px]">
              <Image
                src={STORY_IMAGES.craft.src}
                alt={STORY_IMAGES.craft.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Conscious Craft & Sourcing
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal leading-[1.14] tracking-tight">
              Born in pristine lagoons. Handcrafted in solid gold.
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Every Siera pearl begins in protected marine reserves where unhurried cultivation produces extraordinary nacre density and mirror-grade orient. In our atelier, each specimen is hand-selected and permanently mounted into certified recycled 18k solid gold by generational jewelers.
            </p>

            {/* 3 Factual Pillars (Quiet hairline grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[var(--border)]">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--text)]">
                  Lagoon Origins
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] font-light mt-1 leading-relaxed">
                  Cultivated in bio-diverse, protected sanctuary lagoons.
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--text)]">
                  18k Recycled Gold
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] font-light mt-1 leading-relaxed">
                  Solid 750 gold, never hollowed, vermeil, or plated.
                </p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[var(--text)]">
                  Atelier Longevity
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] font-light mt-1 leading-relaxed">
                  Hand-knotted on Japanese silk with lifetime restringing.
                </p>
              </div>
            </div>

            {/* Text Link */}
            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--brand)] hover:text-[var(--accent)] transition-colors group"
              >
                <span>Read Our Story & Craft Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
