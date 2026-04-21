import type { HowItWorksStep } from "@/types/public";

/* Visual illustrations for each step — gradient-themed abstract shapes */
const stepVisuals = [
  { gradient: "linear-gradient(195deg, #464EFF 0%, #5EFF6E 86%)", icon: "/icons/new-chat.svg" },
  { gradient: "linear-gradient(195deg, #5EFF6E 0%, #464EFF 86%)", icon: "/icons/people.svg" },
  { gradient: "linear-gradient(195deg, #E478FF 0%, #464EFF 86%)", icon: "/icons/settings.svg" },
  { gradient: "linear-gradient(195deg, #464EFF 0%, #5EFF6E 86%)", icon: "/icons/income.svg" },
];

interface HowItWorksSectionProps {
  title: string;
  steps: HowItWorksStep[];
  id?: string;
}

export function HowItWorksSection({ title, steps, id }: HowItWorksSectionProps) {
  if (!steps.length) return null;

  return (
    <section id={id} className="py-section">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="mb-20 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="flex flex-col gap-3">
          {steps.map((step, idx) => {
            const visual = stepVisuals[idx % stepVisuals.length];
            return (
              <div
                key={step.step}
                className="card-gradient-border flex min-h-[280px] flex-col overflow-hidden md:min-h-[339px] md:flex-row"
              >
                {/* Left — text content */}
                <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 p-8 md:p-[60px]">
                  <span className="text-sm text-text-muted">( {step.step} )</span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-medium leading-[1.2] text-text">{step.title}</h3>
                    <p className="max-w-[397px] text-sm leading-[1.3] text-text-muted">{step.description}</p>
                  </div>
                </div>

                {/* Right — visual illustration area */}
                <div className="relative hidden w-[45%] shrink-0 md:block">
                  <div
                    className="absolute inset-3 overflow-hidden rounded-[32px]"
                    style={{ background: visual.gradient }}
                  >
                    {/* Abstract pattern layer */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/30 blur-[40px]" />
                      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/20 blur-[30px]" />
                    </div>
                    {/* Centered icon */}
                    <div className="flex h-full items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={visual.icon}
                        alt=""
                        width={64}
                        height={64}
                        className="brightness-0 invert opacity-30"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile illustration — compact */}
                <div className="mx-4 mb-4 md:hidden">
                  <div
                    className="flex h-32 items-center justify-center overflow-hidden rounded-[20px]"
                    style={{ background: visual.gradient }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={visual.icon}
                      alt=""
                      width={48}
                      height={48}
                      className="brightness-0 invert opacity-30"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
