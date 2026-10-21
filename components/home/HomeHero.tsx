import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HERO_IMAGE } from "@/lib/images";

export function HomeHero() {
  return (
    <section className="relative min-h-[82vh] lg:min-h-[88vh] flex items-end sm:items-center bg-[var(--brand-dark)] text-white overflow-hidden">
      {/* Background Editorial Photograph */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.88]"
        />
        {/* Subtle Luxury Gradient Overlay for Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/35 sm:to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full site-container py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Overline: Quiet uppercase, no pill, no icon */}
          <p className="text-xs uppercase tracking-[0.25em] text-white/80 font-medium">
            Natural Pearl Jewelry &middot; 18k Solid Gold
          </p>

          {/* H1: Exactly 6 words, pure serif typography, no split italic gold line */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-tight">
            Luminous pearls crafted for a lifetime.
          </h1>

          {/* Subtitle: Factual, calm, unhurried */}
          <p className="text-sm sm:text-base text-white/90 max-w-lg font-light leading-relaxed">
            Sustainably cultivated in pristine oceanic lagoons and hand-set in certified recycled 18k solid gold by generational jewelers.
          </p>

          {/* Actions: Exactly one primary CTA button + one text link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[var(--brand)] hover:bg-[var(--brand-dark)] active:scale-[0.98] text-white font-medium text-xs uppercase tracking-widest px-8 py-4 transition-all duration-200 rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Collection
            </Link>

            <Link
              href="/story"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-white/90 hover:text-white underline-offset-8 hover:underline transition-colors py-2 group"
            >
              <span>Read Our Story</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
