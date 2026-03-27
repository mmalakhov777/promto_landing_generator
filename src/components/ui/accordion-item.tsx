'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from '@/components/icons/chevron-down';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

export function AccordionItem({ question, answer, isOpen, onToggle, id }: AccordionItemProps) {
  const headingId = `${id}-heading`;
  const panelId = `${id}-panel`;

  return (
    <div
      className={cn(
        'rounded-[24px] lg:rounded-[20px] overflow-hidden transition-colors duration-300',
        'shadow-card lg:shadow-card-md',
      )}
      style={{ backgroundColor: 'var(--theme-accordion-bg)' }}
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* Question row button */}
      <button
        id={headingId}
        className={cn(
          'w-full flex items-center text-left cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue',
          'rounded-[24px] lg:rounded-[20px]',
          'gap-3 lg:gap-8',
          isOpen
            ? 'p-6 lg:pt-5 lg:pr-5 lg:pb-0 lg:pl-8'
            : 'p-6 lg:py-5 lg:pr-5 lg:pl-8',
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className="flex-1 text-lg lg:text-xl font-medium text-text-primary leading-[1.24] lg:max-w-[687px]"
          itemProp="name"
        >
          {question}
        </span>

        <span
          className={cn(
            'flex-shrink-0 flex items-center justify-center transition-transform duration-200',
            'w-8 h-8 rounded-[27px] lg:w-[49px] lg:h-[49px] lg:rounded-[40px]',
            'bg-subtle lg:bg-subtle-light',
            isOpen ? 'rotate-180' : '',
          )}
          aria-hidden="true"
        >
          <ChevronDown size={18} className="text-text-secondary lg:hidden" />
          <ChevronDown size={24} className="text-text-secondary hidden lg:block" />
        </span>
      </button>

      {/* Answer panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="px-6 pb-6 lg:pl-8 lg:pr-5 lg:pb-8 lg:pt-3"
            itemScope
            itemType="https://schema.org/Answer"
            itemProp="acceptedAnswer"
          >
            <p className="text-sm text-text-secondary leading-[1.3] lg:max-w-[687px]" itemProp="text">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
