import Image from 'next/image';
import { ADVANTAGES, type Advantage } from '@/lib/constants';
import { SectionContainer } from '@/components/ui/section-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { Monitor } from '@/components/icons/monitor';
import { AiMagic } from '@/components/icons/ai-magic';

/* Figma-exported SVG icons (include gradient background + paths) */
const ICON_MAP: Record<Advantage['iconColor'], string> = {
  orange: '/images/advantages/icon-clock.svg',
  green: '/images/advantages/icon-lightning.svg',
  purple: '/images/advantages/icon-plus.svg',
  blue: '/images/advantages/icon-globe.svg',
};

export function Advantages() {
  return (
    <section
      id="benefits"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="benefits-heading"
    >
      <SectionContainer>
        {/* Heading — max-w-[700px] centered to match Figma desktop wrap */}
        <div className="max-w-[700px] mx-auto mb-[60px] lg:mb-20">
          <SectionHeading id="benefits-heading" align="center">
            С Промто работать легче, чем с фрилансером
          </SectionHeading>
        </div>

        {/* Cards: horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-3 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0 pb-4 lg:pb-0 scrollbar-none">
          {ADVANTAGES.map((adv) => (
            <Card
              key={adv.title}
              className="flex-shrink-0 w-[220px] h-[245px] lg:w-auto lg:h-auto xl:h-[304px] snap-start p-6 lg:p-8 xl:p-10 flex flex-col gap-10 lg:gap-[60px]"
            >
              {/* Icon — Figma SVG with embedded gradient + paths */}
              <Image
                src={ICON_MAP[adv.iconColor]}
                alt=""
                width={50}
                height={50}
                className="w-10 h-10 lg:w-[50px] lg:h-[50px]"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl lg:text-2xl font-medium text-text-primary leading-[1.24]">
                  {adv.title}
                </h3>
                <p className="text-xs lg:text-sm font-normal text-text-secondary leading-[1.3]">
                  {adv.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA buttons — desktop only, reused from hero (same Figma spec) */}
        <div className="hidden lg:flex items-center justify-center gap-3 mt-20">
          {/* Primary "Создать сайт" — exact Figma SVG gradient */}
          <a
            href="https://app.promto.ai"
            className="btn-primary relative overflow-hidden w-[180px] h-[52px] inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <span
              className="absolute inset-0 rounded-[60px]"
              style={{ background: 'var(--theme-btn-primary-bg)' }}
              aria-hidden="true"
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              <Monitor size={18} />
              Создать сайт
            </span>
          </a>

          {/* Outline "Попробовать бесплатно" — exact Figma SVG gradient border */}
          <a
            href="https://app.promto.ai"
            className="btn-cta-outline relative w-[247px] h-[52px] inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium transition-all duration-200 hover:opacity-75 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 animate-cta-glow"
          >
            <div
              className="gradient-border-mask absolute inset-0 rounded-[60px] animate-gradient-shift-slow"
              style={{
                padding: '1.5px',
                background: 'var(--theme-gradient-border)',
                backgroundSize: '200% 200%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'exclude',
              }}
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              <span className="flex-shrink-0 text-brand-blue"><AiMagic size={18} /></span>
              <GradientText angle="var(--theme-gradient-text)">
                Попробовать бесплатно
              </GradientText>
            </span>
          </a>
        </div>
      </SectionContainer>
    </section>
  );
}
