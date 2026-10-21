"use client";

import React, { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { getProductPhotos } from "@/lib/images";
import { Badge } from "@/components/ui/Badge";

export interface ProductGalleryProps {
  product: Product;
  className?: string;
}

export function ProductGallery({ product, className = "" }: ProductGalleryProps) {
  const photos = getProductPhotos(product);
  const images = photos.all.length > 0 ? photos.all : [photos.primary, photos.secondary];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activePhoto = images[activeIndex] || photos.primary;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  return (
    <div className={`flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 ${className}`}>
      {/* Vertical Desktop Thumbnails */}
      <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
        {images.map((img, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`relative aspect-[4/5] w-full rounded-[2px] overflow-hidden bg-[var(--surface-muted)] transition-all select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                isSelected
                  ? "ring-2 ring-[var(--brand)] opacity-100 shadow-2xs"
                  : "opacity-60 hover:opacity-100 ring-1 ring-[var(--border)]"
              }`}
              aria-label={`View photo ${idx + 1} of ${product.name}`}
            >
              <Image
                src={img}
                alt={`${product.name} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          );
        })}
      </div>

      {/* Main 4:5 Large Viewport with Hover Zoom Lens */}
      <div
        ref={imageContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-[4/5] w-full rounded-[2px] overflow-hidden bg-[var(--surface-muted)] cursor-crosshair select-none"
      >
        {/* Subtle Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <Badge
              type={product.badge}
              variant="label"
              className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-[2px] shadow-2xs"
            />
          </div>
        )}

        {/* Large High-Res Image with Smooth Zoom */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={activePhoto}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            style={{
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            }}
            className={`object-cover object-center transition-transform duration-200 ease-out ${
              isHovered ? "scale-[1.65]" : "scale-100"
            }`}
          />
        </div>

        {/* Zoom Hint Overlay on Desktop */}
        <div
          className={`absolute bottom-3 right-3 text-[10px] font-sans text-[var(--text-tertiary)] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-[2px] pointer-events-none transition-opacity hidden lg:block ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          Hover to zoom
        </div>
      </div>

      {/* Mobile Thumbnail Dots / Carousel Strip */}
      <div className="flex lg:hidden items-center justify-center gap-2 pt-1">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === idx
                ? "w-6 bg-[var(--brand)]"
                : "w-1.5 bg-[var(--border)] hover:bg-[var(--text-tertiary)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
