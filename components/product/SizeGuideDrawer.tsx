"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Tabs } from "@/components/ui/Tabs";

export interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: "Rings" | "Bracelets";
}

const RING_SIZES = [
  { us: "5", uk: "J ½", eu: "49", diameter: "15.7 mm", circumference: "49.3 mm" },
  { us: "6", uk: "M", eu: "52", diameter: "16.5 mm", circumference: "51.9 mm" },
  { us: "7", uk: "O", eu: "54", diameter: "17.3 mm", circumference: "54.4 mm" },
  { us: "8", uk: "Q", eu: "57", diameter: "18.1 mm", circumference: "57.0 mm" },
  { us: "9", uk: "S", eu: "59", diameter: "19.0 mm", circumference: "59.5 mm" },
];

const BRACELET_SIZES = [
  { size: "Small", inches: '6.5"', cm: "16.5 cm", wristFit: "Fits wrists 5.75\" – 6.25\"" },
  { size: "Medium", inches: '7.0"', cm: "17.8 cm", wristFit: "Fits wrists 6.25\" – 6.75\" (Standard)" },
  { size: "Large", inches: '7.5"', cm: "19.0 cm", wristFit: "Fits wrists 6.75\" – 7.25\"" },
];

export function SizeGuideDrawer({
  isOpen,
  onClose,
  defaultCategory = "Rings",
}: SizeGuideDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultCategory === "Bracelets" ? "bracelets" : "rings"
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Sizing & Fit Atelier Guide"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <Tabs
          items={[
            { id: "rings", label: "Ring Sizing" },
            { id: "bracelets", label: "Bracelet Sizing" },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "rings" ? (
          <div className="space-y-5 text-xs font-sans text-[var(--text)]">
            <p className="text-[var(--text-secondary)] leading-relaxed font-light">
              Fine pearl rings should slide smoothly over the knuckle and sit comfortably without spinning.
              If you fall between sizes, we recommend ordering one size larger.
            </p>

            {/* Ring Conversion Table */}
            <div className="border border-[var(--border)] rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                    <th className="py-2.5 px-3 font-medium">US</th>
                    <th className="py-2.5 px-3 font-medium">UK</th>
                    <th className="py-2.5 px-3 font-medium">EU</th>
                    <th className="py-2.5 px-3 font-medium">Diameter</th>
                    <th className="py-2.5 px-3 font-medium">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {RING_SIZES.map((row) => (
                    <tr key={row.us} className="hover:bg-[var(--surface-muted)] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[var(--text)]">{row.us}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)]">{row.uk}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)]">{row.eu}</td>
                      <td className="py-2.5 px-3 font-mono text-[var(--text-secondary)]">{row.diameter}</td>
                      <td className="py-2.5 px-3 font-mono text-[var(--text-secondary)]">{row.circumference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-[var(--surface-muted)] rounded-[2px] border border-[var(--border)] space-y-1.5">
              <div className="font-medium text-[var(--text)]">Complimentary Atelier Resizing</div>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                All Siera Pearl rings include one complimentary resizing within 30 days of delivery.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-xs font-sans text-[var(--text)]">
            <p className="text-[var(--text-secondary)] leading-relaxed font-light">
              Wrap a flexible tape or strip of paper snugly around your wrist just below the wrist bone.
              Add 0.5 inches (1.3 cm) for a comfortable, fluid drape.
            </p>

            {/* Bracelet Conversion Table */}
            <div className="border border-[var(--border)] rounded-[2px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                    <th className="py-2.5 px-3 font-medium">Size</th>
                    <th className="py-2.5 px-3 font-medium">Length (Inches)</th>
                    <th className="py-2.5 px-3 font-medium">Length (Metric)</th>
                    <th className="py-2.5 px-3 font-medium">Wrist Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {BRACELET_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-[var(--surface-muted)] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[var(--text)]">{row.size}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)]">{row.inches}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)]">{row.cm}</td>
                      <td className="py-2.5 px-3 text-[var(--text-secondary)] font-light">{row.wristFit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-[var(--surface-muted)] rounded-[2px] border border-[var(--border)] space-y-1.5">
              <div className="font-medium text-[var(--text)]">Bespoke Lengths</div>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Need a specific length? Our master goldsmith can customize chain and tennis bracelet lengths upon request.
              </p>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
