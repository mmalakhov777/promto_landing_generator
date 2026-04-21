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
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-[20px] bg-surface shadow-card transition-shadow hover:shadow-[0px_4px_12px_0px_rgba(149,149,149,0.12)]"
            >
              <summary
                onClick={handleToggle}
                className="flex cursor-pointer items-center justify-between px-8 py-5 text-left text-text font-medium [&::-webkit-details-marker]:hidden"
              >
                {item.question}
                <div className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border-light transition-transform group-open:rotate-180">
                  <svg
                    className="h-4 w-4 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-8 pb-6 text-sm leading-relaxed text-text-muted">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
