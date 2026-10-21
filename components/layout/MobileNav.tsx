"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronDown, User, Heart, ShoppingBag } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { MEGA_MENU_DATA } from "./MegaMenu";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ProductCategory[] = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Rings",
  "Bridal",
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [openCategory, setOpenCategory] = useState<ProductCategory | null>(null);
  const { wishlistCount } = useWishlist();
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCategory = (cat: ProductCategory) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden animate-drawer-in"
    >
      {/* Mobile Top Bar */}
      <div className="h-[72px] px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg)]">
        <Link
          href="/"
          onClick={onClose}
          className="font-serif text-2xl font-normal tracking-tight text-[var(--text)]"
        >
          Siera Pearl
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="p-2 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[3px] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Categories Accordions */}
        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {CATEGORIES.map((cat) => {
            const isExpanded = openCategory === cat;
            const data = MEGA_MENU_DATA[cat];

            return (
              <div key={cat} className="py-2">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="w-full py-3 flex items-center justify-between text-left text-base font-serif text-[var(--text)]"
                >
                  <span>{cat}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-[var(--brand)]" : ""
                    }`}
                  />
                </button>

                {isExpanded && data && (
                  <div className="pl-4 pb-3 space-y-2.5 animate-toast-in">
                    {data.subcategories.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={onClose}
                        className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--brand)] py-1"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Content & Editorial Links */}
        <div className="space-y-3 pt-2 text-xs uppercase tracking-wider font-medium text-[var(--text-secondary)]">
          <div>
            <Link
              href="/story"
              onClick={onClose}
              className="block py-2 hover:text-[var(--brand)] transition-colors"
            >
              Our Marine Story
            </Link>
          </div>
          <div>
            <Link
              href="/shipping-returns"
              onClick={onClose}
              className="block py-2 hover:text-[var(--brand)] transition-colors"
            >
              Shipping &amp; 30-Day Returns
            </Link>
          </div>
          <div>
            <Link
              href="/care-guide"
              onClick={onClose}
              className="block py-2 hover:text-[var(--brand)] transition-colors"
            >
              Pearl Care &amp; Cleaning
            </Link>
          </div>
          <div>
            <Link
              href="/size-guide"
              onClick={onClose}
              className="block py-2 hover:text-[var(--brand)] transition-colors"
            >
              Ring &amp; Bracelet Size Guide
            </Link>
          </div>
          <div>
            <Link
              href="/contact"
              onClick={onClose}
              className="block py-2 hover:text-[var(--brand)] transition-colors"
            >
              Concierge Contact
            </Link>
          </div>
        </div>

        {/* Account, Wishlist & Bag Shortcuts */}
        <div className="pt-6 border-t border-[var(--border)] grid grid-cols-3 gap-3">
          <Link
            href="/account"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3 rounded-[3px] bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--border)] text-xs text-center"
          >
            <User className="w-4 h-4 mb-1" />
            <span>Account</span>
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-3 rounded-[3px] bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--border)] text-xs text-center"
          >
            <span className="relative inline-flex items-center justify-center mb-1">
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--brand)] text-white text-[9px] flex items-center justify-center font-bold border border-white tabular-nums leading-none">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span>Wishlist</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              openCart();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-[3px] bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--border)] text-xs text-center cursor-pointer"
          >
            <span className="relative inline-flex items-center justify-center mb-1">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--brand)] text-white text-[9px] flex items-center justify-center font-bold border border-white tabular-nums leading-none">
                  {cartCount}
                </span>
              )}
            </span>
            <span>Bag</span>
          </button>
        </div>
      </div>

      {/* Region / Currency Indicator */}
      <div className="p-5 border-t border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
        <span>Region: United States</span>
        <span className="font-sans font-medium text-[var(--text)]">USD ($)</span>
      </div>
    </div>
  );
}
