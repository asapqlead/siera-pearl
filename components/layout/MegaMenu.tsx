"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { CATEGORY_TILES } from "@/lib/images";

export interface MegaMenuSubcategory {
  label: string;
  href: string;
}

export interface MegaMenuContent {
  category: ProductCategory;
  subcategories: MegaMenuSubcategory[];
  featured: {
    title: string;
    description: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
  };
}

export const MEGA_MENU_DATA: Record<ProductCategory, MegaMenuContent> = {
  Necklaces: {
    category: "Necklaces",
    subcategories: [
      { label: "All Necklaces", href: "/catalog?category=Necklaces" },
      { label: "Classic Pearl Strands", href: "/catalog?category=Necklaces&pearl=Akoya" },
      { label: "Solitaire Pendants", href: "/catalog?category=Necklaces&search=Pendant" },
      { label: "Lariats & Chokers", href: "/catalog?category=Necklaces&search=Lariat" },
      { label: "Opera & Double Strands", href: "/catalog?category=Necklaces&search=Opera" },
      { label: "Keshi Petal Necklaces", href: "/catalog?category=Necklaces&pearl=Keshi" },
    ],
    featured: {
      title: "The Akoya Strand",
      description: "Hand-matched pearls in mirror lustre, finished in 18k solid gold.",
      href: "/products/01-classic-akoya-strand",
      imageSrc: CATEGORY_TILES.Necklaces.src,
      imageAlt: CATEGORY_TILES.Necklaces.alt,
    },
  },
  Earrings: {
    category: "Earrings",
    subcategories: [
      { label: "All Earrings", href: "/catalog?category=Earrings" },
      { label: "Classic Studs", href: "/catalog?category=Earrings&search=Studs" },
      { label: "South Sea Drops", href: "/catalog?category=Earrings&pearl=South+Sea" },
      { label: "Huggies & Hoops", href: "/catalog?category=Earrings&search=Huggies" },
      { label: "Threaders & Climbers", href: "/catalog?category=Earrings&search=Threaders" },
      { label: "Tahitian Halo Studs", href: "/catalog?category=Earrings&pearl=Tahitian" },
    ],
    featured: {
      title: "Golden South Sea Drops",
      description: "Naturally golden pearls suspended on warm 18k gold wires.",
      href: "/products/09-golden-south-sea-drops",
      imageSrc: CATEGORY_TILES.Earrings.src,
      imageAlt: CATEGORY_TILES.Earrings.alt,
    },
  },
  Bracelets: {
    category: "Bracelets",
    subcategories: [
      { label: "All Bracelets", href: "/catalog?category=Bracelets" },
      { label: "Tennis Bracelets", href: "/catalog?category=Bracelets&search=Tennis" },
      { label: "Solid Bangles", href: "/catalog?category=Bracelets&search=Bangle" },
      { label: "Toggle & Charm Chains", href: "/catalog?category=Bracelets&search=Toggle" },
      { label: "Freshwater Wraps", href: "/catalog?category=Bracelets&pearl=Freshwater" },
      { label: "Keshi Cluster Rows", href: "/catalog?category=Bracelets&pearl=Keshi" },
    ],
    featured: {
      title: "Akoya Tennis Bracelet",
      description: "A continuous row of uniform Akoya pearls with a secure box clasp.",
      href: "/products/15-akoya-tennis-bracelet",
      imageSrc: CATEGORY_TILES.Bracelets.src,
      imageAlt: CATEGORY_TILES.Bracelets.alt,
    },
  },
  Rings: {
    category: "Rings",
    subcategories: [
      { label: "All Rings", href: "/catalog?category=Rings" },
      { label: "Solitaire Pearl Rings", href: "/catalog?category=Rings&search=Solitaire" },
      { label: "Halo Diamond Bands", href: "/catalog?category=Rings&search=Halo" },
      { label: "Stacking Rings", href: "/catalog?category=Rings&search=Stack" },
      { label: "Tahitian Statement Rings", href: "/catalog?category=Rings&pearl=Tahitian" },
      { label: "Signet Rings", href: "/catalog?category=Rings&search=Signet" },
    ],
    featured: {
      title: "Classic Akoya Solitaire",
      description: "A single pristine Akoya pearl elevated above a knife-edge gold shank.",
      href: "/products/21-classic-akoya-solitaire",
      imageSrc: CATEGORY_TILES.Rings.src,
      imageAlt: CATEGORY_TILES.Rings.alt,
    },
  },
  Bridal: {
    category: "Bridal",
    subcategories: [
      { label: "All Bridal Jewelry", href: "/catalog?category=Bridal" },
      { label: "Wedding Day Suites", href: "/catalog?category=Bridal&search=Set" },
      { label: "Ceremony Drops", href: "/catalog?category=Bridal&search=Drops" },
      { label: "Three-Strand Chokers", href: "/catalog?category=Bridal&search=Strand" },
      { label: "Grand South Sea Sets", href: "/catalog?category=Bridal&pearl=South+Sea" },
      { label: "Bridesmaid Gifts", href: "/catalog?category=Earrings&pearl=Freshwater" },
    ],
    featured: {
      title: "Bridal Trio Suite",
      description: "Coordinated necklace, earrings, and bracelet for modern nuptials.",
      href: "/products/27-bridal-trio-set",
      imageSrc: CATEGORY_TILES.Bridal.src,
      imageAlt: CATEGORY_TILES.Bridal.alt,
    },
  },
};

interface MegaMenuProps {
  category: ProductCategory;
  onClose: () => void;
}

export function MegaMenu({ category, onClose }: MegaMenuProps) {
  const data = MEGA_MENU_DATA[category];
  if (!data) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full inset-x-0 bg-white border-b border-[var(--border)] shadow-xl z-50 animate-popover-in"
    >
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-12 gap-10 items-start">
          {/* Subcategories Column */}
          <div className="col-span-4 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
              {data.category}
            </h3>
            <ul className="space-y-3">
              {data.subcategories.map((sub) => (
                <li key={sub.label}>
                  <Link
                    href={sub.href}
                    onClick={onClose}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand)] transition-colors block py-0.5 font-normal hover:font-medium"
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sourcing / Quick Filters */}
          <div className="col-span-3 space-y-4 border-l border-[var(--border-subtle)] pl-8">
            <h3 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
              Filter by Pearl
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] font-light">
              <li>
                <Link
                  href={`/catalog?category=${category}&pearl=Akoya`}
                  onClick={onClose}
                  className="hover:text-[var(--brand)] transition-colors block py-0.5"
                >
                  Japanese Akoya
                </Link>
              </li>
              <li>
                <Link
                  href={`/catalog?category=${category}&pearl=South+Sea`}
                  onClick={onClose}
                  className="hover:text-[var(--brand)] transition-colors block py-0.5"
                >
                  Golden South Sea
                </Link>
              </li>
              <li>
                <Link
                  href={`/catalog?category=${category}&pearl=Tahitian`}
                  onClick={onClose}
                  className="hover:text-[var(--brand)] transition-colors block py-0.5"
                >
                  Tahitian Peacock
                </Link>
              </li>
              <li>
                <Link
                  href={`/catalog?category=${category}&pearl=Freshwater`}
                  onClick={onClose}
                  className="hover:text-[var(--brand)] transition-colors block py-0.5"
                >
                  Freshwater Baroque
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Editorial Photo Card */}
          <div className="col-span-5 bg-[var(--surface-muted)] rounded-[3px] p-5 flex gap-6 items-center border border-[var(--border)]">
            <div className="relative w-28 h-36 flex-shrink-0 bg-white rounded-[2px] overflow-hidden">
              <Image
                src={data.featured.imageSrc}
                alt={data.featured.imageAlt}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--brand)] font-semibold">
                Curated Spotlight
              </span>
              <h4 className="font-serif text-lg text-[var(--text)] font-medium leading-snug">
                {data.featured.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                {data.featured.description}
              </p>
              <Link
                href={data.featured.href}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--brand)] font-semibold pt-1 hover:underline underline-offset-4"
              >
                <span>Discover piece</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
