"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export interface ProductRecommendationsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ProductRecommendations({
  products,
  title = "Complete the Look",
  subtitle = "Heirloom pieces harmoniously matched in lustre and gold alloy.",
  className = "",
}: ProductRecommendationsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-14 border-t border-[var(--border)] ${className}`}>
      <div className="site-container">
        <header className="mb-8">
          <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)] font-sans font-medium">
            Curated Atelier Pairing
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-1 max-prose-ch">
              {subtitle}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
