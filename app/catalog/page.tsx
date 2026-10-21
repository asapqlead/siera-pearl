import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Fine Pearl Jewelry Collection — Siera Pearl",
  description:
    "Explore our complete gallery of natural Akoya, South Sea, Tahitian, and Freshwater pearl necklaces, earrings, bracelets, rings, and bridal suites in 18k solid gold.",
  openGraph: {
    title: "Fine Pearl Jewelry Collection — Siera Pearl",
    description:
      "Explore our complete gallery of natural Akoya, South Sea, Tahitian, and Freshwater pearl jewelry in 18k solid gold.",
    type: "website",
  },
};

function CatalogSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <div className="h-9 bg-[var(--brand)] animate-pulse" />
      <div className="h-[72px] bg-white border-b border-[var(--border)]" />
      <main className="flex-1 py-12 site-container">
        <div className="h-10 w-72 bg-[var(--border)] rounded-[2px] animate-pulse mb-4" />
        <div className="h-4 w-96 bg-[var(--border)] rounded-[2px] animate-pulse mb-10" />
        <div className="h-12 w-full bg-white border border-[var(--border)] rounded-[2px] mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="aspect-[4/5] bg-[var(--surface-muted)] rounded-[2px] animate-pulse" />
              <div className="h-3 w-28 bg-[var(--border)] rounded-[2px] animate-pulse" />
              <div className="h-4 w-48 bg-[var(--border)] rounded-[2px] animate-pulse" />
              <div className="h-4 w-20 bg-[var(--border)] rounded-[2px] animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogClient initialProducts={products} />
    </Suspense>
  );
}
