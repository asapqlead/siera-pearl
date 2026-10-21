import React from "react";
import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountDashboardClient } from "@/components/account/AccountDashboardClient";

export const metadata: Metadata = {
  title: "Patron Account & Orders — Siera Pearl",
  description:
    "Review your fine pearl jewelry purchase history, real-time insured courier tracking, saved delivery destinations, and account preferences.",
  openGraph: {
    title: "Patron Account & Orders — Siera Pearl",
    description:
      "Review your fine pearl jewelry purchase history, real-time insured courier tracking, saved delivery destinations, and account preferences.",
    type: "website",
  },
};

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Global Navigation Layer */}
      <AnnouncementBar />
      <Header />

      {/* Main Account Dashboard */}
      <main id="main-content" className="flex-1">
        <AccountDashboardClient />
      </main>

      {/* Global Luxury Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
