import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Box, CheckCircle2 } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Complimentary Delivery & 30-Day Returns — Siera Pearl",
  description:
    "Complimentary insured global courier dispatch, discreet security packaging, and unhurried 30-day returns with prepaid insured shipping.",
  openGraph: {
    title: "Complimentary Delivery & 30-Day Returns — Siera Pearl",
    description:
      "Complimentary insured global courier dispatch, discreet security packaging, and unhurried 30-day returns.",
    type: "website",
  },
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header Section */}
        <section className="py-14 sm:py-20 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-3">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Shipping & Returns" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Client Care &amp; Logistics
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal tracking-tight">
              Complimentary Delivery &amp; 30-Day Returns
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto leading-relaxed">
              Every Siera Pearl acquisition travels fully insured in tamper-evident security packaging, backed by an unhurried 30-day in-home evaluation period.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="site-container max-w-4xl py-16 sm:py-20 space-y-16">
          {/* 1. Shipping Methods Table */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 01
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Courier Delivery Options
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light">
                Standard insured delivery is complimentary for all collectors worldwide. Never subject to order minimums.
              </p>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)] text-[var(--text-tertiary)] uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-6 font-medium">Service</th>
                    <th className="py-3.5 px-6 font-medium">Transit Forecast</th>
                    <th className="py-3.5 px-6 font-medium text-right">Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text)]">
                      Complimentary Insured Courier
                      <span className="block text-[11px] font-light text-[var(--text-tertiary)] mt-0.5">
                        FedEx / UPS Priority with signature required
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] font-light">
                      2–3 Business Days
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[var(--brand)]">
                      Complimentary ($0)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text)]">
                      Express Courier
                      <span className="block text-[11px] font-light text-[var(--text-tertiary)] mt-0.5">
                        Expedited air dispatch with priority queue
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] font-light">
                      1–2 Business Days
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[var(--text)]">
                      $35.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--text)]">
                      Priority Overnight
                      <span className="block text-[11px] font-light text-[var(--text-tertiary)] mt-0.5">
                        Next business day morning delivery (orders before 1pm EST)
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-secondary)] font-light">
                      Next Business Day
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-[var(--text)]">
                      $65.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[var(--text-tertiary)] font-light italic">
              * Note: Orders placed after 1:00 PM EST or during weekends ship on the following business day. Delivery times to Alaska, Hawaii, and remote territories may require 1 additional day.
            </p>
          </div>

          {/* 2. Security Packaging */}
          <div className="space-y-6 pt-6 border-t border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 02
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Discreet, Tamper-Evident Security Packaging
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[var(--text-secondary)] font-light">
              <div className="p-6 bg-white border border-[var(--border)] rounded-[2px] space-y-2">
                <Box className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-serif text-base text-[var(--text)] font-medium">
                  Unmarked Exterior
                </h3>
                <p className="leading-relaxed">
                  Outer cartons bear zero branding, jewelry references, or logos to deter theft in transit.
                </p>
              </div>

              <div className="p-6 bg-white border border-[var(--border)] rounded-[2px] space-y-2">
                <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-serif text-base text-[var(--text)] font-medium">
                  100% Insured Transit
                </h3>
                <p className="leading-relaxed">
                  Every parcel is fully insured from our atelier vault until the moment it is signed for at your door.
                </p>
              </div>

              <div className="p-6 bg-white border border-[var(--border)] rounded-[2px] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-serif text-base text-[var(--text)] font-medium">
                  Adult Signature Required
                </h3>
                <p className="leading-relaxed">
                  Drivers will never leave packages unattended on porches or in common entryways.
                </p>
              </div>
            </div>
          </div>

          {/* 3. 30-Day Returns Policy */}
          <div className="space-y-6 pt-6 border-t border-[var(--border)]">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                Part 03
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                Unhurried 30-Day In-Home Returns
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light">
                Fine jewelry should be experienced in natural light. We provide unhurried 30-day complimentary returns on all unworn items.
              </p>
            </div>

            <div className="bg-[var(--surface-muted)] p-8 border border-[var(--border)] rounded-[2px] space-y-6">
              <h3 className="font-serif text-xl text-[var(--text)] font-medium">
                How to Return a Piece
              </h3>

              <ol className="list-decimal list-inside space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                <li>
                  <strong className="text-[var(--text)] font-medium">
                    Initiate Your Return:
                  </strong>{" "}
                  Email <a href="mailto:concierge@sierapearl.com" className="text-[var(--brand)] underline">concierge@sierapearl.com</a> or visit your <Link href="/account" className="text-[var(--brand)] underline">Account</Link> to download a prepaid, fully insured courier return label.
                </li>
                <li>
                  <strong className="text-[var(--text)] font-medium">
                    Package Securely:
                  </strong>{" "}
                  Place the jewel in its original warm ivory presentation case with all appraisal certificates and documentation.
                </li>
                <li>
                  <strong className="text-[var(--text)] font-medium">
                    Hand to Courier:
                  </strong>{" "}
                  Affix the prepaid label to an outer shipping box and drop off at any authorized FedEx / UPS station or request a courier pickup.
                </li>
                <li>
                  <strong className="text-[var(--text)] font-medium">
                    Prompt Refund:
                  </strong>{" "}
                  Upon inspection by our gemologists (usually within 48 hours of delivery), your refund will be credited directly to your original payment method.
                </li>
              </ol>

              <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--text-tertiary)] font-light">
                <p>
                  <em>TODO: Confirm with client</em> — Custom engraved commissions or bespoke pearl drillings may be subject to a nominal re-polishing restocking fee. Standard collection pieces are 100% refundable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
