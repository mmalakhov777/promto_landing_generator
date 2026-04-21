import type { HowItWorksStep } from "@/types/public";

/* Icons that map well to typical how-it-works steps */
const stepIcons = [
  "/icons/search.svg",
  "/icons/new-chat.svg",
  "/icons/settings.svg",
  "/icons/income.svg",
];

/* Gradient backgrounds matching the design system */
const stepGradients = [
  "linear-gradient(196deg, #575EFF 0%, #E478FF 91%)",
  "linear-gradient(193deg, #5EFF6E 0%, #289F35 100%)",
  "linear-gradient(196deg, #FFD478 0%, #FF9854 91%)",
  "linear-gradient(196deg, #3F50EF 0%, #223DDB 100%)",
];

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
          {steps.map((step, idx) => (
            <div key={step.step} className="card-gradient-border relative p-8">
              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div className="absolute top-11 -right-3 hidden h-0.5 w-6 bg-gradient-to-r from-primary/40 to-transparent lg:block" />
              )}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px]"
                style={{ background: stepGradients[idx % stepGradients.length] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stepIcons[idx % stepIcons.length]}
                  alt=""
                  width={22}
                  height={22}
                  className="brightness-0 invert"
                />
              </div>
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-primary">
                {String(step.step).padStart(2, "0")}
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
