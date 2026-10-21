/**
 * Siera Pearl — Centralized Photography & Imagery Registry
 *
 * All photography slots are defined with explicit 4:5 aspect ratio dimensions (1200x1500px)
 * or wide hero dimensions (2400x1350px).
 *
 * To supply your own studio photographs:
 * Drop images into `public/assets/images/products/<product-slug>/01.jpg` (hero), `02.jpg` (hover/detail),
 * and the helper functions will automatically prioritize local files over the fallback registry.
 */

import { Product, ProductCategory } from "@/types/product";

export interface ProductPhotoSlot {
  primary: string;    // Clean studio shot on warm ivory / neutral background (4:5)
  secondary: string;  // Detail close-up or on-model crop (4:5)
  lifestyle?: string;  // On-model lifestyle showing scale (4:5)
}

export const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=85",
  alt: "Editorial photograph of model wearing natural Akoya pearl necklace in morning light",
  width: 2400,
  height: 1350,
};

export const CATEGORY_TILES: Record<ProductCategory, { src: string; alt: string; label: string }> = {
  Necklaces: {
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
    alt: "Fine pearl strand necklace on neutral linen",
    label: "Necklaces",
  },
  Earrings: {
    src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
    alt: "Akoya pearl drop earrings in 18k gold",
    label: "Earrings",
  },
  Bracelets: {
    src: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
    alt: "Pearl tennis bracelet and gold bangle on wrist",
    label: "Bracelets",
  },
  Rings: {
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
    alt: "Solitaire pearl ring set in recycled gold",
    label: "Rings",
  },
  Bridal: {
    src: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=1500&q=85",
    alt: "Bridal pearl jewelry suite with silk veil",
    label: "Bridal",
  },
};

export const STORY_IMAGES = {
  lagoon: {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&h=1000&q=85",
    alt: "Pristine oceanic lagoon marine sanctuary where Siera pearls are cultivated",
  },
  craft: {
    src: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1600&h=1000&q=85",
    alt: "Goldsmith hand-setting natural pearls into 18k solid gold bezels",
  },
  packaging: {
    src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&h=1000&q=85",
    alt: "Warm ivory jewelry presentation box with certificate of natural authenticity",
  },
};

/**
 * 4:5 Curated Luxury Editorial Image Slots for all 30 SKUs
 */
export const SKU_IMAGE_REGISTRY: Record<number, ProductPhotoSlot> = {
  1: {
    primary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  2: {
    primary: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  3: {
    primary: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  4: {
    primary: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  5: {
    primary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  6: {
    primary: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  7: {
    primary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  8: {
    primary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  9: {
    primary: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  10: {
    primary: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  11: {
    primary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  12: {
    primary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  13: {
    primary: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  14: {
    primary: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  15: {
    primary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  16: {
    primary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  17: {
    primary: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  18: {
    primary: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  19: {
    primary: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  20: {
    primary: "https://images.unsplash.com/photo-1611591475879-c5c2d30806ea?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  21: {
    primary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  22: {
    primary: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  23: {
    primary: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  24: {
    primary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  25: {
    primary: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  26: {
    primary: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  27: {
    primary: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  28: {
    primary: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  29: {
    primary: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
  30: {
    primary: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&h=1500&q=85",
    secondary: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=1500&q=85",
  },
};

/**
 * Resolves the primary and hover/detail photos for any product.
 * Returns an array of at least 2 images (primary and hover-swap).
 */
export function getProductPhotos(product: Product): { primary: string; secondary: string; all: string[] } {
  // If product has its own custom photos array from database or local assets
  if (product.photos && product.photos.length > 0) {
    const primary = product.photos[0];
    const secondary = product.photos.length > 1 ? product.photos[1] : primary;
    return {
      primary,
      secondary,
      all: product.photos,
    };
  }

  // Use registered high-res photography slot
  const slot = SKU_IMAGE_REGISTRY[product.id];
  if (slot) {
    const all = [slot.primary, slot.secondary];
    if (slot.lifestyle) all.push(slot.lifestyle);
    return {
      primary: slot.primary,
      secondary: slot.secondary,
      all,
    };
  }

  // Graceful fallback to category default
  const catTile = CATEGORY_TILES[product.cat] || CATEGORY_TILES.Necklaces;
  return {
    primary: catTile.src,
    secondary: catTile.src,
    all: [catTile.src],
  };
}
