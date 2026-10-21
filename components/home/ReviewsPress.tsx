import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

interface PatronReview {
  name: string;
  location: string;
  rating: number;
  quote: string;
  product: string;
}

const REVIEWS: PatronReview[] = [
  {
    name: "Eleanor S.",
    location: "Manhattan, New York",
    rating: 5,
    quote:
      "The Akoya strand is even more luminous in morning light than photographed. It arrived exquisitely boxed with a signed appraisal certificate — an instant family heirloom.",
    product: "Classic Akoya Pearl Strand",
  },
  {
    name: "Marcus T.",
    location: "Mayfair, London",
    rating: 5,
    quote:
      "Commissioned the Tahitian ring for our anniversary. The orient shifts between peacock green and subtle aubergine depending on the angle. Nothing off the shelf compares.",
    product: "Tahitian Statement Ring",
  },
  {
    name: "Priya R.",
    location: "Singapore",
    rating: 5,
    quote:
      "The discreet insured packaging and weight of the solid 18k gold bezels felt like receiving high jewelry from Geneva. These drops have not left my ears since arrival.",
    product: "Freshwater Baroque Drop Earrings",
  },
];

const PRESS_CITATIONS = [
  {
    publication: "Financial Times",
    quote: "A benchmark for quiet, sustainable pearl jewelry and transparent provenance.",
  },
  {
    publication: "Vogue",
    quote: "Heirloom-grade natural pearls set in solid gold without retail markups.",
  },
  {
    publication: "Harper's Bazaar",
    quote: "Exquisite oceanic orient and flawless classical craftsmanship.",
  },
];

export function ReviewsPress() {
  return (
    <section className="py-20 sm:py-24 bg-[var(--surface-muted)] border-b border-[var(--border)]">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
            Patron Reflections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
            Stories from Our Collectors
          </h2>
          {/* Subtle Overall Rating */}
          <div className="inline-flex items-center gap-2 pt-1 text-xs text-[var(--text-secondary)]">
            <div className="flex text-[var(--accent)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-medium text-[var(--text)]">5.0</span>
            <span className="text-[var(--text-tertiary)]">&middot;</span>
            <span>Based on 480+ Verified Appraisals</span>
          </div>
        </div>

        {/* 3 Patron Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-[var(--border)] p-6 sm:p-8 flex flex-col justify-between rounded-[2px]"
            >
              <div className="space-y-4">
                {/* 5 Muted Gold Stars */}
                <div className="flex text-[var(--accent)]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-serif text-base sm:text-lg text-[var(--text)] leading-relaxed italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-6 border-t border-[var(--border-subtle)] mt-6 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text)]">
                    {review.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--brand)] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-[var(--brand)]" />
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] font-light">
                  {review.location}
                </p>
                <p className="text-xs text-[var(--accent)] font-medium pt-1">
                  Selected: {review.product}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Press Citations Strip */}
        <div className="pt-10 border-t border-[var(--border)]">
          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-[var(--text-tertiary)] font-medium mb-8">
            As Recognized In
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {PRESS_CITATIONS.map((press, i) => (
              <div key={i} className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-serif text-lg font-medium text-[var(--text)]">
                  {press.publication}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] font-light italic leading-relaxed">
                  &ldquo;{press.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
