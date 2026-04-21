import type { HowItWorksStep } from "@/types/public";

interface HowItWorksSectionProps {
  title: string;
  steps: HowItWorksStep[];
}

export function HowItWorksSection({ title, steps }: HowItWorksSectionProps) {
  if (!steps.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-16 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.step} className="card-gradient-border p-8">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium text-gradient">
                {step.step}
              </div>
              <h3 className="mb-2 text-lg font-medium text-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
