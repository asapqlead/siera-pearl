export type ProductCategory = 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings' | 'Bridal';

export type MetalType = 'Yellow Gold' | 'Rose Gold' | 'White Gold';

export type PearlType = 'Akoya' | 'South Sea' | 'Tahitian' | 'Freshwater' | 'Keshi';

export type ProductBadge = 'Bestseller' | 'Sale' | 'New' | null;

export interface Product {
  id: number;
  slug: string;
  cat: ProductCategory;
  name: string;
  metal: MetalType;
  pearl: PearlType;
  price: number;
  was?: number | null;
  description: string;
  badge?: ProductBadge;
  rating: number;
  in_stock: boolean;
  stock_qty: number;
  photos: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  qty: number;
  metal: MetalType;
}

export interface FilterState {
  cat: ProductCategory[];
  pearl: PearlType[];
  metal: MetalType[];
  maxPrice: number;
  inStock: boolean;
  search: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name';

export interface ShippingOption {
  id: 'standard' | 'express' | 'overnight';
  name: string;
  days: string;
  price: number;
}
