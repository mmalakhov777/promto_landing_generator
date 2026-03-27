import { cn } from '@/lib/utils';
import type { PricingPlan } from '@/lib/constants';
import { Check } from '@/components/icons/check';

interface PricingPlanCardProps {
  plan: PricingPlan;
  isSelected: boolean;
  onSelect: () => void;
}

/* Theme-aware gradient fills — uses CSS vars for dark mode green accent */
const PRICE_GRADIENT = `linear-gradient(188deg, var(--theme-accent-from) 0%, var(--theme-accent-to) 71%)`;
const MONTH_GRADIENT = `linear-gradient(184deg, var(--theme-accent-from) 0%, var(--theme-accent-to) 100%)`;
const STROKE_GRADIENT = `linear-gradient(90deg, var(--theme-accent-to) 0%, var(--theme-accent-from) 100%)`;
const CHECK_GRADIENT = `linear-gradient(195deg, var(--theme-accent-from) 0%, var(--theme-accent-to) 67%)`;

function PriceDisplay({ plan }: { plan: PricingPlan }) {
  return (
    <span className="flex items-end gap-[6px]">
      <span
        className="text-[32px] lg:text-[28px] font-medium leading-[1.24] bg-clip-text text-transparent"
        style={{ backgroundImage: PRICE_GRADIENT }}
      >
        {plan.price}₽
      </span>
      <span className="pb-[7px]">
        <span
          className="text-sm font-normal leading-[1.2] bg-clip-text text-transparent"
          style={{ backgroundImage: MONTH_GRADIENT }}
        >
          /&nbsp;&nbsp;месяц
        </span>
      </span>
    </span>
  );
}

export function PricingPlanCard({ plan, isSelected, onSelect }: PricingPlanCardProps) {
  const cardContent = (
    <>
      {isSelected ? (
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: CHECK_GRADIENT }}
        >
          <Check size={16} className="text-white" />
        </span>
      ) : (
        <span className="w-6 h-6 rounded-full border-[1.5px] border-border-muted flex-shrink-0" />
      )}

      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold leading-[1.3] lg:leading-[1.25] text-text-primary whitespace-nowrap">
          {plan.name}
        </span>
        <PriceDisplay plan={plan} />
      </span>
    </>
  );

  return (
    <button
      className="w-full text-left rounded-[20px] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      {isSelected ? (
        <span
          className="block rounded-[20px] p-[1.25px] lg:p-[1.5px]"
          style={{ background: STROKE_GRADIENT }}
        >
          <span
            className="flex items-center gap-5 lg:gap-4 p-5 lg:p-4 rounded-[18.75px] lg:rounded-[18.5px]"
            style={{
              background: 'var(--theme-pricing-selected-overlay)',
              backgroundColor: 'var(--theme-pricing-selected-fill)',
            }}
          >
            {cardContent}
          </span>
        </span>
      ) : (
        <span className={cn(
          'flex items-center rounded-[20px]',
          'gap-5 px-5 py-4',
          'lg:gap-4 lg:p-4',
          'bg-bg-inactive lg:bg-subtle',
        )}>
          {cardContent}
        </span>
      )}
    </button>
  );
}
