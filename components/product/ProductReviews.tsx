"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Product } from "@/types/product";

export interface ProductReviewsProps {
  product: Product;
  className?: string;
}

const REVIEWS = [
  {
    id: 1,
    author: "Eleanor V.",
    location: "New York, NY",
    date: "October 8, 2026",
    rating: 5,
    title: "Sublime lustre and substantial gold weight",
    body: "The mirror reflection on these pearls is truly extraordinary. The solid 18k gold clasp has a reassuring, substantial click. You can tell immediately that these are untreated, lagoon-cultivated natural gems. Far superior to department store pearls.",
    verified: true,
  },
  {
    id: 2,
    author: "Marcus L.",
    location: "San Francisco, CA",
    date: "September 24, 2026",
    rating: 5,
    title: "An heirloom anniversary gift",
    body: "Purchased for our 10th anniversary. The warm ivory presentation box and certified appraisal document made the unboxing experience feel like high jewelry from Place Vendôme. My wife hasn't taken it off.",
    verified: true,
  },
  {
    id: 3,
    author: "Sophia M.",
    location: "London, UK",
    date: "August 19, 2026",
    rating: 5,
    title: "Breath-taking overtone in daylight",
    body: "The subtle peacock and rose overtones in natural morning light are hypnotic. The strand rests flat along the collarbone with perfect drape. Truly exceptional craftsmanship.",
    verified: true,
  },
];

export function ProductReviews({ product: _product, className = "" }: ProductReviewsProps) {
  return (
    <section id="reviews" className={`py-12 border-t border-[var(--border)] ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[var(--border)]">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-tertiary)] font-sans font-medium">
              Verified Client Appraisals
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal mt-1">
              Collector Experiences
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start sm:items-end">
              <div className="flex items-center gap-1.5 text-[var(--accent)] text-lg">
                <span>★★★★★</span>
                <span className="font-sans font-semibold text-sm text-[var(--text)]">5.0</span>
              </div>
              <span className="text-xs text-[var(--text-tertiary)] font-sans font-light">
                Based on 24 verified acquisitions
              </span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-[var(--border)]">
          {REVIEWS.map((review) => (
            <article key={review.id} className="py-6 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text)]">{review.author}</span>
                  <span className="text-[var(--text-tertiary)] font-light">· {review.location}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[var(--brand)] font-medium text-[11px] bg-[var(--brand-muted)] px-1.5 py-0.2 rounded-[2px]">
                      <CheckCircle2 className="w-3 h-3 stroke-[2]" />
                      Verified Owner
                    </span>
                  )}
                </div>
                <time className="text-[var(--text-tertiary)] font-light">{review.date}</time>
              </div>

              <div className="flex items-center text-[var(--accent)] text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <h3 className="font-serif text-base text-[var(--text)] font-medium">
                {review.title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                {review.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
