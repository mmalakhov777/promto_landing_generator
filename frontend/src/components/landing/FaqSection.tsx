"use client";

import { reachGoal } from "@/lib/metrika";
import type { FaqItem } from "@/types/public";

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
  metrikaId?: string;
}

export function FaqSection({ title, items, metrikaId }: FaqSectionProps) {
  if (!items.length) return null;

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    // Track only when opening (details doesn't have "open" attribute yet)
    const details = e.currentTarget.closest("details");
    if (details && !details.open && metrikaId) {
      reachGoal(metrikaId, "faq_open");
    }
  };

  return (
    <section className="py-section">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-text">{title}</h2>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-border bg-white transition-shadow hover:shadow-sm"
            >
              <summary
                onClick={handleToggle}
                className="flex cursor-pointer items-center justify-between px-6 py-4 text-left text-text font-medium [&::-webkit-details-marker]:hidden"
              >
                {item.question}
                <svg
                  className="ml-4 h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-border px-6 py-4 text-sm leading-relaxed text-text-muted">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
