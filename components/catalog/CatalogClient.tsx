"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product, ProductCategory, PearlType, MetalType } from "@/types/product";
import {
  CatalogFilterState,
  parseCatalogFilters,
  buildCatalogQueryString,
  filterAndSortProducts,
  DEFAULT_CATALOG_FILTERS,
} from "@/lib/filter-utils";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterBar } from "@/components/catalog/FilterBar";
import { FilterChips } from "@/components/catalog/FilterChips";
import { MobileFilterSheet } from "@/components/catalog/MobileFilterSheet";
import { EmptyState } from "@/components/ui/EmptyState";

export interface CatalogClientProps {
  initialProducts: Product[];
}

export function CatalogClient({ initialProducts }: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial filter state from current URL
  const [filters, setFilters] = useState<CatalogFilterState>(() =>
    parseCatalogFilters(searchParams)
  );

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Keep state synced when user clicks back/forward in browser
  useEffect(() => {
    setFilters(parseCatalogFilters(searchParams));
  }, [searchParams]);

  // Update URL whenever filters change
  const handleFilterChange = (nextFilters: CatalogFilterState) => {
    setFilters(nextFilters);
    const qs = buildCatalogQueryString(nextFilters);
    startTransition(() => {
      router.replace(`${pathname}${qs}`, { scroll: false });
    });
  };

  // Filter and sort items in real-time
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(initialProducts, filters);
  }, [initialProducts, filters]);

  // Dynamic editorial headline
  const pageTitle = useMemo(() => {
    if (filters.category.length === 1) {
      return filters.category[0];
    }
    if (filters.pearl.length === 1) {
      return `${filters.pearl[0]} Pearl Collection`;
    }
    return "Fine Pearl Collection";
  }, [filters.category, filters.pearl]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="site-container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-sans text-[var(--text-tertiary)]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--brand)] transition-colors flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[var(--text)] font-semibold" aria-current="page">
                {pageTitle}
              </li>
            </ol>
          </nav>

          {/* Editorial Collection Header */}
          <header className="mb-10 max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--text)] tracking-tight leading-tight">
              {pageTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed max-prose-ch">
              Each jewel is set by hand in recycled 18k solid gold, showcasing certified natural pearls
              harvested from protected oceanic lagoons with zero environmental impact.
            </p>
          </header>

          {/* Horizontal Popover Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            products={initialProducts}
            totalResults={filteredProducts.length}
            onOpenMobileFilters={() => setMobileFilterOpen(true)}
          />

          {/* Active Filter Chips Bar */}
          <FilterChips
            filters={filters}
            onRemoveCategory={(cat: ProductCategory) =>
              handleFilterChange({
                ...filters,
                category: filters.category.filter((c) => c !== cat),
              })
            }
            onRemovePearl={(pearl: PearlType) =>
              handleFilterChange({
                ...filters,
                pearl: filters.pearl.filter((p) => p !== pearl),
              })
            }
            onRemoveMetal={(metal: MetalType) =>
              handleFilterChange({
                ...filters,
                metal: filters.metal.filter((m) => m !== metal),
              })
            }
            onClearPrice={() =>
              handleFilterChange({
                ...filters,
                minPrice: undefined,
                maxPrice: undefined,
              })
            }
            onClearInStock={() =>
              handleFilterChange({
                ...filters,
                inStockOnly: false,
              })
            }
            onClearSearch={() =>
              handleFilterChange({
                ...filters,
                search: "",
              })
            }
            onClearAll={() => handleFilterChange(DEFAULT_CATALOG_FILTERS)}
          />

          {/* Product Grid / Empty State */}
          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <EmptyState
                  title="No heirloom pieces match your current criteria"
                  description="We cultivate limited lagoon harvests. Try clearing specific filters or resetting to view our full collection."
                  actionLabel="Reset All Filters"
                  onAction={() => handleFilterChange(DEFAULT_CATALOG_FILTERS)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-14">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={idx < 4}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Global Shopping Bag Drawer */}
      <CartDrawer />

      {/* Mobile Filter Slide-over Sheet */}
      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        products={initialProducts}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}
