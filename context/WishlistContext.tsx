"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  wishlist: Record<number, boolean>;
  wishlistIds: number[];
  toggleWishlist: (product: Product | number) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: number) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("siera_pearl_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage", e);
    }
  }, []);

  const toggleWishlist = useCallback(
    (item: Product | number) => {
      const productId = typeof item === "number" ? item : item.id;
      const productObj = typeof item === "object" ? item : null;

      setWishlist((prev) => {
        const nextState = !prev[productId];
        const updated = { ...prev, [productId]: nextState };
        try {
          localStorage.setItem("siera_pearl_wishlist", JSON.stringify(updated));
        } catch (e) {
          console.warn("Could not save wishlist", e);
        }

        if (nextState) {
          showToast({
            message: "Saved to Personal Wishlist",
            description: productObj ? productObj.name : "Item saved to your wishlist",
            thumbnail: productObj?.photos?.[0],
            actionLabel: "View Wishlist",
            onAction: () => {
              router.push("/wishlist");
            },
          });
        } else {
          showToast({
            message: "Removed from Wishlist",
            description: productObj ? productObj.name : undefined,
          });
        }

        return updated;
      });
    },
    [showToast, router]
  );

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      if (!prev[productId]) return prev;
      const updated = { ...prev, [productId]: false };
      try {
        localStorage.setItem("siera_pearl_wishlist", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save wishlist", e);
      }
      return updated;
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist({});
    try {
      localStorage.removeItem("siera_pearl_wishlist");
    } catch (e) {
      console.warn("Could not clear wishlist", e);
    }
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => Boolean(wishlist[productId]),
    [wishlist]
  );

  const wishlistIds = useMemo(() => {
    return Object.entries(wishlist)
      .filter(([, active]) => Boolean(active))
      .map(([id]) => Number(id));
  }, [wishlist]);

  const wishlistCount = wishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
