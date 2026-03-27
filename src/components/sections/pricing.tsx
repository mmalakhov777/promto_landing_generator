'use client';

import { useState } from 'react';
import { PRICING_PLANS, type PricingTier } from '@/lib/constants';
import { SectionContainer } from '@/components/ui/section-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { GradientText } from '@/components/ui/gradient-text';
import { PricingPlanCard } from '@/components/ui/pricing-plan-card';
import { Button } from '@/components/ui/button';
import { AiMagic } from '@/components/icons/ai-magic';
import { ArrowUpRight } from '@/components/icons/arrow-up-right';
import Image from 'next/image';

const CTA_LABELS: Record<PricingTier, string> = {
  junior: 'Выбрать джуниор-агента',
  middle: 'Выбрать миддл-агента',
  senior: 'Выбрать сеньор-агента',
};

export function Pricing() {
  const [activePlan, setActivePlan] = useState<PricingTier>('middle');

  return (
    <section
      id="pricing"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="pricing-heading"
    >
      <SectionContainer>
        {/* ── Desktop heading + subtitle (Figma: column, center, gap 24px, w 700px) ── */}
        <div className="hidden lg:flex flex-col items-center gap-6 max-w-[700px] mx-auto mb-20">
          <SectionHeading id="pricing-heading" align="center">
            Готовы создать свой проект<br />
            <GradientText as="span" angle="-90deg, rgba(94,255,110,1) 0%, rgba(70,78,255,1) 100%">
              прямо сейчас?
            </GradientText>
          </SectionHeading>
          {/* style_J3MO00: 14px/400/1.3/CENTER, w 627px */}
          <p className="text-sm text-text-secondary leading-[1.3] max-w-[627px] text-center">
            Сегодня у вас есть только идея. Через 5 минут может быть уже
            рабочий сайт. Всё, что нужно,&nbsp;&mdash; зайти в Промто и
            написать пару строчек.
          </p>
        </div>

        {/* ── Desktop: large card with left content + right gradient preview ── */}
        <div
          className="hidden lg:flex bg-bg-card rounded-[32px] shadow-card-md items-center overflow-hidden gap-10"
          style={{ padding: '12px 12px 12px 40px' }}
        >
          {/* Left: content (column, gap 50px, w 526px) */}
          <div className="flex-shrink-0 w-[526px] flex flex-col gap-[50px]">
            {/* Heading + Cards group (column, gap 24px) */}
            <div className="flex flex-col gap-6">
              {/* style_D9SY3U: 24px/500/1.25 */}
              <h3 className="text-2xl font-semibold text-text-primary leading-[1.25]">
                Безлимитный доступ без ограничений по токенам и запросам
              </h3>

              <div className="flex flex-col gap-3">
                {PRICING_PLANS.map((plan) => (
                  <PricingPlanCard
                    key={plan.id}
                    plan={plan}
                    isSelected={activePlan === plan.id}
                    onSelect={() => setActivePlan(plan.id)}
                  />
                ))}
              </div>
            </div>

            {/* CTA buttons — row, gap 12px */}
            <div className="flex gap-3">
              <Button variant="primary" size="md" icon={<ArrowUpRight size={18} color="white" />} href="https://app.promto.ai">
                {CTA_LABELS[activePlan]}
              </Button>
              <Button variant="outline" size="md" icon={<AiMagic size={18} color="gradient" />} href="https://app.promto.ai" animated>
                Попробовать бесплатно
              </Button>
            </div>
          </div>

          {/* Right: gradient preview panel — 582×557, exported from Figma */}
          <div className="flex-1 flex-shrink-0">
            <Image
              src="/images/pricing/pricing-chat-panel.png"
              alt="Пример интерфейса Промто"
              width={582}
              height={557}
              className="rounded-[32px]"
              priority
            />
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden">
          {/* Heading: Figma frame 216×105, centered. Two text nodes stacked. */}
          <div className="flex justify-center mb-6">
            <h2
              id="pricing-heading-mobile"
              className="text-[28px] font-semibold leading-[1.24] text-text-primary text-center max-w-[216px]"
            >
              Готовы создать свой проект{' '}
              <GradientText
                as="span"
                angle="-90deg, rgba(94,255,110,1) 0%, rgba(70,78,255,1) 100%"
              >
                прямо сейчас?
              </GradientText>
            </h2>
          </div>

          {/* Description: style_8YFYPE 14px/400/1.4/CENTER, #858585 */}
          <p className="text-sm font-normal text-text-secondary leading-[1.4] text-center mb-[60px]">
            Сегодня у вас есть только идея.
            Через 5 минут может быть уже рабочий
            сайт. Всё, что нужно, — зайти в Промто
            и написать пару строчек.
          </p>

          {/* Cards — gap 12px, then 50px gap to buttons */}
          <div className="flex flex-col gap-3 mb-[50px]">
            {PRICING_PLANS.map((plan) => (
              <PricingPlanCard
                key={plan.id}
                plan={plan}
                isSelected={activePlan === plan.id}
                onSelect={() => setActivePlan(plan.id)}
              />
            ))}
          </div>

          {/* CTA buttons — column, gap 12px, w-327 per Figma (375-48px padding) */}
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="md" icon={<ArrowUpRight size={18} color="white" />} href="https://app.promto.ai" className="w-full justify-center">
              {CTA_LABELS[activePlan]}
            </Button>
            <Button variant="outline" size="md" icon={<AiMagic size={18} color="gradient" />} href="https://app.promto.ai" className="w-full justify-center" animated>
              Попробовать бесплатно
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
