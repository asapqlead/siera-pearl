"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Gift, Tag, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/products";
import { CartLineItem } from "./CartLineItem";
import { CrossSellRow } from "./CrossSellRow";

export function CartDrawer() {
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
    isCartOpen,
    closeCart,
    updateQty,
    removeFromCart,
    finalTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showGiftInput, setShowGiftInput] = useState(isGiftWrap);
  const [noteText, setNoteText] = useState(giftMessage);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

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

  const handleCheckoutClick = () => {
    closeCart();
    router.push("/checkout");
  };

  const handleViewBagClick = () => {
    closeCart();
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-drawer-in border-l border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-white">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[var(--text)] tracking-tight">
              Shopping Bag
            </h3>
            <span className="text-xs font-sans text-[var(--text-tertiary)] font-normal tabular-nums">
              ({cartCount})
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-[2px] transition-colors cursor-pointer"
            aria-label="Close Shopping Bag"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Factual Complimentary Shipping Notice (No contradictory $2,000 meter) */}
        <div className="bg-[var(--surface-muted)] px-5 py-2.5 border-b border-[var(--border)] flex items-center justify-between text-xs font-sans text-[var(--text)] select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
            <span className="text-[var(--text-secondary)] font-light">
              Complimentary Insured Courier Delivery on all orders
            </span>
          </div>
          <span className="font-medium text-[var(--brand)] text-[11px] uppercase tracking-wider">
            Included
          </span>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)]">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-xl font-normal text-[var(--text)]">
                Your shopping bag is empty
              </h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed font-light">
                Explore our hand-strung Japanese Akoya, Tahitian Peacock, and Australian South Sea pearls.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  router.push("/catalog");
                }}
                className="mt-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-6 py-3 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.14em] transition-colors btn-press shadow-xs cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Itemized Line Items */}
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {cart.map((item, idx) => (
                  <CartLineItem
                    key={`${item.id}-${item.metal}-${idx}`}
                    item={item}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart}
                    onNavigate={closeCart}
                    compact
                  />
                ))}
              </div>

              {/* Collapsed Gift Wrap Option */}
              <div className="p-3.5 rounded-[2px] bg-[var(--surface-muted)] border border-[var(--border)] space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[var(--text)] font-normal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showGiftInput}
                    onChange={(e) => handleToggleGift(e.target.checked)}
                    className="w-4 h-4 rounded-[2px] accent-[var(--brand)] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[var(--accent)] stroke-[1.5]" />
                    <span>Complimentary Gift Packaging &amp; Hand-Penned Note</span>
                  </div>
                </label>

                {showGiftInput && (
                  <div className="pt-2 animate-toast-in">
                    <textarea
                      placeholder="Enter your message for the hand-calligraphed note..."
                      value={noteText}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      rows={2}
                      maxLength={200}
                      className="w-full text-xs p-2.5 bg-white border border-[var(--border)] rounded-[2px] focus:outline-none focus:border-[var(--brand)] text-[var(--text)] font-sans"
                    />
                    <span className="text-[10px] text-[var(--text-tertiary)] block text-right mt-0.5">
                      {noteText.length}/200 characters
                    </span>
                  </div>
                )}
              </div>

              {/* Collapsed Promo Code Section */}
              <div className="p-3.5 rounded-[2px] bg-[var(--surface-muted)] border border-[var(--border)]">
                {promoCode ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[var(--brand)] stroke-[1.5]" />
                      <span className="font-medium text-[var(--brand)]">{promoCode} Applied</span>
                      <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                        (-{formatMoney(discountAmount)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs text-[var(--error)] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : !showPromoInput ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="text-xs text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-2 flex items-center gap-1.5 cursor-pointer font-light"
                  >
                    <Tag className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Add promo code</span>
                  </button>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5 animate-toast-in">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Privilege code (e.g. PEARL10)"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError("");
                        }}
                        className="flex-1 text-xs px-3 py-2 bg-white border border-[var(--border)] rounded-[2px] uppercase tracking-wider focus:outline-none focus:border-[var(--brand)] text-[var(--text)]"
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

              {/* Companion Jewelry Cross-Sell Row ("Pairs well with") */}
              <CrossSellRow currentCart={cart} />
            </div>
          )}
        </div>

        {/* Footer Order Summary & Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[var(--border)] bg-white space-y-4">
            <div className="space-y-1.5 text-xs font-sans text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
                <span>Insured Courier Delivery</span>
                <span className="font-medium text-[var(--brand)]">Complimentary</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-[var(--border)] text-sm font-sans text-[var(--text)]">
                <span className="font-medium">Estimated Total</span>
                <span className="font-serif text-lg font-normal tabular-nums text-[var(--text)]">
                  {formatMoney(finalTotal)}
                </span>
              </div>
            </div>

            {/* Primary Action: Proceed to Checkout */}
            <button
              type="button"
              onClick={handleCheckoutClick}
              className="w-full h-12 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white font-sans text-xs font-medium uppercase tracking-[0.14em] rounded-[2px] transition-colors shadow-sm flex items-center justify-center gap-2 btn-press cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </button>

            {/* Secondary Action: View Full Bag */}
            <button
              type="button"
              onClick={handleViewBagClick}
              className="w-full text-center text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-4 font-normal transition-colors cursor-pointer"
            >
              View Full Shopping Bag
            </button>

            <div className="text-[11px] text-[var(--text-tertiary)] text-center font-light pt-0.5">
              Complimentary 30-day returns &amp; insured courier delivery
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
