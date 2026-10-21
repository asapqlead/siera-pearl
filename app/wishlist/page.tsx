import React from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistClient } from "@/components/account/WishlistClient";

export const metadata: Metadata = {
  title: "Saved Pieces — Wishlist | Siera Pearl",
  description:
    "Review your curated fine pearl jewelry wishlist. Save pieces to evaluate later or move directly into your complimentary insured bag.",
  openGraph: {
    title: "Saved Pieces — Wishlist | Siera Pearl",
    description:
      "Review your curated fine pearl jewelry wishlist. Save pieces to evaluate later or move directly into your complimentary insured bag.",
    type: "website",
  },
};

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Global Navigation Layer */}
      <AnnouncementBar />
      <Header />

      {/* Main Wishlist Client */}
      <main id="main-content" className="flex-1">
        <WishlistClient allProducts={products} />
      </main>

      {/* Global Luxury Footer */}
      <Footer />

      {/* Cart Drawer for Instant Move to Bag */}
      <CartDrawer />
    </div>
  );
}
