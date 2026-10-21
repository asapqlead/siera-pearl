import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORY_TILES } from "@/lib/images";
import { ProductCategory } from "@/types/product";

interface CategoryMeta {
  key: ProductCategory;
  title: string;
  subtitle: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: "Necklaces",
    title: "Necklaces",
    subtitle: "Strands & Pendants",
  },
  {
    key: "Earrings",
    title: "Earrings",
    subtitle: "Studs & Drops",
  },
  {
    key: "Bracelets",
    title: "Bracelets",
    subtitle: "Chains & Bangles",
  },
  {
    key: "Rings",
    title: "Rings",
    subtitle: "Solitaires & Bands",
  },
  {
    key: "Bridal",
    title: "Bridal",
    subtitle: "Curated Suites",
  },
];

export function CategoryTiles() {
  return (
    <section className="py-20 sm:py-24 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Curated Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--brand)] hover:text-[var(--accent)] transition-colors group"
          >
            <span>View All Jewelry</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const tile = CATEGORY_TILES[cat.key];
            return (
              <Link
                key={cat.key}
                href={`/catalog?category=${cat.key}`}
                className="group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
              >
                {/* 4:5 Portrait Image Tile with Zero Radius / Zero Border */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-muted)]">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Label Cleanly Positioned Beneath the Image */}
                <div className="pt-3.5 space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl text-[var(--text)] font-medium group-hover:text-[var(--brand)] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-light">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
