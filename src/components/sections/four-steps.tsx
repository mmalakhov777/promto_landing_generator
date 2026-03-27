import { STEPS } from '@/lib/constants';
import { SectionContainer } from '@/components/ui/section-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { StepCard } from '@/components/ui/step-card';
import type { ReactNode } from 'react';

/* Desktop & mobile titles with line breaks matching Figma */
const STEP_TITLES: { desktop: ReactNode; mobile: ReactNode }[] = [
  {
    desktop: <>Опишите задачу</>,
    mobile: <>Опишите задачу</>,
  },
  {
    desktop: <>Выберите одного<br />или нескольких агентов</>,
    mobile: <>Выберите одного<br />или нескольких<br />агентов</>,
  },
  {
    desktop: <>Дождитесь результата<br />за 2-5 минут</>,
    mobile: <>Дождитесь результата<br />за 2-5 минут</>,
  },
  {
    desktop: <>Получите готовый продукт</>,
    mobile: <>Получите готовый продукт</>,
  },
];

const STEP_IMAGES = [
  {
    desktop: '/images/steps/step1-desktop.png',
    mobile: '/images/steps/step1-mobile.png',
    desktopSize: { w: 1300, h: 630 },
    mobileSize: { w: 670, h: 324 },
  },
  {
    desktop: '/images/steps/step2-desktop.png',
    mobile: '/images/steps/step2-mobile.png',
    desktopSize: { w: 1300, h: 630 },
    mobileSize: { w: 670, h: 324 },
  },
  {
    desktop: '/images/steps/step3-desktop.png',
    mobile: '/images/steps/step3-mobile.png',
    desktopSize: { w: 1348, h: 678 },
    mobileSize: { w: 710, h: 364 },
  },
  {
    desktop: '/images/steps/step4-desktop.png',
    mobile: '/images/steps/step4-mobile.png',
    desktopSize: { w: 1348, h: 678 },
    mobileSize: { w: 695, h: 349 },
  },
];

export function FourSteps() {
  return (
    <section
      id="how-it-works"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="how-heading"
    >
      <SectionContainer>
        {/* Heading — max-w-[700px] centered to match Figma */}
        <div className="max-w-[700px] mx-auto mb-[60px] lg:mb-20">
          <SectionHeading id="how-heading" align="center">
            От идеи до готового продукта за четыре шага
          </SectionHeading>
        </div>

        {/* Step cards */}
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              number={`( ${step.num} )`}
              desktopTitle={STEP_TITLES[i].desktop}
              mobileTitle={STEP_TITLES[i].mobile}
              description={step.desc}
              desktopImage={STEP_IMAGES[i].desktop}
              mobileImage={STEP_IMAGES[i].mobile}
              desktopSize={STEP_IMAGES[i].desktopSize}
              mobileSize={STEP_IMAGES[i].mobileSize}
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
