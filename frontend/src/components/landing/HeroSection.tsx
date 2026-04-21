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
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Decorative gradient orbs from Figma */}
      <div className="hero-orb -top-20 -left-20 h-80 w-80" style={{ background: 'linear-gradient(200deg, #464EFF, #5EFF6E)' }} />
      <div className="hero-orb -bottom-20 -right-20 h-96 w-96" style={{ background: 'linear-gradient(200deg, #5EFF6E, #464EFF)' }} />
      <div className="hero-orb top-1/3 left-1/4 h-40 w-40" style={{ background: '#464EFF' }} />
      <div className="hero-orb top-1/2 right-1/4 h-32 w-32" style={{ background: '#5EFF6E' }} />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-medium leading-[1.12] text-text md:text-5xl lg:text-[48px]">
          {h1}
        </h1>
        {subtitle && (
          <p className="mt-6 text-base leading-relaxed text-text-muted md:text-lg">{subtitle}</p>
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
      </div>
    </section>
  );
}
