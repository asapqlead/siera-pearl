"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, MetalType } from "@/types/product";
import { formatMoney } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";
import { QuantityStepper } from "@/components/ui/QuantityStepper";

export interface CartLineItemProps {
  item: CartItem;
  onUpdateQty: (id: number, metal: MetalType, delta: number) => void;
  onRemove: (id: number, metal: MetalType) => void;
  onNavigate?: () => void;
  compact?: boolean;
  className?: string;
}

export function CartLineItem({
  item,
  onUpdateQty,
  onRemove,
  onNavigate,
  compact: _compact = false,
  className = "",
}: CartLineItemProps) {
  const photos = getProductPhotos(item.product);
  const lineTotal = item.product.price * item.qty;

  const handleQtyChange = (newQty: number) => {
    const delta = newQty - item.qty;
    if (delta !== 0) {
      onUpdateQty(item.id, item.metal, delta);
    }
  };

  return (
    <div
      className={`flex gap-4 py-4 border-b border-[var(--border)] items-start select-none ${className}`}
    >
      {/* 4:5 Aspect Ratio Image Thumbnail (80x100) */}
      <Link
        href={`/products/${item.product.slug}`}
        onClick={onNavigate}
        className="relative w-20 aspect-[4/5] rounded-[2px] overflow-hidden bg-[var(--surface-muted)] flex-shrink-0 border border-[var(--border)] group focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        <Image
          src={photos.primary}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Item Metadata & Action Controls */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif text-sm sm:text-base font-normal text-[var(--text)] leading-snug truncate">
              <Link
                href={`/products/${item.product.slug}`}
                onClick={onNavigate}
                className="hover:text-[var(--brand)] transition-colors"
              >
                {item.product.name}
              </Link>
            </h4>

            {/* Total Line Price */}
            <span className="font-serif text-sm sm:text-base font-normal text-[var(--text)] tabular-nums flex-shrink-0">
              {formatMoney(lineTotal)}
            </span>
          </div>

          {/* Alloy & Pearl Descriptor */}
          <div className="text-xs text-[var(--text-tertiary)] font-sans mt-0.5 font-light">
            18K {item.metal} · {item.product.pearl} Pearl
          </div>

          {/* Unit Price (if quantity > 1) */}
          {item.qty > 1 && (
            <div className="text-[11px] text-[var(--text-secondary)] font-sans font-light mt-0.5 tabular-nums">
              {formatMoney(item.product.price)} each
            </div>
          )}
        </div>

        {/* Bottom Bar: Stepper & Remove Text Link */}
        <div className="flex items-center justify-between pt-3 mt-auto">
          <QuantityStepper
            value={item.qty}
            onChange={handleQtyChange}
            min={1}
            max={10}
            size="sm"
          />

          <button
            type="button"
            onClick={() => onRemove(item.id, item.metal)}
            className="text-xs font-sans text-[var(--text-tertiary)] hover:text-[var(--error)] underline underline-offset-2 transition-colors cursor-pointer select-none"
            aria-label={`Remove ${item.product.name} from bag`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
