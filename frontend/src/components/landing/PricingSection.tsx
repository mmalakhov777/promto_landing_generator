"use client";

import { useEffect, useRef } from "react";
import { reachGoal } from "@/lib/metrika";
import type { PricingPlan } from "@/types/public";

interface PricingSectionProps {
  title: string;
  plans: PricingPlan[];
  popularLabel: string;
  ctaTextPrimary: string;
  ctaTextSecondary: string;
  metrikaId?: string;
}

export function PricingSection({
  title,
  plans,
  popularLabel,
  ctaTextPrimary,
  ctaTextSecondary,
  metrikaId,
}: PricingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackedRef = useRef(false);

  // Track pricing_view when section scrolls into view
  useEffect(() => {
    if (!metrikaId || trackedRef.current) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true;
          reachGoal(metrikaId, "pricing_view");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [metrikaId]);

  if (!plans.length) return null;

  const handleCtaClick = () => {
    if (metrikaId) {
      reachGoal(metrikaId, "cta_click");
    }
  };

  return (
    <section ref={sectionRef} className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-[32px] p-8 transition-shadow ${
                plan.is_popular
                  ? "card-gradient-border shadow-card"
                  : "bg-surface shadow-card shadow-card-hover"
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-pink px-5 py-1.5 text-xs font-medium text-white">
                  {popularLabel}
                </div>
              )}
              <h3 className="text-xl font-medium text-text">{plan.name}</h3>
              <div className="mt-4 text-3xl font-medium text-gradient">{plan.price}</div>
              {plan.features.length > 0 && (
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-sm text-text-muted">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icons/plus-square.svg" alt="" width={12} height={12} className="text-primary opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(4800%) hue-rotate(233deg) brightness(100%) contrast(101%)' }} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {plan.cta_url && (
                <a
                  href={plan.cta_url}
                  rel="nofollow noopener"
                  onClick={handleCtaClick}
                  className={`mt-6 block py-3.5 text-center text-sm font-medium transition-all ${
                    plan.is_popular
                      ? "btn-gradient"
                      : "btn-outline-gradient"
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
