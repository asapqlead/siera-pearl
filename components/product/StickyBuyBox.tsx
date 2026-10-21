"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Check, ShieldCheck, Truck, Award, Ruler } from "lucide-react";
import { Product, MetalType } from "@/types/product";
import { formatMoney } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Price } from "@/components/ui/Price";
import { Swatch } from "@/components/ui/Swatch";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { SizeGuideDrawer } from "./SizeGuideDrawer";

export interface StickyBuyBoxProps {
  product: Product;
  className?: string;
}

const AVAILABLE_METALS: MetalType[] = ["Yellow Gold", "Rose Gold", "White Gold"];
const RING_SIZES = ["5", "6", "7", "8", "9"];
const BRACELET_SIZES = ["Small (6.5\")", "Medium (7.0\")", "Large (7.5\")"];

export function StickyBuyBox({ product, className = "" }: StickyBuyBoxProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(product.metal);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.cat === "Rings" ? "7" : product.cat === "Bracelets" ? "Medium (7.0\")" : ""
  );
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const wished = isWishlisted(product.id);
  const hasSizing = product.cat === "Rings" || product.cat === "Bracelets";

  const handleAddToCart = () => {
    if (!product.in_stock || isAdding) return;

    setIsAdding(true);
    addToCart(product, qty, selectedMetal);

    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 240);
  };

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById("reviews");
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      {/* Category & Descriptor Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-sans text-[var(--text-tertiary)] uppercase tracking-[0.14em] font-medium">
          <Link href={`/catalog?category=${product.cat}`} className="hover:text-[var(--brand)] transition-colors">
            {product.cat}
          </Link>
          <span>·</span>
          <span>{product.pearl} Pearl</span>
        </div>

        {/* H1 Serif Product Title */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight mt-2 leading-tight">
          {product.name}
        </h1>

        {/* Price & Rating Row */}
        <div className="flex items-baseline justify-between mt-3.5 pt-1 border-t border-[var(--border)]">
          <Price price={product.price * qty} was={product.was ? product.was * qty : null} size="lg" />

          {/* Appraisal Link */}
          <a
            href="#reviews"
            onClick={scrollToReviews}
            className="text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors flex items-center gap-1.5"
          >
            <span className="text-[var(--accent)] font-serif text-sm">★★★★★</span>
            <span className="font-medium">5.0</span>
            <span className="text-[var(--text-tertiary)]">(24 appraisals)</span>
          </a>
        </div>
      </div>

      {/* Product Summary Copy */}
      <p className="text-sm font-sans text-[var(--text-secondary)] font-light leading-relaxed">
        {product.description}
      </p>

      {/* Metal Alloy Selector */}
      <div className="space-y-2 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-xs font-sans">
          <span className="text-[var(--text-tertiary)] uppercase tracking-wider font-medium">
            Precious Metal:
          </span>
          <span className="font-medium text-[var(--text)]">18K {selectedMetal}</span>
        </div>
        <div className="flex items-center gap-2">
          {AVAILABLE_METALS.map((metal) => (
            <Swatch
              key={metal}
              metal={metal}
              size="md"
              selected={selectedMetal === metal}
              onSelect={(m) => setSelectedMetal(m)}
            />
          ))}
        </div>
      </div>

      {/* Size Selector for Rings and Bracelets */}
      {hasSizing && (
        <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[var(--text-tertiary)] uppercase tracking-wider font-medium">
              Select Size:
            </span>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[var(--text-secondary)] hover:text-[var(--brand)] underline underline-offset-2 transition-colors flex items-center gap-1 font-normal cursor-pointer"
            >
              <Ruler className="w-3 h-3 stroke-[1.5]" />
              <span>Size Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(product.cat === "Rings" ? RING_SIZES : BRACELET_SIZES).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 text-xs font-sans rounded-[2px] border transition-colors btn-press ${
                  selectedSize === size
                    ? "border-[var(--brand)] bg-[var(--surface-muted)] text-[var(--brand)] font-semibold"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status & Quantity Stepper */}
      <div className="space-y-3 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-xs font-sans">
          <span className="flex items-center gap-1.5 text-[var(--success)] font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            {product.in_stock ? "In Stock · Ready for Immediate Insured Delivery" : "Bespoke Harvest"}
          </span>
          <span className="text-[var(--text-tertiary)]">
            SKU #{product.id.toString().padStart(4, "0")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <QuantityStepper
            value={qty}
            onChange={setQty}
            min={1}
            max={Math.min(10, product.stock_qty || 5)}
            size="md"
            className="flex-shrink-0"
          />

          {/* Primary CTA: Add to Bag */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.in_stock || isAdding}
            className={`flex-1 h-11 px-6 rounded-[2px] text-xs font-sans font-medium uppercase tracking-[0.14em] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 btn-press cursor-pointer ${
              justAdded
                ? "bg-[var(--brand)] text-[var(--accent)]"
                : product.in_stock
                ? "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white"
                : "bg-[var(--surface-muted)] text-[var(--text-tertiary)] cursor-not-allowed border border-[var(--border)]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-2" />
                <span>Added to Bag</span>
              </>
            ) : product.in_stock ? (
              <>
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span>Add to Bag — {formatMoney(product.price * qty)}</span>
              </>
            ) : (
              <span>Currently Sold Out</span>
            )}
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className="w-full py-2.5 px-4 rounded-[2px] border border-[var(--border)] hover:border-[var(--brand)] text-xs font-sans font-medium text-[var(--text)] hover:text-[var(--brand)] transition-colors flex items-center justify-center gap-2 btn-press cursor-pointer bg-white"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              wished ? "fill-[var(--error)] text-[var(--error)] scale-110" : "stroke-[1.5]"
            }`}
          />
          <span>{wished ? "Saved in Wishlist" : "Save to Wishlist"}</span>
        </button>
      </div>

      {/* 3 Plain Factual Luxury Guarantees */}
      <div className="pt-4 border-t border-[var(--border)] space-y-2.5 text-xs font-sans text-[var(--text-secondary)] font-light">
        <div className="flex items-center gap-3">
          <Truck className="w-4 h-4 text-[var(--brand)] flex-shrink-0 stroke-[1.5]" />
          <span>Complimentary insured air courier delivery (4–6 business days)</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[var(--brand)] flex-shrink-0 stroke-[1.5]" />
          <span>Complimentary 30-day returns and one free atelier ring resizing</span>
        </div>
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 text-[var(--brand)] flex-shrink-0 stroke-[1.5]" />
          <span>Accompanied by Certificate of Natural Origin & Authenticity</span>
        </div>
      </div>

      {/* Size Guide Drawer */}
      <SizeGuideDrawer
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultCategory={product.cat === "Bracelets" ? "Bracelets" : "Rings"}
      />
    </div>
  );
}
