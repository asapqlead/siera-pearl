"use client";

import React from "react";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { ContactInfo, DeliveryAddress, PaymentInfo } from "@/types/checkout";
import { ShippingOption } from "@/types/product";
import { formatMoney } from "@/lib/products";

export interface ReviewStepProps {
  isActive: boolean;
  contact: ContactInfo;
  delivery: DeliveryAddress;
  shipping: ShippingOption;
  payment: PaymentInfo;
  isGiftWrap: boolean;
  giftMessage?: string;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}

export function ReviewStep({
  isActive,
  contact,
  delivery,
  shipping,
  payment,
  isGiftWrap,
  giftMessage,
  total,
  isProcessing,
  onPlaceOrder,
}: ReviewStepProps) {
  if (!isActive) {
    return (
      <div className="py-4 border-b border-[var(--border)] opacity-50 flex items-center gap-3 select-none">
        <div className="w-5 h-5 rounded-full border border-[var(--text-tertiary)] text-[var(--text-tertiary)] text-xs font-sans flex items-center justify-center">
          4
        </div>
        <div className="font-serif text-base text-[var(--text-secondary)]">
          4. Review &amp; Place Order
        </div>
      </div>
    );
  }

  const last4 = payment.cardNumber.replace(/\s/g, "").slice(-4) || "4242";

  return (
    <div className="py-6 border-b border-[var(--border)] space-y-6">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal tracking-tight">
          4. Review &amp; Place Order
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-light mt-1">
          Please confirm your order details before authorizing payment.
        </p>
      </div>

      {/* Recap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans p-4 bg-[var(--surface-muted)] rounded-[2px] border border-[var(--border)]">
        <div className="space-y-1">
          <div className="uppercase tracking-wider text-[var(--text-tertiary)] font-medium text-[11px]">
            Recipient &amp; Contact
          </div>
          <div className="font-medium text-[var(--text)]">{delivery.fullName}</div>
          <div className="text-[var(--text-secondary)] font-light">{contact.email}</div>
          <div className="text-[var(--text-secondary)] font-light">{contact.phone}</div>
        </div>

        <div className="space-y-1">
          <div className="uppercase tracking-wider text-[var(--text-tertiary)] font-medium text-[11px]">
            Insured Delivery Destination
          </div>
          <div className="text-[var(--text-secondary)] font-light">
            {delivery.addressLine1}
            {delivery.addressLine2 ? `, ${delivery.addressLine2}` : ""}
          </div>
          <div className="text-[var(--text-secondary)] font-light">
            {delivery.city}, {delivery.state} {delivery.zipCode}
          </div>
          <div className="text-[var(--brand)] font-medium mt-1">
            {shipping.name}
          </div>
        </div>

        <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[var(--border)]">
          <div className="uppercase tracking-wider text-[var(--text-tertiary)] font-medium text-[11px]">
            Payment Method
          </div>
          <div className="text-[var(--text-secondary)] font-light">
            {payment.method === "card"
              ? `Credit Card ending in •••• ${last4}`
              : payment.method === "apple_pay"
              ? "Apple Pay Express"
              : "Google Pay Express"}
          </div>
        </div>

        {isGiftWrap && (
          <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[var(--border)]">
            <div className="uppercase tracking-wider text-[var(--text-tertiary)] font-medium text-[11px]">
              Complimentary Gift Packaging
            </div>
            <div className="text-[var(--text-secondary)] italic font-serif">
              &ldquo;{giftMessage || "Complimentary handwritten gift card requested."}&rdquo;
            </div>
          </div>
        )}
      </div>

      {/* Place Order CTA */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full h-12 bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:bg-[var(--text-tertiary)] text-white text-xs font-sans font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors btn-press shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authorizing Transaction...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Place Order &amp; Authorize — {formatMoney(total)}</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-[var(--text-tertiary)] text-center font-light">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
          <span>By clicking place order, you authorize the charge and agree to our 30-day return policy.</span>
        </div>
      </div>
    </div>
  );
}
