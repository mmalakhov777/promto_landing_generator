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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg text-text-muted md:text-xl">{subtitle}</p>
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
