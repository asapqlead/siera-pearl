"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/types/product";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StickyBuyBox } from "@/components/product/StickyBuyBox";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { MobileStickyBar } from "@/components/product/MobileStickyBar";

export interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  allProducts?: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
  allProducts = [],
}: ProductDetailClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="site-container">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-sans text-[var(--text-tertiary)] font-light">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-[var(--brand)] transition-colors flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  Collection
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/catalog?category=${product.cat}`}
                  className="hover:text-[var(--brand)] transition-colors"
                >
                  {product.cat}
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--text)] font-semibold truncate max-w-xs sm:max-w-md" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Main 2-Column Luxury PDP Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
            {/* Left Column: Gallery & Accordions (7 Cols) */}
            <div className="lg:col-span-7 space-y-10">
              <ProductGallery product={product} />

              <div className="pt-4">
                <ProductAccordions product={product} />
              </div>
            </div>

            {/* Right Column: Sticky Buy Box (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <StickyBuyBox product={product} />
            </div>
          </div>

          {/* Client Reviews Section */}
          <ProductReviews product={product} className="mt-16" />

          {/* Curated Recommendations ("Complete the Look") */}
          <ProductRecommendations products={relatedProducts} className="mt-12" />

          {/* Recently Viewed Items */}
          {allProducts.length > 0 && (
            <RecentlyViewed
              currentProductId={product.id}
              allProducts={allProducts}
              className="mt-8"
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Mobile Bottom Sticky Bar */}
      <MobileStickyBar product={product} />

      {/* Global Shopping Bag Drawer */}
      <CartDrawer />
    </div>
  );
}
