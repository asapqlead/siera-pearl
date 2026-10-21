"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { FormError } from "@/components/ui/FormError";
import { Swatch } from "@/components/ui/Swatch";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { Popover } from "@/components/ui/Popover";
import { Toast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetalType } from "@/types/product";

export default function StyleguidePage() {
  // Interactive state holders
  const [selectedMetal, setSelectedMetal] = useState<MetalType>("Yellow Gold");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("necklaces");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState("standard");
  const [inputText, setInputText] = useState("Akoya Solitaire");
  const [buttonLoading, setButtonLoading] = useState(false);

  const simulateLoading = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 1600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text)] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[var(--border)]">|</span>
            <span className="font-serif text-lg font-medium text-[var(--text)]">
              Siera Pearl Design System &amp; Component Library
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge type="New" variant="chip" customText="Tokens Verified" />
            <span className="text-xs text-[var(--text-secondary)] font-sans hidden sm:inline">
              WCAG 2.2 AA Compliant
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-16">
        {/* Intro */}
        <section className="space-y-3 pb-8 border-b border-[var(--border)]">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--accent)] font-semibold">
            Living Component Specimen
          </p>
          <h1 className="text-display-h1">The Architectural System</h1>
          <p className="text-body text-[var(--text-secondary)] max-prose-ch">
            Every component is built once with unified tokens, strict radius constraints (2–4px or square; pills only for status chips), Emil Kowalski motion curves, and comprehensive keyboard states.
          </p>
        </section>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">1. Color Palette &amp; Tokens</h2>
            <p className="text-body-sm">Tailored HSL values ensuring WCAG AA contrast (≥4.5:1 body, ≥3:1 UI).</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Warm Ivory (bg)", hex: "#FAF8F4", border: true },
              { name: "Surface (white)", hex: "#FFFFFF", border: true },
              { name: "Muted Surface", hex: "#F3EFE8", border: true },
              { name: "Ink (text)", hex: "#1B1B19", textLight: true },
              { name: "Charcoal Secondary", hex: "#5E5B55", textLight: true },
              { name: "Hairline Border", hex: "#E6E1D8", border: true },
              { name: "Deep Green (brand)", hex: "#12382C", textLight: true },
              { name: "Brand Hover", hex: "#1A4D3D", textLight: true },
              { name: "Muted Gold (accent)", hex: "#A9834A", textLight: true },
              { name: "Success Green", hex: "#2F6B4F", textLight: true },
              { name: "Warning Amber", hex: "#B7791F", textLight: true },
              { name: "Error Crimson", hex: "#B3382C", textLight: true },
            ].map((col) => (
              <div
                key={col.name}
                className="p-3 bg-white rounded-[3px] border border-[var(--border)] space-y-2"
              >
                <div
                  style={{ backgroundColor: col.hex }}
                  className={`h-12 w-full rounded-[2px] ${col.border ? "border border-[var(--border)]" : ""}`}
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--text)]">{col.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] font-mono">{col.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">2. Typography &amp; Leading</h2>
            <p className="text-body-sm">Cormorant Garamond (High-contrast display serif) + Inter (Neutral UI sans with tabular numbers).</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] space-y-6">
            <div className="pb-4 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                Display H1 — Cormorant Garamond (64px desktop / 40px mobile, tight leading 1.08)
              </span>
              <h1 className="text-display-h1">Natural Akoya Pearls, set to endure.</h1>
            </div>

            <div className="pb-4 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                Display H2 — Cormorant Garamond (40px desktop / 28px mobile, leading 1.15)
              </span>
              <h2 className="text-display-h2">Curated Oceanic Harvests &amp; Sourcing</h2>
            </div>

            <div className="pb-4 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                Display H3 — Cormorant Garamond (24px desktop / 20px mobile, leading 1.25)
              </span>
              <h3 className="text-display-h3">Hand-matched for deep mirror orient</h3>
            </div>

            <div className="pb-4 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                Body &amp; Reading Measure (Inter, 16px, max line length 65ch)
              </span>
              <p className="text-body max-prose-ch">
                Each pearl is individually assessed for skin purity, sphericity, and nacre depth. We hand-string each strand in our workshop using Japanese silk thread double-knotted between each pearl.
              </p>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] block mb-1">
                Label (12px, uppercase, 0.08em tracking) &amp; Tabular Price
              </span>
              <div className="flex items-center gap-6">
                <span className="text-label text-[var(--text-secondary)]">Akoya Pearl · 18K Solid Gold</span>
                <Price price={1280} was={1450} size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons & Actions */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-display-h2">3. Button Primitives</h2>
              <p className="text-body-sm">Primary (deep green), Secondary outline, Text link. 2-4px radius, scale(0.97) active press.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={simulateLoading}>
              Test Loading States
            </Button>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] space-y-8">
            {/* Sizes */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Variants &amp; Sizes
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" isLoading={buttonLoading}>
                  Add to bag — $1,280
                </Button>
                <Button variant="primary" size="md" isLoading={buttonLoading}>
                  Primary Button
                </Button>
                <Button variant="primary" size="sm" isLoading={buttonLoading}>
                  Small Button
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <Button variant="secondary" size="md">
                Secondary Outline
              </Button>
              <Button variant="outline" size="md">
                Brand Outline
              </Button>
              <Button variant="text">
                Text link with underline on hover →
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled Button
              </Button>
            </div>
          </div>
        </section>

        {/* 4. Form Controls */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">4. Inputs, Selects &amp; Radios</h2>
            <p className="text-body-sm">Visible labels, inline validation errors, clear focus-visible rings.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Title"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              hint="Enter the exact catalog display name"
            />

            <Input
              label="Email Address"
              defaultValue="invalid-email"
              error="Please provide a valid delivery email address"
              required
            />

            <Select
              label="Pearl Variety"
              options={[
                { label: "Akoya (Japanese Mirror Lustre)", value: "akoya" },
                { label: "Tahitian (Exotic Peacock)", value: "tahitian" },
                { label: "South Sea (Warm Golden)", value: "south-sea" },
                { label: "Freshwater (Organic Petal)", value: "freshwater" },
              ]}
            />

            <div className="space-y-4 pt-1">
              <label className="block text-xs uppercase tracking-wider font-medium text-[var(--text)]">
                Toggles &amp; Selections
              </label>
              <div className="space-y-3">
                <Checkbox
                  label="Complimentary archival gift wrapping"
                  description="Includes hand-tied grosgrain ribbon and custom note card"
                  checked={checkboxState}
                  onChange={(e) => setCheckboxState(e.target.checked)}
                />

                <div className="flex items-center gap-6 pt-1">
                  <Radio
                    name="shipping-test"
                    label="Free Insured Shipping (4–6 days)"
                    checked={radioState === "standard"}
                    onChange={() => setRadioState("standard")}
                  />
                  <Radio
                    name="shipping-test"
                    label="Express Courier (2 days)"
                    checked={radioState === "express"}
                    onChange={() => setRadioState("express")}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <FormError message="Unable to complete payment. Card verification failed. Please check CVC code." />
            </div>
          </div>
        </section>

        {/* 5. Swatches & Steppers */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">5. Swatches &amp; Quantity Controls</h2>
            <p className="text-body-sm">Precious metal alloys with focus indicator; stepper with bounds checking.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] flex flex-wrap items-center gap-10">
            <div>
              <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                Metal Finish Selector (Selected: {selectedMetal})
              </span>
              <div className="flex items-center gap-3">
                <Swatch
                  metal="Yellow Gold"
                  selected={selectedMetal === "Yellow Gold"}
                  onSelect={setSelectedMetal}
                  showLabel
                />
                <Swatch
                  metal="Rose Gold"
                  selected={selectedMetal === "Rose Gold"}
                  onSelect={setSelectedMetal}
                  showLabel
                />
                <Swatch
                  metal="White Gold"
                  selected={selectedMetal === "White Gold"}
                  onSelect={setSelectedMetal}
                  showLabel
                />
              </div>
            </div>

            <div>
              <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-2">
                Quantity Stepper
              </span>
              <QuantityStepper value={qty} onChange={setQty} min={1} max={5} />
            </div>
          </div>
        </section>

        {/* 6. Badges, Price & Rating */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">6. Badges, Prices &amp; Ratings</h2>
            <p className="text-body-sm">Max one badge per item; tabular numbers; gold star ratings.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] space-y-6">
            <div>
              <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-3">
                Quiet Text Labels (Product Card Standard)
              </span>
              <div className="flex items-center gap-6">
                <Badge type="Bestseller" variant="label" />
                <Badge type="New" variant="label" />
                <Badge type="Low stock" variant="label" />
                <Badge type="Sold out" variant="label" />
                <Badge type="Sale" variant="label" />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-3">
                Status Chips (Pill shape permitted strictly here)
              </span>
              <div className="flex items-center gap-3">
                <Badge type="Bestseller" variant="chip" />
                <Badge type="New" variant="chip" />
                <Badge type="Low stock" variant="chip" />
                <Badge type="Sold out" variant="chip" />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-10">
              <div>
                <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-1">
                  Price Display
                </span>
                <Price price={890} was={1050} size="lg" />
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-1">
                  Client Rating
                </span>
                <Rating score={4.9} reviewCount={32} />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Navigation: Breadcrumbs & Tabs */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">7. Navigation: Breadcrumbs &amp; Tabs</h2>
            <p className="text-body-sm">Keyboard-navigable horizontal tabs with hairline indicator.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] space-y-6">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Necklaces", href: "/catalog?category=Necklaces" },
                { label: "Classic Akoya Strand" },
              ]}
            />

            <Tabs
              activeId={activeTab}
              onChange={setActiveTab}
              items={[
                { id: "necklaces", label: "Necklaces", count: 7 },
                { id: "earrings", label: "Earrings", count: 7 },
                { id: "bracelets", label: "Bracelets", count: 6 },
                { id: "rings", label: "Rings", count: 6 },
                { id: "bridal", label: "Bridal", count: 4 },
              ]}
            />
          </div>
        </section>

        {/* 8. Accordion */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">8. Accordion Pattern</h2>
            <p className="text-body-sm">Factual product specs, pearl origins, and care guides.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)]">
            <Accordion
              defaultOpenId="details"
              items={[
                {
                  id: "details",
                  title: "Jewelry Specifications",
                  content:
                    "Strung with 34 matched natural Akoya pearls (7.0–7.5mm) in AAA grade lustre. Fastened with an 18k solid white gold ball clasp (stamped 750). Total length 18 inches (Princess length).",
                },
                {
                  id: "materials",
                  title: "Pearl & Materials Sourcing",
                  content:
                    "Cultivated in the cool coastal lagoons of Mie Prefecture, Japan. Set exclusively in certified recycled 18k solid gold. Completely free of nickel, cadmium, and synthetic surface lacquers.",
                },
                {
                  id: "shipping",
                  title: "Complimentary Delivery & Returns",
                  content:
                    "Every order includes free insured global delivery in tamper-evident security packaging. Unhurried 30-day home evaluation with pre-paid return shipping.",
                },
              ]}
            />
          </div>
        </section>

        {/* 9. Drawers, Modals & Popovers */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">9. Overlays, Drawers &amp; Dialogs</h2>
            <p className="text-body-sm">Accessible focus traps, ESC dismiss, origin-aware entrances.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-[var(--border)] flex flex-wrap items-center gap-4">
            <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
              Open Slide-Over Drawer
            </Button>

            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Open Centered Dialog Modal
            </Button>

            <Popover
              trigger={
                <Button variant="secondary" rightIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
                  Filter Popover
                </Button>
              }
            >
              <div className="w-64 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text)]">
                  Filter by Pearl Variety
                </div>
                <div className="space-y-2">
                  <Checkbox label="Akoya" defaultChecked />
                  <Checkbox label="South Sea" />
                  <Checkbox label="Tahitian" />
                  <Checkbox label="Freshwater" />
                </div>
              </div>
            </Popover>

            <Button variant="outline" onClick={() => setShowToast(true)}>
              Trigger Notification Toast
            </Button>
          </div>
        </section>

        {/* 10. Skeletons & Empty States */}
        <section className="space-y-6">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-display-h2">10. Loading Skeletons &amp; Empty State</h2>
            <p className="text-body-sm">No layout shift during async fetching; clean fallback states.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-[4px] border border-[var(--border)]">
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block mb-3 font-semibold">
                4:5 Product Card Skeleton
              </span>
              <Skeleton variant="card" />
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-[4px] border border-[var(--border)] flex items-center justify-center">
              <EmptyState
                title="No pieces match your filters"
                description="Try broadening your maximum price range or selecting an alternate pearl variety."
                actionLabel="Reset all filters"
                onAction={() => alert("Filters reset")}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Drawer Instance */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Shopping Bag (1)"
        footer={
          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-sans text-[var(--text-secondary)]">Subtotal</span>
              <span className="font-sans font-medium text-[var(--text)] tabular-nums">$1,280</span>
            </div>
            <Button variant="primary" className="w-full">
              Proceed to Checkout
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)]">
            This slide-over drawer traps focus, supports smooth ESC dismissal, and uses Emil Kowalski iOS drawer physics.
          </p>
          <div className="p-3 bg-[var(--surface-muted)] rounded-[3px] text-xs">
            Free insured shipping automatically applied.
          </div>
        </div>
      </Drawer>

      {/* Interactive Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ring Size Conversion Guide"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
            Close Guide
          </Button>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed text-[var(--text-secondary)]">
          <p>
            All Siera Pearl rings are sized according to standard US metric circumferences.
          </p>
          <table className="w-full border-collapse border border-[var(--border)] text-left text-xs">
            <thead>
              <tr className="bg-[var(--surface-muted)]">
                <th className="p-2 border border-[var(--border)]">US Size</th>
                <th className="p-2 border border-[var(--border)]">Inside Diameter (mm)</th>
                <th className="p-2 border border-[var(--border)]">Inside Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-[var(--border)] font-medium">5</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">15.7</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">49.3</td>
              </tr>
              <tr>
                <td className="p-2 border border-[var(--border)] font-medium">6</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">16.5</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">51.9</td>
              </tr>
              <tr>
                <td className="p-2 border border-[var(--border)] font-medium">7</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">17.3</td>
                <td className="p-2 border border-[var(--border)] tabular-nums">54.4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Interactive Toast Instance */}
      {showToast && (
        <Toast
          message="Item Saved to Wishlist"
          description="Classic Akoya Strand (Yellow Gold) added to your vault."
          actionLabel="View Wishlist"
          onAction={() => alert("Navigating to wishlist...")}
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
