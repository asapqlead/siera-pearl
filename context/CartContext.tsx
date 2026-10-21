"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { CartItem, Product, MetalType, ShippingOption } from "@/types/product";
import { useToast } from "./ToastContext";

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", name: "Complimentary Insured Delivery", days: "4–6 business days", price: 0 },
  { id: "express", name: "Expedited Air Courier", days: "2–3 business days", price: 28 },
  { id: "overnight", name: "Priority White-Glove Courier", days: "Next business day", price: 65 },
];

export const VALID_PROMO_CODES: Record<string, { label: string; rate?: number; fixed?: number }> = {
  PEARL10: { label: "10% Welcome Atelier Privilege", rate: 0.1 },
  LUSTRE15: { label: "15% High-Jewelry Connoisseur", rate: 0.15 },
  SIERA50: { label: "$50 Vault Credit", fixed: 50 },
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number, metalOverride?: MetalType, suppressDrawer?: boolean) => void;
  buyNow: (product: Product, qty?: number, metalOverride?: MetalType) => void;
  removeFromCart: (id: number, metal: MetalType) => void;
  updateQty: (id: number, metal: MetalType, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  promoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  isGiftWrap: boolean;
  giftMessage: string;
  setGiftOptions: (wrap: boolean, message?: string) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  selectedShipping: ShippingOption;
  setSelectedShipping: (opt: ShippingOption) => void;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("siera_pearl_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
      const savedPromo = localStorage.getItem("siera_pearl_promo");
      if (savedPromo) {
        setPromoCode(savedPromo);
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("siera_pearl_cart", JSON.stringify(cart));
      if (promoCode) {
        localStorage.setItem("siera_pearl_promo", promoCode);
      } else {
        localStorage.removeItem("siera_pearl_promo");
      }
    } catch (e) {
      console.warn("Failed to persist cart", e);
    }
  }, [cart, promoCode, isHydrated]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!promoCode || !VALID_PROMO_CODES[promoCode]) return 0;
    const rule = VALID_PROMO_CODES[promoCode];
    if (rule.rate) {
      return Math.round(cartSubtotal * rule.rate);
    }
    if (rule.fixed) {
      return Math.min(cartSubtotal, rule.fixed);
    }
    return 0;
  }, [cartSubtotal, promoCode]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + selectedShipping.price);
  }, [cartSubtotal, discountAmount, selectedShipping.price]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (product: Product, qty = 1, metalOverride?: MetalType, suppressDrawer = false) => {
      const metal = metalOverride || product.metal;
      setCart((prev) => {
        const existingIdx = prev.findIndex((item) => item.id === product.id && item.metal === metal);
        if (existingIdx > -1) {
          const next = [...prev];
          next[existingIdx] = {
            ...next[existingIdx],
            qty: next[existingIdx].qty + qty,
          };
          return next;
        }
        return [...prev, { id: product.id, product, qty, metal }];
      });

      // When drawer is suppressed (e.g. quick-add), display tactical toast
      // When drawer opens, the drawer itself provides primary feedback
      if (suppressDrawer) {
        showToast({
          message: `Added to Bag`,
          description: `${product.name} (${metal}) · Qty: ${qty}`,
          thumbnail: product.photos?.[0],
          actionLabel: "View Bag",
          onAction: () => {
            setIsCartOpen(true);
          },
        });
      } else {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const buyNow = useCallback(
    (product: Product, qty = 1, metalOverride?: MetalType) => {
      addToCart(product, qty, metalOverride, true);
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    },
    [addToCart]
  );

  const removeFromCart = useCallback((id: number, metal: MetalType) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.metal === metal)));
  }, []);

  const updateQty = useCallback((id: number, metal: MetalType, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id && item.metal === metal) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const applyPromoCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (VALID_PROMO_CODES[normalized]) {
        setPromoCode(normalized);
        const label = VALID_PROMO_CODES[normalized].label;
        showToast({
          message: "Privilege Code Applied",
          description: label,
        });
        return { success: true, message: `Applied: ${label}` };
      }
      return { success: false, message: "Invalid privilege code. Try PEARL10 or SIERA50" };
    },
    [showToast]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const setGiftOptions = useCallback((wrap: boolean, message = "") => {
    setIsGiftWrap(wrap);
    setGiftMessage(message);
  }, []);

  const openCheckout = useCallback(() => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [cart.length]);

  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        buyNow,
        removeFromCart,
        updateQty,
        clearCart,
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
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        selectedShipping,
        setSelectedShipping,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
