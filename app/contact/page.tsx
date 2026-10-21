import React from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Concierge & Private Inquiries — Siera Pearl",
  description:
    "Connect with our private jewelry concierge for gemological guidance, sizing appraisals, bespoke commissions, and care inquiries.",
  openGraph: {
    title: "Concierge & Private Inquiries — Siera Pearl",
    description:
      "Connect with our private jewelry concierge for guidance, sizing, and bespoke commissions.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="py-14 sm:py-20 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-3">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Concierge & Contact" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Private Concierge
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal tracking-tight">
              We are at your service.
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto leading-relaxed">
              Whether selecting an anniversary gift, measuring a custom strand, or arranging an appraisal, our advisory team offers unhurried personal counsel.
            </p>
          </div>
        </section>

        {/* Form and Contact Details */}
        <div className="site-container py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium">
                  Direct Inquiries
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text)] font-normal">
                  Private Client Atelier
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                  Our gemological advisors are available Monday through Friday to guide your collection decisions.
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-[var(--border)] text-xs sm:text-sm text-[var(--text-secondary)] font-light">
                <div className="flex items-start gap-3.5">
                  <Mail className="w-4 h-4 text-[var(--brand)] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[var(--text)] font-medium block">
                      Email Concierge
                    </strong>
                    <a
                      href="mailto:concierge@sierapearl.com"
                      className="text-[var(--brand)] hover:underline"
                    >
                      concierge@sierapearl.com
                    </a>
                    <span className="text-xs text-[var(--text-tertiary)] block mt-0.5">
                      Response within 24 business hours
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-4 h-4 text-[var(--brand)] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[var(--text)] font-medium block">
                      Telephone
                    </strong>
                    <a
                      href="tel:+18005557437"
                      className="text-[var(--text)] hover:underline"
                    >
                      +1 (800) 555-SIERA
                    </a>
                    <span className="text-xs text-[var(--text-tertiary)] block mt-0.5">
                      Monday &ndash; Friday, 9:00 AM &ndash; 6:00 PM EST
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-4 h-4 text-[var(--brand)] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[var(--text)] font-medium block">
                      Private Viewing Salon
                    </strong>
                    <span>Fifth Avenue, Manhattan, New York</span>
                    <span className="text-xs text-[var(--text-tertiary)] block mt-0.5">
                      By private appointment only
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[2px] text-xs text-[var(--text-secondary)] font-light space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
                  <strong className="text-[var(--text)] font-medium">
                    Complimentary Appraisal Archival
                  </strong>
                </div>
                <p className="leading-relaxed">
                  Lost your certificate of authenticity or appraisal card? Contact our concierge with your order reference number to receive a certified replacement digital copy.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
