"use client";

import React from "react";
import { ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import { ProductCategory, PearlType, MetalType, SortOption, Product } from "@/types/product";
import {
  CatalogFilterState,
  ALL_CATEGORIES,
  ALL_PEARL_TYPES,
  ALL_METALS,
  PRICE_RANGES,
  getActiveFilterCount,
} from "@/lib/filter-utils";
import { Popover } from "@/components/ui/Popover";
import { Checkbox } from "@/components/ui/Checkbox";
import { SortDropdown } from "./SortDropdown";

export interface FilterBarProps {
  filters: CatalogFilterState;
  onFilterChange: (next: CatalogFilterState) => void;
  products: Product[];
  totalResults: number;
  onOpenMobileFilters: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  onFilterChange,
  products,
  totalResults,
  onOpenMobileFilters,
  className = "",
}: FilterBarProps) {
  const activeCount = getActiveFilterCount(filters);

  // Category toggle
  const toggleCategory = (cat: ProductCategory) => {
    const nextCats = filters.category.includes(cat)
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat];
    onFilterChange({ ...filters, category: nextCats });
  };

  // Pearl type toggle
  const togglePearl = (pearl: PearlType) => {
    const nextPearls = filters.pearl.includes(pearl)
      ? filters.pearl.filter((p) => p !== pearl)
      : [...filters.pearl, pearl];
    onFilterChange({ ...filters, pearl: nextPearls });
  };

  // Metal alloy toggle
  const toggleMetal = (metal: MetalType) => {
    const nextMetals = filters.metal.includes(metal)
      ? filters.metal.filter((m) => m !== metal)
      : [...filters.metal, metal];
    onFilterChange({ ...filters, metal: nextMetals });
  };

  // Price range selection
  const selectPriceRange = (min?: number, max?: number) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  // Sort change
  const handleSortChange = (sort: SortOption) => {
    onFilterChange({ ...filters, sort });
  };

  // In stock toggle
  const toggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  // Counts for categories
  const getCatCount = (cat: ProductCategory) => {
    return products.filter((p) => p.cat === cat).length;
  };

  // Counts for pearl types
  const getPearlCount = (pearl: PearlType) => {
    return products.filter((p) => p.pearl === pearl).length;
  };

  return (
    <div className={`w-full border-b border-[var(--border)] pb-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left: Desktop Horizontal Filter Popovers */}
        <div className="hidden lg:flex items-center gap-2.5 flex-wrap">
          {/* 1. Category Filter Popover */}
          <Popover
            trigger={
              <button
                type="button"
                className={`px-3.5 py-2 text-xs font-sans rounded-[2px] border transition-colors flex items-center gap-2 select-none ${
                  filters.category.length > 0
                    ? "border-[var(--brand)] text-[var(--brand)] font-medium bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
                }`}
              >
                <span>Category</span>
                {filters.category.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center font-bold">
                    {filters.category.length}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            }
          >
            <div className="p-3 w-56 space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-sans font-medium pb-1 border-b border-[var(--border)]">
                Jewelry Category
              </div>
              {ALL_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center justify-between py-1 px-1 rounded-[2px] hover:bg-[var(--surface-muted)] cursor-pointer text-xs text-[var(--text)] select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span>{cat}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-sans">
                    ({getCatCount(cat)})
                  </span>
                </label>
              ))}
            </div>
          </Popover>

          {/* 2. Pearl Type Filter Popover */}
          <Popover
            trigger={
              <button
                type="button"
                className={`px-3.5 py-2 text-xs font-sans rounded-[2px] border transition-colors flex items-center gap-2 select-none ${
                  filters.pearl.length > 0
                    ? "border-[var(--brand)] text-[var(--brand)] font-medium bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
                }`}
              >
                <span>Pearl Variety</span>
                {filters.pearl.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center font-bold">
                    {filters.pearl.length}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            }
          >
            <div className="p-3 w-56 space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-sans font-medium pb-1 border-b border-[var(--border)]">
                Natural Pearl Type
              </div>
              {ALL_PEARL_TYPES.map((pt) => (
                <label
                  key={pt}
                  className="flex items-center justify-between py-1 px-1 rounded-[2px] hover:bg-[var(--surface-muted)] cursor-pointer text-xs text-[var(--text)] select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={filters.pearl.includes(pt)}
                      onChange={() => togglePearl(pt)}
                    />
                    <span>{pt} Pearl</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-sans">
                    ({getPearlCount(pt)})
                  </span>
                </label>
              ))}
            </div>
          </Popover>

          {/* 3. Precious Metal Filter Popover */}
          <Popover
            trigger={
              <button
                type="button"
                className={`px-3.5 py-2 text-xs font-sans rounded-[2px] border transition-colors flex items-center gap-2 select-none ${
                  filters.metal.length > 0
                    ? "border-[var(--brand)] text-[var(--brand)] font-medium bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
                }`}
              >
                <span>Metal Alloy</span>
                {filters.metal.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center font-bold">
                    {filters.metal.length}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            }
          >
            <div className="p-3 w-52 space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-sans font-medium pb-1 border-b border-[var(--border)]">
                18K Solid Gold Alloy
              </div>
              {ALL_METALS.map((metal) => (
                <label
                  key={metal}
                  className="flex items-center gap-2.5 py-1 px-1 rounded-[2px] hover:bg-[var(--surface-muted)] cursor-pointer text-xs text-[var(--text)] select-none"
                >
                  <Checkbox
                    checked={filters.metal.includes(metal)}
                    onChange={() => toggleMetal(metal)}
                  />
                  <span>{metal}</span>
                </label>
              ))}
            </div>
          </Popover>

          {/* 4. Price Range Popover */}
          <Popover
            trigger={
              <button
                type="button"
                className={`px-3.5 py-2 text-xs font-sans rounded-[2px] border transition-colors flex items-center gap-2 select-none ${
                  filters.minPrice !== undefined || filters.maxPrice !== undefined
                    ? "border-[var(--brand)] text-[var(--brand)] font-medium bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
                }`}
              >
                <span>Price</span>
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                )}
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            }
          >
            <div className="p-3 w-52 space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-sans font-medium pb-1 border-b border-[var(--border)]">
                Price (USD)
              </div>
              {PRICE_RANGES.map((r) => {
                const isSelected = filters.minPrice === r.min && filters.maxPrice === r.max;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectPriceRange(r.min, r.max)}
                    className={`w-full flex items-center justify-between text-left py-1.5 px-2 rounded-[2px] text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--brand-muted)] text-[var(--brand)] font-semibold"
                        : "text-[var(--text)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    <span>{r.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
                  </button>
                );
              })}
            </div>
          </Popover>

          {/* 5. In-Stock Only Button Toggle */}
          <button
            type="button"
            onClick={toggleInStock}
            className={`px-3.5 py-2 text-xs font-sans rounded-[2px] border transition-colors select-none ${
              filters.inStockOnly
                ? "border-[var(--brand)] text-[var(--brand)] font-medium bg-[var(--surface-muted)]"
                : "border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)]"
            }`}
          >
            In Stock Only
          </button>
        </div>

        {/* Mobile Filter Sheet Trigger Button */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex items-center gap-2 px-3.5 py-2 rounded-[2px] border border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)] text-xs font-sans btn-press"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[var(--brand)] text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-xs text-[var(--text-secondary)] font-sans hidden sm:inline select-none">
            <strong className="text-[var(--text)] font-semibold">{totalResults}</strong>{" "}
            {totalResults === 1 ? "piece" : "pieces"}
          </span>

          <SortDropdown value={filters.sort} onChange={handleSortChange} />
        </div>
      </div>
    </div>
  );
}
