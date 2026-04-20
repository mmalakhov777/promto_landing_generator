import type { PricingPlan } from "@/types/public";

interface PricingSectionProps {
  title: string;
  plans: PricingPlan[];
  popularLabel: string;
  ctaTextPrimary: string;
  ctaTextSecondary: string;
}

export function PricingSection({ title, plans, popularLabel, ctaTextPrimary, ctaTextSecondary }: PricingSectionProps) {
  if (!plans.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-text">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                plan.is_popular
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-white"
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                  {popularLabel}
                </div>
              )}
              <h3 className="text-xl font-bold text-text">{plan.name}</h3>
              <div className="mt-4 text-3xl font-bold text-primary">{plan.price}</div>
              {plan.features.length > 0 && (
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="mt-0.5 text-success">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {plan.cta_url && (
                <a
                  href={plan.cta_url}
                  rel="nofollow noopener"
                  className={`mt-6 block rounded-xl py-3 text-center text-sm font-medium transition-colors ${
                    plan.is_popular
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "border border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  {plan.is_popular ? ctaTextPrimary : ctaTextSecondary}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
