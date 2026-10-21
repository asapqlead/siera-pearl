import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Siera Pearl",
  description:
    "Explore answers regarding natural pearl provenance, grading, complimentary delivery, 30-day returns, sizing, and bespoke atelier commissions.",
  openGraph: {
    title: "Frequently Asked Questions — Siera Pearl",
    description:
      "Explore answers regarding natural pearl provenance, grading, delivery, returns, and bespoke commissions.",
    type: "website",
  },
};

const FAQ_SECTIONS: { category: string; description: string; items: AccordionItem[] }[] = [
  {
    category: "Natural Pearls & Provenance",
    description: "Questions regarding pearl origin, nacre depth, and grading.",
    items: [
      {
        id: "natural-vs-synthetic",
        title: "Are Siera pearls natural, cultured, or synthetic?",
        content: (
          <p>
            All Siera pearls are genuine, organically cultivated in living oysters within protected marine lagoons. We never sell synthetic plastic-core imitations, coated glass beads, or shell pearls. Each piece is issued with an individual certificate of authenticity signed by our chief gemologist.
          </p>
        ),
      },
      {
        id: "pearl-varieties",
        title: "What varieties of pearls do you offer?",
        content: (
          <p>
            We curate four primary natural varieties: Japanese Akoya (celebrated for intense mirror-like orient), Tahitian Black Pearls (prized for iridescent peacock, aubergine, and graphite undertones), Australian South Sea (renowned for substantial 9–14mm diameters and warm champagne or silver luster), and selected Freshwater pearls.
          </p>
        ),
      },
      {
        id: "grading-standards",
        title: "How are your pearls graded?",
        content: (
          <p>
            We grade pearls based on five essential criteria: Lustre (sharpness of specular light reflections), Surface Cleanliness (unblemished skin), Shape (near-perfect sphericity or organic baroque character), Color (body color and overtone orient), and Nacre Thickness. We accept only the top 1% of harvested oyster yields.
          </p>
        ),
      },
    ],
  },
  {
    category: "Delivery & Security",
    description: "Courier methods, dispatch times, transit insurance, and international shipping.",
    items: [
      {
        id: "shipping-cost",
        title: "Is shipping truly complimentary without minimums?",
        content: (
          <p>
            Yes. Standard courier delivery via FedEx / UPS is 100% complimentary for all collectors worldwide, with zero minimum spending requirements. We believe fine jewelry dispatch should be effortless and secure.
          </p>
        ),
      },
      {
        id: "security-packaging",
        title: "How is the jewel packaged for security?",
        content: (
          <p>
            Outer cartons are completely unbranded and discreet to prevent attention during transit. Inside, your jewelry rests in a warm ivory presentation case with certificate documents. All shipments require an adult signature upon delivery and travel fully insured from vault to doorstep.
          </p>
        ),
      },
      {
        id: "tracking-orders",
        title: "How can I track my order once placed?",
        content: (
          <p>
            You will receive an automated email with your courier tracking link as soon as your parcel is sealed. You can also visit our <Link href="/account" className="text-[var(--brand)] underline">Account</Link> page anytime to locate your parcel using your order confirmation number.
          </p>
        ),
      },
    ],
  },
  {
    category: "Returns & 30-Day Evaluation",
    description: "Our in-home evaluation period and prepaid returns process.",
    items: [
      {
        id: "returns-policy",
        title: "What is your 30-day evaluation policy?",
        content: (
          <p>
            We offer unhurried 30-day returns on all unworn jewelry in its original presentation packaging. A prepaid, fully insured courier return label is provided with every order upon request.
          </p>
        ),
      },
      {
        id: "refund-timing",
        title: "When will my refund be processed?",
        content: (
          <p>
            Once our gemologists receive and inspect the returned jewel (typically within 48 hours of delivery), your refund is credited directly to your original payment method. Depending on your financial institution, credits appear within 2–4 business days.
          </p>
        ),
      },
    ],
  },
  {
    category: "Materials & Sustainability",
    description: "Information regarding our 18k solid gold alloys and marine conservation.",
    items: [
      {
        id: "gold-purity",
        title: "Do you use gold plating or solid gold?",
        content: (
          <p>
            We exclusively cast in solid 18k gold (750 alloy). We never use gold plating, vermeil, or hollow tubing. Solid 18k gold maintains its rich luster for generations and will never peel, tarnish, or cause allergic reactions.
          </p>
        ),
      },
      {
        id: "recycled-metals",
        title: "Are your precious metals ethically sourced?",
        content: (
          <p>
            Yes. 100% of our 18k gold is certified recycled precious metal refined from existing ethical sources, dramatically minimizing mining environmental impact while ensuring uncompromised metallurgical purity.
          </p>
        ),
      },
      {
        id: "marine-sanctuary",
        title: "How do your oyster lagoons support marine conservation?",
        content: (
          <p>
            Pearl oysters thrive only in clean, bio-diverse waters. Our partner lagoons actively protect coastal marine ecosystems from industrial pollution, overfishing, and agricultural runoff. Oyster beds naturally filter coastal waters, fostering rich underwater ecosystems.
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <AnnouncementBar />
      <Header />

      <main id="main-content" className="flex-1">
        {/* Header */}
        <section className="py-14 sm:py-20 bg-[var(--surface-muted)] border-b border-[var(--border)]">
          <div className="site-container max-w-4xl text-center space-y-3">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
              className="justify-center mb-4"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Client Questions
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text)] font-normal tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xl mx-auto leading-relaxed">
              Find transparent insights into natural pearl grading, solid 18k gold metallurgy, global insured delivery, and our 30-day evaluation policy.
            </p>
          </div>
        </section>

        {/* Categorized FAQ Sections */}
        <div className="site-container max-w-3xl py-16 sm:py-20 space-y-14">
          {FAQ_SECTIONS.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-serif text-2xl text-[var(--text)] font-normal">
                  {sec.category}
                </h2>
                <p className="text-xs text-[var(--text-tertiary)] font-light">
                  {sec.description}
                </p>
              </div>

              <Accordion items={sec.items} allowMultiple />
            </div>
          ))}

          {/* Need Further Assistance Card */}
          <div className="p-8 bg-white border border-[var(--border)] rounded-[2px] text-center space-y-4">
            <h3 className="font-serif text-2xl text-[var(--text)] font-normal">
              Have an Unanswered Question?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-md mx-auto leading-relaxed">
              Our private concierge is at your service for bespoke sizing, gemological appraisals, and personalized advice.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs uppercase tracking-widest font-medium px-8 py-3.5 rounded-[2px] transition-colors"
              >
                Contact Concierge Atelier
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
