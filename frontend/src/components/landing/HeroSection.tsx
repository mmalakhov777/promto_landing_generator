import { PromptInput } from "./PromptInput";

interface HeroSectionProps {
  h1: string;
  subtitle: string;
  ctaText: string;
  placeholder: string;
  platformUrl: string;
  categorySlug: string;
  landingSlug: string;
  metrikaId?: string;
  captchaClientKey?: string;
  apiUrl?: string;
}

export function HeroSection({
  h1,
  subtitle,
  ctaText,
  placeholder,
  platformUrl,
  categorySlug,
  landingSlug,
  metrikaId,
  captchaClientKey,
  apiUrl,
}: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32">
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Trust badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/like.svg" alt="" width={16} height={16} style={{ filter: 'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(4800%) hue-rotate(233deg) brightness(100%) contrast(101%)' }} />
          <span className="font-medium">AI-платформа №1</span>
        </div>
        <h1 className="text-4xl font-medium leading-[1.12] text-text md:text-5xl lg:text-[56px]">
          {h1}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg leading-relaxed text-text-muted md:text-xl">{subtitle}</p>
        )}
        <div className="mt-10 flex justify-center">
          <PromptInput
            placeholder={placeholder}
            ctaText={ctaText}
            platformUrl={platformUrl}
            categorySlug={categorySlug}
            landingSlug={landingSlug}
            metrikaId={metrikaId}
            captchaClientKey={captchaClientKey}
            apiUrl={apiUrl}
          />
        </div>
        {/* Micro trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/lock.svg" alt="" width={14} height={14} className="opacity-50" />
            Безопасно
          </span>
          <span className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/play.svg" alt="" width={14} height={14} className="opacity-50" />
            Бесплатный старт
          </span>
          <span className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-up.svg" alt="" width={14} height={14} className="opacity-50" />
            Готов за 2 минуты
          </span>
        </div>
      </div>
    </section>
  );
}
