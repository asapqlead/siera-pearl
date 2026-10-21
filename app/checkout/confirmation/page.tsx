"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { OrderConfirmationData } from "@/types/checkout";
import { formatMoney } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderFromQuery = searchParams.get("order") || "SP-729401";

  const [order, setOrder] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("siera_pearl_last_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read order confirmation data", e);
    }
  }, []);

  const orderNumber = order?.orderNumber || orderFromQuery;

  // Calculate delivery date range
  const today = new Date();
  const minDays = order?.shippingOption.price === 65 ? 1 : order?.shippingOption.price === 28 ? 2 : 4;
  const maxDays = order?.shippingOption.price === 65 ? 2 : order?.shippingOption.price === 28 ? 3 : 6;
  const dMin = new Date(today.getTime() + minDays * 86400000);
  const dMax = new Date(today.getTime() + maxDays * 86400000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const deliveryWindow = `${fmt(dMin)} – ${fmt(dMax)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Distraction-Free Confirmation Header */}
      <header className="w-full bg-white border-b border-[var(--border)] h-[72px] flex items-center justify-between px-6 sm:px-12">
        <Link href="/" className="font-serif text-2xl font-normal text-[var(--text)] tracking-tight">
          Siera Pearl
        </Link>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium select-none">
          <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
          <span>Atelier Insured Acquisition</span>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Celebratory Acquisition Notice */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[var(--brand)] text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)] font-sans font-medium">
              Acquisition Confirmed
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text)] tracking-tight">
              Thank you for your order
            </h1>

            <p className="text-sm font-sans text-[var(--text-secondary)] font-light max-w-lg mx-auto leading-relaxed">
              Order <strong className="font-mono font-medium text-[var(--text)]">{orderNumber}</strong> has been received by our master atelier.
              {order?.contact.email && (
                <span> A digital receipt and certificate of natural origin have been dispatched to <strong className="font-medium text-[var(--text)]">{order.contact.email}</strong>.</span>
              )}
            </p>
          </div>

          {/* Delivery Forecast Banner */}
          <div className="p-5 sm:p-6 bg-white border border-[var(--border)] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 rounded-full bg-[var(--surface-muted)] text-[var(--brand)] flex-shrink-0">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] font-sans font-medium">
                  Estimated Handover Window
                </div>
                <div className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal mt-0.5">
                  {deliveryWindow}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-sans text-[var(--text-secondary)] font-light">
              <div>{order?.shippingOption.name || "Complimentary Insured Delivery"}</div>
              <div className="text-[11px] text-[var(--brand)] font-medium">Signature required upon courier delivery</div>
            </div>
          </div>

          {/* Itemized Order Details & Summary */}
          {order && order.items.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-[2px] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-xl text-[var(--text)] font-normal pb-4 border-b border-[var(--border)]">
                Acquired Pieces ({order.items.reduce((s, i) => s + i.qty, 0)})
              </h2>

              <div className="divide-y divide-[var(--border)]">
                {order.items.map((item, idx) => {
                  const photos = getProductPhotos(item.product);
                  return (
                    <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-16 aspect-[4/5] rounded-[2px] overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] flex-shrink-0">
                          <Image
                            src={photos.primary}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-serif text-sm sm:text-base text-[var(--text)] font-normal truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-[var(--text-tertiary)] font-sans font-light mt-0.5">
                            18K {item.metal} · {item.product.pearl} Pearl · Qty: {item.qty}
                          </div>
                        </div>
                      </div>

                      <span className="font-serif text-sm sm:text-base text-[var(--text)] tabular-nums flex-shrink-0">
                        {formatMoney(item.product.price * item.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Address & Financial Recap */}
              <div className="pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans text-[var(--text-secondary)]">
                <div>
                  <div className="uppercase tracking-wider font-medium text-[var(--text-tertiary)] mb-1">
                    Shipping Destination
                  </div>
                  <div className="font-medium text-[var(--text)]">{order.delivery.fullName}</div>
                  <div className="font-light">{order.delivery.addressLine1}</div>
                  {order.delivery.addressLine2 && <div className="font-light">{order.delivery.addressLine2}</div>}
                  <div className="font-light">{order.delivery.city}, {order.delivery.state} {order.delivery.zipCode}</div>
                </div>

                <div className="space-y-1.5 sm:text-right">
                  <div className="flex justify-between sm:justify-end sm:gap-6">
                    <span>Subtotal:</span>
                    <span className="font-medium text-[var(--text)] tabular-nums">{formatMoney(order.subtotal)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between sm:justify-end sm:gap-6 text-[var(--brand)]">
                      <span>Discount ({order.promoCode}):</span>
                      <span className="tabular-nums">-{formatMoney(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-end sm:gap-6">
                    <span>Insured Courier:</span>
                    <span className="font-medium text-[var(--brand)]">
                      {order.shippingPrice === 0 ? "Complimentary" : formatMoney(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-end sm:gap-6 pt-2 border-t border-[var(--border)] text-base font-sans text-[var(--text)]">
                    <span className="font-medium">Total:</span>
                    <span className="font-serif text-xl font-normal tabular-nums">{formatMoney(order.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps: Account Prompt & Return Link */}
          <div className="p-6 bg-white border border-[var(--border)] rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-serif text-base text-[var(--text)] font-normal">
                Save order to your Atelier Account?
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-light">
                Track your shipment, access appraisal records, and enjoy concierge privilege re-sizing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="px-5 py-2.5 bg-[var(--surface-muted)] hover:bg-[var(--border)] text-[var(--text)] text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] transition-colors btn-press"
              >
                Create Account
              </Link>
              <Link
                href="/catalog"
                className="px-5 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] transition-colors btn-press shadow-xs flex items-center gap-1.5"
              >
                <span>Return to Boutique</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-xs text-[var(--text-tertiary)]">
          Loading order confirmation...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
