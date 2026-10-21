"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, Award, Gift, Tag, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney, INITIAL_PRODUCTS } from "@/lib/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CrossSellRow } from "@/components/cart/CrossSellRow";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    isGiftWrap,
    giftMessage,
    setGiftOptions,
    updateQty,
    removeFromCart,
    finalTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [showGiftInput, setShowGiftInput] = useState(isGiftWrap);
  const [noteText, setNoteText] = useState(giftMessage);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError("");
      setPromoInput("");
    }
  };

  const handleToggleGift = (checked: boolean) => {
    setShowGiftInput(checked);
    setGiftOptions(checked, checked ? noteText : "");
  };

  const handleNoteChange = (text: string) => {
    setNoteText(text);
    setGiftOptions(showGiftInput, text);
  };

  // Recommendations for companion products
  const recommendedProducts = INITIAL_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-8 sm:py-14">
        <div className="site-container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-sans text-[var(--text-tertiary)] font-light">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--brand)] transition-colors flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--text)] font-semibold" aria-current="page">
                Shopping Bag
              </li>
            </ol>
          </nav>

          {/* Page Headline */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
                Shopping Bag
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-1">
                {cartCount === 0
                  ? "Your bag is currently empty"
                  : `Reviewing ${cartCount} ${cartCount === 1 ? "heirloom piece" : "heirloom pieces"}`}
              </p>
            </div>

            {cartCount > 0 && (
              <Link
                href="/catalog"
                className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-4 font-normal"
              >
                Continue browsing collection
              </Link>
            )}
          </header>

          {/* Cart Content: Empty State vs 2-Column Layout */}
          {cartCount === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto space-y-5">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-tertiary)]">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-2xl text-[var(--text)] font-normal">
                Your shopping bag is empty
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                We cultivate limited lagoon harvests. Discover our Japanese Akoya strands, Tahitian peacock drops, and Australian South Sea pearls.
              </p>
              <div>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-8 py-3.5 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.14em] transition-colors shadow-xs btn-press"
                >
                  <span>Explore Fine Jewelry</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </Link>
              </div>

              {/* Curated Recommendations */}
              <div className="pt-16 text-left">
                <ProductRecommendations
                  products={recommendedProducts}
                  title="Curated Atelier Bestsellers"
                  subtitle="Explore our most celebrated natural pearl heirlooms."
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
              {/* Left Column: Line Items & Gift Options (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                  {cart.map((item, idx) => (
                    <CartLineItem
                      key={`${item.id}-${item.metal}-${idx}`}
                      item={item}
                      onUpdateQty={updateQty}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Gift Wrap Packaging Option */}
                <div className="p-4 sm:p-5 rounded-[2px] bg-[var(--surface-muted)] border border-[var(--border)] space-y-3">
                  <label className="flex items-center gap-3 text-xs sm:text-sm text-[var(--text)] font-normal cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showGiftInput}
                      onChange={(e) => handleToggleGift(e.target.checked)}
                      className="w-4 h-4 rounded-[2px] accent-[var(--brand)] cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[var(--accent)] stroke-[1.5]" />
                      <span className="font-medium">
                        Complimentary Gift Packaging &amp; Hand-Penned Archival Note
                      </span>
                    </div>
                  </label>

                  {showGiftInput && (
                    <div className="pt-2 animate-toast-in">
                      <textarea
                        placeholder="Enter your personalized message to be hand-calligraphed onto archival ivory cardstock..."
                        value={noteText}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        rows={3}
                        maxLength={200}
                        className="w-full text-xs p-3 bg-white border border-[var(--border)] rounded-[2px] focus:outline-none focus:border-[var(--brand)] text-[var(--text)] font-sans"
                      />
                      <span className="text-[10px] text-[var(--text-tertiary)] block text-right mt-1">
                        {noteText.length}/200 characters
                      </span>
                    </div>
                  )}
                </div>

                {/* Companion Cross-Sell Row */}
                <CrossSellRow currentCart={cart} />
              </div>

              {/* Right Column: Sticky Order Summary (5 Cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <div className="p-6 sm:p-8 bg-white border border-[var(--border)] rounded-[2px] space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-normal tracking-tight pb-4 border-b border-[var(--border)]">
                    Order Summary
                  </h2>

                  {/* Summary Breakdown */}
                  <div className="space-y-3 text-xs sm:text-sm font-sans text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-medium text-[var(--text)] tabular-nums">
                        {formatMoney(cartSubtotal)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[var(--brand)] font-medium">
                        <span>Privilege Discount ({promoCode})</span>
                        <span className="tabular-nums">-{formatMoney(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Insured Air Courier Delivery</span>
                      <span className="font-medium text-[var(--brand)]">Complimentary</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Import Duties &amp; Taxes</span>
                      <span className="text-[var(--text-tertiary)]">Included by Atelier</span>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-[var(--border)] text-base font-sans text-[var(--text)]">
                      <span className="font-medium">Estimated Total</span>
                      <span className="font-serif text-2xl font-normal tabular-nums text-[var(--text)]">
                        {formatMoney(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-2 border-t border-[var(--border)]">
                    {promoCode ? (
                      <div className="flex items-center justify-between text-xs py-2 px-3 bg-[var(--surface-muted)] rounded-[2px]">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
                          <span className="font-medium text-[var(--brand)]">{promoCode} Active</span>
                        </div>
                        <button
                          type="button"
                          onClick={removePromoCode}
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
                            className="flex-1 text-xs px-3.5 py-2.5 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] uppercase tracking-wider focus:outline-none focus:border-[var(--brand)] text-[var(--text)]"
                          />
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-xs font-sans font-medium uppercase tracking-wider rounded-[2px] transition-colors btn-press cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-[11px] text-[var(--error)] font-light mt-1">
                            {promoError}
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Checkout CTA */}
                  <div>
                    <button
                      type="button"
                      onClick={() => router.push("/checkout")}
                      className="w-full h-12 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-sans text-xs font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors shadow-sm flex items-center justify-center gap-2 btn-press cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>

                  {/* Factual Guarantees */}
                  <div className="pt-2 space-y-2 text-[11px] font-sans text-[var(--text-tertiary)] font-light">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
                      <span>Complimentary insured delivery with signature required</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
                      <span>Complimentary 30-day returns and ring resizing</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5] flex-shrink-0" />
                      <span>Individual Certificate of Natural Origin included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
