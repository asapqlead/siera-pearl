"use client";

import React from "react";
import { Product } from "@/types/product";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export interface ProductAccordionsProps {
  product: Product;
  className?: string;
}

export function ProductAccordions({ product, className = "" }: ProductAccordionsProps) {
  const getDimensionsText = () => {
    switch (product.cat) {
      case "Necklaces":
        return "Strand length: 18 inches (45 cm). Pearl diameter: 7.5 mm – 8.0 mm uniform graduated layout. Clasp: 18K solid gold safety barrel.";
      case "Earrings":
        return "Drop length: 22 mm. Pearl diameter: 8.5 mm. Post & back: 18K solid gold friction post with comfort-disc backs.";
      case "Bracelets":
        return "Length: 7.0 inches (17.8 cm standard comfort fit). Pearl diameter: 6.5 mm – 7.0 mm. Clasp: 18K solid gold hand-finished clasp.";
      case "Rings":
        return "Pearl diameter: 9.0 mm solitaire set. Band width: 1.8 mm comfort-fit knife-edge profile. Setting: 18K solid gold 4-prong cup.";
      case "Bridal":
      default:
        return "Strand suite length: 18 inches. Pearl diameter: 8.0 mm – 8.5 mm AAA mirror lustre. Metal alloy: 18K solid white/yellow gold.";
    }
  };

  const items: AccordionItem[] = [
    {
      id: "details",
      title: "Details & Dimensions",
      content: (
        <div className="space-y-3 text-xs font-sans text-[var(--text-secondary)] font-light leading-relaxed">
          <p>{getDimensionsText()}</p>
          <ul className="list-disc pl-4 space-y-1.5 text-[var(--text-secondary)]">
            <li>Metal: Certified Recycled 18K Solid Gold (750 hallmark)</li>
            <li>Origin: Certified sustainable coastal pearl aquaculture</li>
            <li>Condition: Natural color, untreated organic nacre</li>
            <li>Presentation: Includes warm ivory gift presentation box and appraisal certificate</li>
          </ul>
        </div>
      ),
    },
    {
      id: "materials",
      title: "Pearl & Materials",
      content: (
        <div className="space-y-3 text-xs font-sans text-[var(--text-secondary)] font-light leading-relaxed">
          <p>
            Siera Pearl sources only natural saltwater and premium freshwater pearls from pristine marine lagoons.
            Every pearl in this piece has been individually appraised for mirror lustre, clean surface quality, and deep nacre thickness.
          </p>
          <p>
            Our gold is 100% recycled 18-karat solid gold, alloyed for lasting tensile strength and warm heirloom radiance.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Complimentary Delivery & Returns",
      content: (
        <div className="space-y-3 text-xs font-sans text-[var(--text-secondary)] font-light leading-relaxed">
          <p>
            <strong>Complimentary Insured Delivery:</strong> Delivered via expedited air courier within 4–6 business days in tamper-evident security packaging with signature required.
          </p>
          <p>
            <strong>30-Day Returns & Resizing:</strong> If your piece does not exceed expectations, we offer complimentary insured returns and exchanges within 30 days of delivery.
          </p>
        </div>
      ),
    },
    {
      id: "care",
      title: "Jewelry Care Guide",
      content: (
        <div className="space-y-3 text-xs font-sans text-[var(--text-secondary)] font-light leading-relaxed">
          <p>
            Natural pearls are organic gems that respond gently to respectful care:
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-[var(--text-secondary)]">
            <li><strong>Last on, first off:</strong> Put your pearls on after applying makeup, perfume, and hairspray.</li>
            <li><strong>Gentle cleaning:</strong> Wipe gently with the included microfiber silk cloth after wearing to remove natural oils.</li>
            <li><strong>Storage:</strong> Store flat in your Siera velvet pouch, separated from harder gemstones like diamonds.</li>
          </ul>
        </div>
      ),
    },
  ];

  return <Accordion items={items} defaultOpenId="details" className={className} />;
}
