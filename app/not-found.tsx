import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1 flex items-center justify-center py-20 sm:py-28">
        <div className="site-container max-w-xl text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-medium">
            Error 404 &middot; Page Not Located
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] font-normal tracking-tight">
            The piece you seek is not in our current gallery.
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
            The page or jewel you are seeking may have been retired into our archival vault, renamed, or moved.
          </p>

          {/* Quick Collection Links */}
          <div className="pt-6 border-t border-[var(--border)] space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block">
              Explore Our Core Collections
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: "Necklaces", href: "/catalog?category=Necklaces" },
                { name: "Earrings", href: "/catalog?category=Earrings" },
                { name: "Bracelets", href: "/catalog?category=Bracelets" },
                { name: "Rings", href: "/catalog?category=Rings" },
                { name: "Bridal", href: "/catalog?category=Bridal" },
              ].map((c) => (
                <Link
                  key={c.name}
                  href={c.href}
                  className="px-4 py-2 bg-white border border-[var(--border)] hover:border-[var(--brand)] text-xs text-[var(--text)] rounded-[2px] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs uppercase tracking-widest font-medium px-8 py-3.5 rounded-[2px] transition-colors"
            >
              <span>View Complete Collection</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-[var(--border)] hover:border-[var(--brand)] text-[var(--text)] text-xs uppercase tracking-widest font-medium px-8 py-3.5 rounded-[2px] transition-colors"
            >
              Return to Boutique
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
