"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Truck, Award, Tag } from "lucide-react";
import { CartItem, ShippingOption } from "@/types/product";
import { formatMoney } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";

export interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  promoCode: string | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
  shippingOption: ShippingOption;
  finalTotal: number;
  className?: string;
}

export function CheckoutSummary({
  items,
  subtotal,
  discountAmount,
  promoCode,
  onApplyPromo,
  onRemovePromo,
  shippingOption,
  finalTotal,
  className = "",
}: CheckoutSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError("");
      setPromoInput("");
    }
  };

  return (
    <div className={`p-6 sm:p-8 bg-white border border-[var(--border)] rounded-[2px] space-y-6 select-none ${className}`}>
      <h2 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal tracking-tight pb-4 border-b border-[var(--border)]">
        Order Summary ({items.reduce((sum, i) => sum + i.qty, 0)})
      </h2>

      {/* Itemized Line Items Preview */}
      <div className="divide-y divide-[var(--border)] max-h-80 overflow-y-auto pr-1 space-y-3">
        {items.map((item, idx) => {
          const photos = getProductPhotos(item.product);
          return (
            <div key={`${item.id}-${item.metal}-${idx}`} className="flex items-center gap-3.5 pt-3 first:pt-0">
              <div className="relative w-14 aspect-[4/5] rounded-[2px] overflow-hidden bg-[var(--surface-muted)] flex-shrink-0 border border-[var(--border)]">
                <Image
                  src={photos.primary}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[var(--brand)] text-white text-[10px] font-sans font-bold flex items-center justify-center border-2 border-white tabular-nums">
                  {item.qty}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-xs sm:text-sm font-normal text-[var(--text)] truncate leading-snug">
                  {item.product.name}
                </h4>
                <div className="text-[11px] text-[var(--text-tertiary)] font-sans font-light mt-0.5">
                  18K {item.metal} · {item.product.pearl} Pearl
                </div>
              </div>

              <span className="font-serif text-xs sm:text-sm text-[var(--text)] tabular-nums flex-shrink-0">
                {formatMoney(item.product.price * item.qty)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Promo Code Input */}
      <div className="pt-3 border-t border-[var(--border)]">
        {promoCode ? (
          <div className="flex items-center justify-between text-xs py-2 px-3 bg-[var(--surface-muted)] rounded-[2px]">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
              <span className="font-medium text-[var(--brand)]">{promoCode} Applied</span>
              <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                (-{formatMoney(discountAmount)})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemovePromo}
              className="text-xs text-[var(--error)] hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Privilege code (e.g. PEARL10)"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError("");
                }}
                className="flex-1 text-xs px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] uppercase tracking-wider focus:outline-none focus:border-[var(--brand)] text-[var(--text)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] transition-colors btn-press cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-[11px] text-[var(--error)] font-light">{promoError}</p>
            )}
          </form>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="space-y-2.5 pt-3 border-t border-[var(--border)] text-xs font-sans text-[var(--text-secondary)]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-[var(--text)] tabular-nums">{formatMoney(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-[var(--brand)] font-medium">
            <span>Privilege Discount ({promoCode})</span>
            <span className="tabular-nums">-{formatMoney(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Insured Courier Dispatch</span>
          <span className="font-medium text-[var(--brand)]">
            {shippingOption.price === 0 ? "Complimentary" : formatMoney(shippingOption.price)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Import Duties &amp; Taxes</span>
          <span className="text-[var(--text-tertiary)]">Included by Atelier</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-[var(--border)] text-base font-sans text-[var(--text)]">
          <span className="font-medium">Total</span>
          <span className="font-serif text-2xl font-normal tabular-nums text-[var(--text)]">
            {formatMoney(finalTotal)}
          </span>
        </div>
      </div>

      {/* 3 Plain Factual Guarantees */}
      <div className="pt-3 border-t border-[var(--border)] space-y-2 text-[11px] font-sans text-[var(--text-tertiary)] font-light">
        <div className="flex items-center gap-2.5">
          <Truck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
          <span>Complimentary insured delivery with signature required</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
          <span>Complimentary 30-day returns and free atelier ring resizing</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Award className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
          <span>Individual Certificate of Natural Origin &amp; Authenticity included</span>
        </div>
      </div>
    </div>
  );
}
