"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, Lock } from "lucide-react";

import { ProductCategory } from "@/types/product";
import { MegaMenu } from "./MegaMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MobileNav } from "./MobileNav";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const NAV_CATEGORIES: ProductCategory[] = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Rings",
  "Bridal",
];

export interface HeaderProps {
  onCategorySelect?: (cat: ProductCategory | "all") => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function Header({ onCategorySelect: _onCategorySelect, searchQuery: _searchQuery, onSearchChange: _onSearchChange }: HeaderProps = {}) {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { cartCount, openCart } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<ProductCategory | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 40 && !isScrolled) setIsScrolled(true);
      else if (top <= 40 && isScrolled) setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Distraction-free Header for Checkout
  if (pathname?.startsWith("/checkout")) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[var(--border)] h-[72px] flex items-center justify-between px-6 sm:px-12">
        <Link href="/" className="font-serif text-2xl font-normal text-[var(--text)] tracking-tight">
          Siera Pearl
        </Link>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium select-none">
          <Lock className="w-3.5 h-3.5 text-[var(--brand)]" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </header>
    );
  }

  // Admin route has its own internal shell
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border)] transition-all duration-200 ${
          isScrolled ? "h-[62px] shadow-xs" : "h-[72px]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 text-[var(--text)] hover:text-[var(--brand)] transition-colors rounded-[3px] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="flex items-center group py-1 select-none focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              aria-label="Siera Pearl Home"
            >
              <div className="relative h-8 w-28 sm:h-9 sm:w-36 transition-transform duration-200 group-hover:scale-[1.02]">
                <Image
                  src="/assets/images/logo.webp"
                  alt="Siera Pearl"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-contain object-left"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="sr-only">Siera Pearl</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation (Single line, strictly never wraps) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 h-full px-4">
            <div className="flex items-center gap-7 xl:gap-9 whitespace-nowrap">
              {NAV_CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  onMouseEnter={() => setActiveMegaCategory(cat)}
                  className="relative h-full flex items-center"
                >
                  <Link
                    href={`/catalog?category=${cat}`}
                    className={`text-xs uppercase tracking-[0.14em] font-medium py-2 transition-colors relative hover:text-[var(--brand)] ${
                      activeMegaCategory === cat
                        ? "text-[var(--brand)] font-semibold"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    <span>{cat}</span>
                    {activeMegaCategory === cat && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--brand)] rounded-t-[1px]" />
                    )}
                  </Link>
                </div>
              ))}

              <Link
                href="/story"
                onMouseEnter={() => setActiveMegaCategory(null)}
                className="text-xs uppercase tracking-[0.14em] font-medium text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors py-2"
              >
                Our Story
              </Link>
            </div>
          </nav>

          {/* Right: Search, Account, Wishlist, Bag Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 text-[var(--text)]">
            {/* Search Icon Trigger */}
            <button
              type="button"
              onClick={() => {
                setActiveMegaCategory(null);
                setSearchOpen(true);
              }}
              aria-label="Search Fine Jewelry"
              title="Search"
              className="p-2 sm:p-2.5 text-[var(--text)] hover:text-[var(--brand)] rounded-[3px] transition-colors btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              aria-label="Customer Account"
              title="Account"
              className="p-2 sm:p-2.5 text-[var(--text)] hover:text-[var(--brand)] rounded-[3px] transition-colors btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)] hidden sm:inline-flex"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist Icon with Count Badge */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} saved items)`}
              title="Wishlist"
              className="p-2 sm:p-2.5 text-[var(--text)] hover:text-[var(--brand)] rounded-[3px] transition-colors btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <span className="relative inline-flex items-center justify-center">
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {mounted && wishlistCount > 0 && (
                  <span
                    key={wishlistCount}
                    className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand)] text-white text-[10px] font-sans font-bold flex items-center justify-center leading-none border-2 border-white shadow-xs tabular-nums select-none animate-badge-pop"
                  >
                    {wishlistCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Shopping Bag Icon with Count Badge */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Shopping Bag (${cartCount} ${cartCount === 1 ? "item" : "items"})`}
              title="Shopping Bag"
              className="p-2 sm:p-2.5 text-[var(--text)] hover:text-[var(--brand)] rounded-[3px] transition-colors btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
            >
              <span className="relative inline-flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {mounted && cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--brand)] text-white text-[10px] font-sans font-bold flex items-center justify-center leading-none border-2 border-white shadow-xs tabular-nums select-none animate-badge-pop"
                  >
                    {cartCount}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Hover Mega-Menu dropdown */}
        {activeMegaCategory && (
          <MegaMenu
            category={activeMegaCategory}
            onClose={() => setActiveMegaCategory(null)}
          />
        )}
      </header>

      {/* Full-width Search Modal Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Mobile Full-Screen Navigation Menu */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
