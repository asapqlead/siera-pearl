"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag } from "lucide-react";
import { Product, MetalType } from "@/types/product";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getProductPhotos } from "@/lib/images";
import { Price } from "@/components/ui/Price";
import { Swatch } from "@/components/ui/Swatch";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface WishlistClientProps {
  allProducts: Product[];
}

const AVAILABLE_METALS: MetalType[] = ["Yellow Gold", "Rose Gold", "White Gold"];

export function WishlistClient({ allProducts }: WishlistClientProps) {
  const router = useRouter();
  const { wishlistIds, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Per-item selected metal state
  const [selectedMetals, setSelectedMetals] = useState<Record<number, MetalType>>({});
  const [movingId, setMovingId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter products that are currently in the wishlist
  const savedProducts = React.useMemo(() => {
    const idSet = new Set(wishlistIds);
    return allProducts.filter((p) => idSet.has(p.id));
  }, [allProducts, wishlistIds]);

  const handleMetalChange = (productId: number, metal: MetalType) => {
    setSelectedMetals((prev) => ({ ...prev, [productId]: metal }));
  };

  const handleMoveToBag = (product: Product) => {
    const metal = selectedMetals[product.id] || product.metal;
    setMovingId(product.id);

    // Add to cart with openDrawer=true
    addToCart(product, 1, metal, true);
    // Remove from wishlist
    removeFromWishlist(product.id);

    showToast({
      message: "Moved to Shopping Bag",
      description: `${product.name} in ${metal}`,
      thumbnail: product.photos?.[0],
    });

    setTimeout(() => {
      setMovingId(null);
    }, 400);
  };

  const handleRemove = (product: Product) => {
    removeFromWishlist(product.id);
  };

  return (
    <div className="site-container py-10 sm:py-16">
      {/* Breadcrumb Hierarchy */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist" },
        ]}
        className="mb-6"
      />

      {/* Page Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--border)] pb-6 mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
            Saved Jewelry
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-1">
            {mounted
              ? `${savedProducts.length} ${savedProducts.length === 1 ? "piece" : "pieces"} preserved in your private collection`
              : "Preserved in your private collection"}
          </p>
        </div>

        {mounted && savedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] hover:text-red-600 transition-colors self-start sm:self-auto font-light cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {!mounted ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-[var(--surface-muted)] rounded-[2px]" />
          ))}
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="py-16 max-w-md mx-auto text-center">
          <EmptyState
            title="Your Wishlist is Empty"
            description="Items you save while exploring our fine pearl collection will appear here. Saved pieces persist on this device without requiring an account."
            actionLabel="Explore Fine Collection"
            onAction={() => router.push("/catalog")}
          />
        </div>
      ) : (
        /* Saved Items Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {savedProducts.map((product) => {
            const currentMetal = selectedMetals[product.id] || product.metal;
            const photos = getProductPhotos(product);
            const isMoving = movingId === product.id;

            return (
              <article
                key={product.id}
                className="group flex flex-col bg-transparent text-left border-0 shadow-none"
              >
                {/* 4:5 Image Container with Link */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--surface-muted)] rounded-[2px] mb-4">
                  <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={photos.primary}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* Remove button pinned top right */}
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[var(--text-secondary)] hover:text-red-600 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-light">
                    {product.pearl} Pearl &middot; 18k Solid Gold
                  </p>

                  <h3 className="font-serif text-base sm:text-lg text-[var(--text)] font-medium leading-snug">
                    <Link
                      href={`/products/${product.slug}`}
                      className="hover:text-[var(--brand)] transition-colors"
                    >
                      {product.name}
                    </Link>
                  </h3>

                  <Price
                    price={product.price}
                    was={product.was || undefined}
                    className="pt-0.5 text-sm"
                  />

                  {/* Metal Alloy Selector Swatches */}
                  <div className="pt-2 flex items-center gap-1.5">
                    {AVAILABLE_METALS.map((alloy) => (
                      <Swatch
                        key={alloy}
                        metal={alloy}
                        selected={currentMetal === alloy}
                        onSelect={(m) => handleMetalChange(product.id, m)}
                        size="sm"
                      />
                    ))}
                    <span className="text-[11px] text-[var(--text-tertiary)] pl-1">
                      {currentMetal}
                    </span>
                  </div>
                </div>

                {/* Move to Bag Primary CTA */}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    isLoading={isMoving}
                    disabled={!product.in_stock || isMoving}
                    onClick={() => handleMoveToBag(product)}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    <span>{product.in_stock ? "Move to Bag" : "Sold Out"}</span>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
