"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Suppress footer on distraction-free checkout
  if (pathname?.startsWith("/checkout")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSuccess(true);
  };

  return (
    <footer className="bg-[var(--brand)] text-[var(--bg)] border-t border-[var(--brand-hover)] pt-16 pb-12 select-none">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 space-y-16">
        {/* Newsletter Section */}
        <div className="pb-12 border-b border-[var(--brand-hover)] max-w-xl">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] font-semibold">
              The Siera Journal
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Private lagoon harvests &amp; jewelry notes
            </h3>
            <p className="text-xs sm:text-sm text-[var(--bg)]/75 font-light leading-relaxed">
              Subscribe for notice of limited harvests, private salon appointments, and care guidance.
            </p>
          </div>

          <div className="pt-4">
            {isSuccess ? (
              <div className="flex items-center gap-2 p-3 bg-[var(--brand-hover)] text-[var(--bg)] rounded-[3px] text-xs">
                <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                <span>Thank you. You are subscribed to our private communications.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 h-11 px-3.5 bg-[var(--brand-hover)] text-white text-xs sm:text-sm rounded-[3px] border border-[var(--brand-hover)] placeholder:text-[var(--bg)]/45 focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="submit"
                    className="h-11 px-5 bg-white text-[var(--brand)] text-xs font-semibold uppercase tracking-wider rounded-[3px] hover:bg-[var(--surface-muted)] transition-colors btn-press flex-shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                  >
                    Subscribe
                  </button>
                </div>
                {error && (
                  <p className="text-xs text-[#E9BBA0] flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Navigation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[var(--brand-hover)] text-xs font-light">
          {/* Brand Info & Region */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block py-1">
              <span className="font-serif text-2xl text-white tracking-tight">Siera Pearl</span>
            </Link>
            <p className="text-[var(--bg)]/75 leading-relaxed max-w-sm">
              Certified natural Akoya, Tahitian, South Sea, and Freshwater pearls hand-set in certified recycled 18k solid gold.
            </p>
            <div className="pt-2 text-[11px] text-[var(--accent)]">
              <span>Region: United States · USD ($)</span>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Fine Jewelry
            </h4>
            <ul className="space-y-2.5 text-[var(--bg)]/80">
              <li>
                <Link href="/catalog?category=Necklaces" className="hover:text-white transition-colors">
                  Pearl Necklaces &amp; Strands
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Earrings" className="hover:text-white transition-colors">
                  Stud &amp; Drop Earrings
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Bracelets" className="hover:text-white transition-colors">
                  Tennis Bracelets &amp; Bangles
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Rings" className="hover:text-white transition-colors">
                  Solitaire &amp; Halo Rings
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Bridal" className="hover:text-white transition-colors">
                  Bridal Suites &amp; Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Client Care */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-[var(--bg)]/80">
              <li>
                <Link href="/shipping-returns" className="hover:text-white transition-colors">
                  Free Insured Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="hover:text-white transition-colors">
                  Pearl Care &amp; Cleaning Guide
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Ring &amp; Bracelet Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Concierge Contact &amp; Appointments
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sourcing & Integrity */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Our Principles
            </h4>
            <ul className="space-y-2.5 text-[var(--bg)]/80">
              <li>
                <Link href="/story" className="hover:text-white transition-colors">
                  Our Marine Story
                </Link>
              </li>
              <li>
                <span className="text-[var(--bg)]/60">Certified Natural Nacre</span>
              </li>
              <li>
                <span className="text-[var(--bg)]/60">Recycled 18k Solid Gold</span>
              </li>
              <li>
                <Link href="/admin" className="text-[var(--accent)] hover:underline pt-2 block font-normal">
                  Stock Controller →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Payment Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-[var(--bg)]/60">
          <div>
            &copy; {new Date().getFullYear()} Siera Pearl. All rights reserved. Handcrafted fine jewelry.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-white/80 font-medium tracking-wide">Visa</span>
            <span>·</span>
            <span className="text-white/80 font-medium tracking-wide">Mastercard</span>
            <span>·</span>
            <span className="text-white/80 font-medium tracking-wide">Amex</span>
            <span>·</span>
            <span className="text-white/80 font-medium tracking-wide">Apple Pay</span>
            <span>·</span>
            <span className="text-white/80 font-medium tracking-wide">Shop Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
