import React from "react";

interface FactPillar {
  index: string;
  title: string;
  subtitle: string;
  description: string;
}

const FACTS: FactPillar[] = [
  {
    index: "01",
    title: "Natural Pearl Origins",
    subtitle: "Grade AAA Nacre & Mirror Orient",
    description:
      "Every pearl is organically cultivated in protected marine lagoons, exhibiting authentic orient and natural depth. Never synthetically coated or plastic-nucleated.",
  },
  {
    index: "02",
    title: "Secure Global Dispatch",
    subtitle: "Complimentary Insured Courier",
    description:
      "All orders ship in discreet, tamper-evident security packaging with GPS tracking and door-to-door transit insurance. Always complimentary, without order thresholds.",
  },
  {
    index: "03",
    title: "Unhurried Consideration",
    subtitle: "30-Day In-Home Evaluation",
    description:
      "Fine jewelry should be experienced in natural light. We offer unhurried 30-day complimentary returns alongside lifetime restringing and atelier appraisal support.",
  },
];

export function WhySieraPearl() {
  return (
    <section className="py-20 sm:py-24 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
            The Siera Standard
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] font-normal tracking-tight">
            Fine Jewelry Without Compromise
          </h2>
        </div>

        {/* 3 Quiet Factual Columns — Zero Icon Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {FACTS.map((fact) => (
            <div
              key={fact.index}
              className="flex flex-col space-y-3 pt-6 border-t border-[var(--border)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--accent)] tracking-widest">
                  {fact.index}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium">
                  {fact.subtitle}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl text-[var(--text)] font-medium">
                {fact.title}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
