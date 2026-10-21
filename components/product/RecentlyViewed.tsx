"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export interface RecentlyViewedProps {
  currentProductId: number;
  allProducts: Product[];
  className?: string;
}

const STORAGE_KEY = "siera_pearl_recently_viewed";

export function RecentlyViewed({
  currentProductId,
  allProducts,
  className = "",
}: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const ids: number[] = stored ? JSON.parse(stored) : [];

      // Filter to find products other than current
      const filtered = ids
        .filter((id) => id !== currentProductId)
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4);

      setRecentItems(filtered);

      // Append current product to recently viewed list (max 10)
      const updated = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not access recently viewed items in localStorage", e);
    }
  }, [currentProductId, allProducts]);

  if (recentItems.length === 0) return null;

  return (
    <section className={`py-12 border-t border-[var(--border)] ${className}`}>
      <div className="site-container">
        <header className="mb-8">
          <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)] font-sans font-medium">
            Your Browsing Atelier
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal mt-1">
            Recently Viewed
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {recentItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
