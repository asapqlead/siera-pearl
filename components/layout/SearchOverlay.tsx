"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, History } from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";
import { Product } from "@/types/product";
import { Price } from "@/components/ui/Price";

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_TERMS = [
  "Akoya Studs",
  "South Sea Drops",
  "Tennis Bracelet",
  "Solitaire Ring",
  "Bridal Suite",
  "18k Rose Gold",
  "Tahitian Lariat",
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("siera_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Autofocus input and listen to ESC
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("siera_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  const handleProductClick = (term: string) => {
    saveRecentSearch(term);
    onClose();
  };

  const results: Product[] = query.trim()
    ? INITIAL_PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          p.pearl.toLowerCase().includes(q) ||
          p.metal.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Fine Jewelry"
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      {/* Search Header Bar */}
      <div className="border-b border-[var(--border)] px-4 sm:px-8 py-5 flex items-center gap-4 bg-[var(--bg)]">
        <Search className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Akoya strands, gold drops, rings, bridal..."
          className="flex-1 bg-transparent text-base sm:text-lg font-sans text-[var(--text)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text)] uppercase tracking-wider p-1"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="p-2 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[3px] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Body Content */}
      <div className="flex-1 overflow-y-auto max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Results view if query exists */}
        {query.trim() ? (
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <h3 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                Matching Pieces ({results.length})
              </h3>
              {results.length > 0 && (
                <Link
                  href={`/catalog?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>View all in catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                <p className="font-serif text-2xl text-[var(--text)]">
                  No jewelry matches &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                  Try checking for spelling, searching by pearl variety (Akoya, Tahitian, South Sea), or exploring our popular search terms below.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-2">
                  {POPULAR_TERMS.slice(0, 4).map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectTerm(term)}
                      className="text-xs bg-[var(--surface-muted)] hover:bg-[var(--border)] text-[var(--text)] px-3 py-1.5 rounded-[3px] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => {
                  const photos = getProductPhotos(product);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => handleProductClick(product.name)}
                      className="group flex gap-4 p-3 rounded-[3px] hover:bg-[var(--surface-muted)] transition-colors border border-transparent hover:border-[var(--border)]"
                    >
                      <div className="relative w-20 h-24 bg-white flex-shrink-0 overflow-hidden rounded-[2px] border border-[var(--border-subtle)]">
                        <Image
                          src={photos.primary}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium">
                            {product.cat} · {product.metal}
                          </div>
                          <h4 className="font-serif text-base text-[var(--text)] group-hover:text-[var(--brand)] transition-colors font-medium leading-snug mt-0.5">
                            {product.name}
                          </h4>
                        </div>
                        <Price price={product.price} was={product.was} size="sm" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Default Discover State (Recent + Popular Terms) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <h3 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Recent Searches</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem("siera_recent_searches");
                    }}
                    className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text)]"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectTerm(term)}
                      className="w-full text-left py-1.5 text-sm text-[var(--text)] hover:text-[var(--brand)] transition-colors flex items-center justify-between group"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Jewelry Terms */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                  Popular Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTerm(term)}
                    className="text-xs bg-[var(--surface-muted)] hover:bg-[var(--border)] text-[var(--text)] px-3.5 py-2 rounded-[3px] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
