"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { CartItem } from "@/types/product";
import { INITIAL_PRODUCTS, formatMoney } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";
import { useCart } from "@/context/CartContext";

export interface CrossSellRowProps {
  currentCart: CartItem[];
  className?: string;
}

export function CrossSellRow({ currentCart, className = "" }: CrossSellRowProps) {
  const { addToCart } = useCart();

  // Find 2 companion products not already in the cart
  const crossSellProducts = useMemo(() => {
    const cartIds = new Set(currentCart.map((i) => i.id));
    // Pick popular accessible items (e.g. solitaire pendant, earrings)
    return INITIAL_PRODUCTS.filter((p) => !cartIds.has(p.id) && p.in_stock).slice(0, 2);
  }, [currentCart]);

  if (crossSellProducts.length === 0) return null;

  return (
    <div className={`p-4 rounded-[2px] bg-[var(--surface-muted)] border border-[var(--border)] space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-sans">
        <span className="uppercase tracking-[0.12em] font-medium text-[var(--text-tertiary)]">
          Pairs Well With
        </span>
        <span className="text-[11px] text-[var(--text-secondary)] font-light">
          Atelier Pairings
        </span>
      </div>

      <div className="space-y-2.5">
        {crossSellProducts.map((prod) => {
          const photos = getProductPhotos(prod);
          return (
            <div
              key={prod.id}
              className="flex items-center justify-between gap-3 p-2 bg-white rounded-[2px] border border-[var(--border)] transition-colors hover:border-[var(--brand)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-12 aspect-[4/5] rounded-[2px] overflow-hidden bg-[var(--surface-muted)] flex-shrink-0 border border-[var(--border)]">
                  <Image
                    src={photos.primary}
                    alt={prod.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 pr-1">
                  <h5 className="font-serif text-xs text-[var(--text)] font-normal truncate">
                    {prod.name}
                  </h5>
                  <div className="text-[11px] font-sans text-[var(--text-secondary)] tabular-nums mt-0.5">
                    {formatMoney(prod.price)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => addToCart(prod, 1, prod.metal, false)}
                className="h-7 px-2.5 rounded-[2px] bg-white border border-[var(--border)] hover:border-[var(--brand)] text-[var(--text)] hover:text-[var(--brand)] text-[11px] font-sans font-medium uppercase tracking-wider flex items-center gap-1 transition-colors flex-shrink-0 btn-press cursor-pointer"
                title={`Add ${prod.name} to Bag`}
                aria-label={`Add ${prod.name} to Bag`}
              >
                <Plus className="w-3 h-3 stroke-[2]" />
                <span>Add</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
