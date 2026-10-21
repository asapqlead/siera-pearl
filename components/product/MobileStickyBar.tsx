"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Product, MetalType } from "@/types/product";
import { formatMoney } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";
import { useCart } from "@/context/CartContext";

export interface MobileStickyBarProps {
  product: Product;
  selectedMetal?: MetalType;
}

export function MobileStickyBar({ product, selectedMetal }: MobileStickyBarProps) {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const photos = getProductPhotos(product);
  const metal = selectedMetal || product.metal;

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 480 && !isVisible) setIsVisible(true);
      else if (top <= 480 && isVisible) setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  if (!isVisible) return null;

  const handleAdd = () => {
    if (!product.in_stock) return;
    addToCart(product, 1, metal);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--border)] p-3.5 shadow-lg lg:hidden animate-toast-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 rounded-[2px] overflow-hidden bg-[var(--surface-muted)] flex-shrink-0 border border-[var(--border)]">
            <Image
              src={photos.primary}
              alt={product.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 pr-1">
            <div className="font-serif text-sm text-[var(--text)] truncate font-normal leading-tight">
              {product.name}
            </div>
            <div className="text-xs font-sans text-[var(--text-secondary)] font-medium mt-0.5 tabular-nums">
              {formatMoney(product.price)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.in_stock}
          className={`h-10 px-5 rounded-[2px] text-xs font-sans uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0 btn-press cursor-pointer ${
            justAdded
              ? "bg-[var(--brand)] text-[var(--accent)]"
              : product.in_stock
              ? "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
              : "bg-[var(--surface-muted)] text-[var(--text-tertiary)] cursor-not-allowed"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-2" />
              <span>Added</span>
            </>
          ) : product.in_stock ? (
            <>
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Add to Bag</span>
            </>
          ) : (
            <span>Sold Out</span>
          )}
        </button>
      </div>
    </div>
  );
}
