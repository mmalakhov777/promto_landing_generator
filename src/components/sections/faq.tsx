'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/lib/constants';
import { AccordionItem } from '@/components/ui/accordion-item';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="faq-heading"
    >
      {/* Desktop: row, gap 304px, px-120. Mobile: column, gap 60px */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px] xl:px-[120px]">
        <div className="flex flex-col gap-[60px] lg:flex-row lg:justify-between">
          {/* Heading: mobile centered 28px, desktop left 38px */}
          <div className="flex-shrink-0">
            <h2
              id="faq-heading"
              className="text-[28px] lg:text-[38px] font-semibold text-text-primary leading-[1.24] lg:leading-[1.12] text-center lg:text-left lg:sticky lg:top-[100px]"
            >
              FAQ
            </h2>
          </div>

          {/* Cards container: mobile px-3, desktop max-w-820 flex-1 */}
          <div className="w-full lg:max-w-[820px] lg:flex-1 flex flex-col gap-3 px-3 lg:px-0">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={`faq-${item.q.slice(0, 20)}`}
                id={`faq-${i}`}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
