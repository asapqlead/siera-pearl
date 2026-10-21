"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product, MetalType } from "@/types/product";
import { getProductPhotos } from "@/lib/images";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { Swatch } from "@/components/ui/Swatch";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

const AVAILABLE_METALS: MetalType[] = ["Yellow Gold", "Rose Gold", "White Gold"];

export function ProductCard({ product, priority = false, onQuickView: _onQuickView }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(product.metal);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const wished = isWishlisted(product.id);
  const photos = getProductPhotos(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock || isAdding) return;

    setIsAdding(true);
    addToCart(product, 1, selectedMetal, true);

    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }, 240);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="group relative flex flex-col bg-transparent border-0 shadow-none text-left select-none">
      {/* 4:5 Photographic Canvas Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-muted)] rounded-[2px]">
        {/* Clickable Image Link to PDP */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block w-full h-full focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          aria-label={`View ${product.name}`}
        >
          {/* Primary Studio Shot (4:5) */}
          <Image
            src={photos.primary}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] ${
              photos.secondary && photos.secondary !== photos.primary
                ? "group-hover:opacity-0"
                : ""
            }`}
          />

          {/* Secondary Detail/Lifestyle Photo (Revealed on Desktop Hover) */}
          {photos.secondary && photos.secondary !== photos.primary && (
            <Image
              src={photos.secondary}
              alt={`${product.name} detailed view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
            />
          )}
        </Link>

        {/* Top Badges (Left) & Wishlist (Right) */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none z-10">
          <div>
            {!product.in_stock ? (
              <Badge type="Sold out" variant="label" className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-[2px]" />
            ) : product.badge ? (
              <Badge
                type={product.badge}
                variant="label"
                className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-[2px] shadow-2xs"
              />
            ) : null}
          </div>

          {/* Tactile Wishlist Toggle Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            title={wished ? "Saved to Wishlist" : "Save to Wishlist"}
            className="pointer-events-auto w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-[var(--text)] hover:text-[var(--error)] shadow-2xs backdrop-blur-xs transition-all duration-200 btn-press focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                wished
                  ? "fill-[var(--error)] text-[var(--error)] scale-110"
                  : "stroke-[1.5]"
              }`}
            />
          </button>
        </div>

        {/* Subtle Slide-Up Quick Add Action (Desktop Hover) */}
        {product.in_stock && (
          <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`w-full py-2.5 px-3 rounded-[2px] text-xs font-sans uppercase tracking-[0.12em] font-medium transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 btn-press ${
                justAdded
                  ? "bg-[var(--brand)] text-[var(--accent)]"
                  : "bg-white/95 backdrop-blur-md hover:bg-[var(--brand)] text-[var(--text)] hover:text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-2" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        {/* Subtle Material & Origin Descriptor */}
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] font-sans font-medium line-clamp-1">
          {product.pearl} Pearl · {selectedMetal}
        </div>

        {/* Serif Product Title */}
        <h3 className="font-serif text-base sm:text-[17px] font-normal text-[var(--text)] leading-snug mt-1 line-clamp-1 group-hover:text-[var(--brand)] transition-colors">
          <Link href={`/products/${product.slug}`} className="focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>

        {/* Tabular Price */}
        <div className="mt-1">
          <Price price={product.price} was={product.was} size="sm" />
        </div>

        {/* Metal Alloy Swatches */}
        <div className="flex items-center gap-1 mt-2.5">
          {AVAILABLE_METALS.map((metal) => (
            <Swatch
              key={metal}
              metal={metal}
              size="sm"
              selected={selectedMetal === metal}
              onSelect={(m) => setSelectedMetal(m)}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
