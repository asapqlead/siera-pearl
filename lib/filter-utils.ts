import { Product, ProductCategory, MetalType, PearlType, SortOption } from "@/types/product";

export interface CatalogFilterState {
  category: ProductCategory[];
  pearl: PearlType[];
  metal: MetalType[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sort: SortOption;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilterState = {
  category: [],
  pearl: [],
  metal: [],
  minPrice: undefined,
  maxPrice: undefined,
  inStockOnly: false,
  search: "",
  sort: "featured",
};

export const ALL_CATEGORIES: ProductCategory[] = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Rings",
  "Bridal",
];

export const ALL_PEARL_TYPES: PearlType[] = [
  "Akoya",
  "South Sea",
  "Tahitian",
  "Freshwater",
  "Keshi",
];

export const ALL_METALS: MetalType[] = [
  "Yellow Gold",
  "Rose Gold",
  "White Gold",
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Curated Selection" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Additions" },
  { value: "name", label: "Alphabetical (A–Z)" },
];

export const PRICE_RANGES = [
  { id: "under-500", label: "Under $500", min: 0, max: 500 },
  { id: "500-1000", label: "$500 – $1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "$1,000 – $2,000", min: 1000, max: 2000 },
  { id: "over-2000", label: "Over $2,000", min: 2000, max: 100000 },
];

/**
 * Parses URL search parameters into a structured CatalogFilterState.
 */
export function parseCatalogFilters(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined }
): CatalogFilterState {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  // Parse categories
  const catRaw = getParam("category");
  const categories: ProductCategory[] = [];
  if (catRaw) {
    const parts = catRaw.split(",");
    for (const p of parts) {
      const match = ALL_CATEGORIES.find((c) => c.toLowerCase() === p.trim().toLowerCase());
      if (match && !categories.includes(match)) categories.push(match);
    }
  }

  // Parse pearl types
  const pearlRaw = getParam("pearl");
  const pearls: PearlType[] = [];
  if (pearlRaw) {
    const parts = pearlRaw.split(",");
    for (const p of parts) {
      const match = ALL_PEARL_TYPES.find((pt) => pt.toLowerCase() === p.trim().toLowerCase());
      if (match && !pearls.includes(match)) pearls.push(match);
    }
  }

  // Parse metal types
  const metalRaw = getParam("metal");
  const metals: MetalType[] = [];
  if (metalRaw) {
    const parts = metalRaw.split(",");
    for (const p of parts) {
      const match = ALL_METALS.find((m) => m.toLowerCase() === p.trim().toLowerCase());
      if (match && !metals.includes(match)) metals.push(match);
    }
  }

  // Parse price range
  const minPriceRaw = getParam("minPrice");
  const maxPriceRaw = getParam("maxPrice");
  const minPrice = minPriceRaw ? parseInt(minPriceRaw, 10) : undefined;
  const maxPrice = maxPriceRaw ? parseInt(maxPriceRaw, 10) : undefined;

  // Parse inStock
  const inStockRaw = getParam("inStock");
  const inStockOnly = inStockRaw === "true" || inStockRaw === "1";

  // Parse search
  const search = getParam("q") || getParam("search") || "";

  // Parse sort
  const sortRaw = getParam("sort") as SortOption;
  const validSorts: SortOption[] = ["featured", "price-asc", "price-desc", "newest", "name"];
  const sort = validSorts.includes(sortRaw) ? sortRaw : "featured";

  return {
    category: categories,
    pearl: pearls,
    metal: metals,
    minPrice: !isNaN(minPrice!) ? minPrice : undefined,
    maxPrice: !isNaN(maxPrice!) ? maxPrice : undefined,
    inStockOnly,
    search: search.trim(),
    sort,
  };
}

/**
 * Serializes CatalogFilterState into a URL query string.
 */
export function buildCatalogQueryString(filters: CatalogFilterState): string {
  const params = new URLSearchParams();

  if (filters.category.length > 0) {
    params.set("category", filters.category.join(","));
  }
  if (filters.pearl.length > 0) {
    params.set("pearl", filters.pearl.join(","));
  }
  if (filters.metal.length > 0) {
    params.set("metal", filters.metal.join(","));
  }
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.set("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 10000) {
    params.set("maxPrice", filters.maxPrice.toString());
  }
  if (filters.inStockOnly) {
    params.set("inStock", "true");
  }
  if (filters.search) {
    params.set("q", filters.search);
  }
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  const str = params.toString();
  return str ? `?${str}` : "";
}

/**
 * Counts total active filter criteria.
 */
export function getActiveFilterCount(filters: CatalogFilterState): number {
  let count = 0;
  count += filters.category.length;
  count += filters.pearl.length;
  count += filters.metal.length;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count += 1;
  if (filters.inStockOnly) count += 1;
  if (filters.search) count += 1;
  return count;
}

/**
 * Filters and sorts products in memory according to the given criteria.
 */
export function filterAndSortProducts(
  products: Product[],
  filters: CatalogFilterState
): Product[] {
  let result = [...products];

  // Category filter
  if (filters.category.length > 0) {
    result = result.filter((p) => filters.category.includes(p.cat));
  }

  // Pearl type filter
  if (filters.pearl.length > 0) {
    result = result.filter((p) => filters.pearl.includes(p.pearl));
  }

  // Metal alloy filter
  if (filters.metal.length > 0) {
    result = result.filter((p) => filters.metal.includes(p.metal));
  }

  // Minimum price
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  // Maximum price
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // In-stock only
  if (filters.inStockOnly) {
    result = result.filter((p) => p.in_stock && p.stock_qty > 0);
  }

  // Search keyword query
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.pearl.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      result.sort((a, b) => {
        // Bestsellers first, then by sort_order
        if (a.badge === "Bestseller" && b.badge !== "Bestseller") return -1;
        if (b.badge === "Bestseller" && a.badge !== "Bestseller") return 1;
        return a.sort_order - b.sort_order;
      });
      break;
  }

  return result;
}
