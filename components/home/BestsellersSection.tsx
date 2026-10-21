import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";

interface BestsellersSectionProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  // Select top 4 bestsellers (or fallback to first 4 products)
  const bestsellers = React.useMemo(() => {
    const featured = products.filter((p) => p.badge === "Bestseller");
    if (featured.length >= 4) return featured.slice(0, 4);
    const combined = [...featured, ...products.filter((p) => p.badge !== "Bestseller")];
    return combined.slice(0, 4);
  }, [products]);

  return (
    <section className="py-20 sm:py-24 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Curated Masterpieces
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
              Our Most Cherished Designs
            </h2>
          </div>
          <Link
            href="/catalog?sort=featured"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[var(--brand)] hover:text-[var(--accent)] transition-colors group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestsellers.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={idx < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
