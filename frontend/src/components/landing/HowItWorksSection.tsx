import type { HowItWorksStep } from "@/types/public";

interface HowItWorksSectionProps {
  title: string;
  steps: HowItWorksStep[];
}

export function HowItWorksSection({ title, steps }: HowItWorksSectionProps) {
  if (!steps.length) return null;

  return (
    <section className="bg-surface py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-text">{title}</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {step.step}
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-text">{step.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
