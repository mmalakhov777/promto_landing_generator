import type { HowItWorksStep } from "@/types/public";

/* ─── Rich CSS-based illustrations for each step ─── */

/** Step 1: Chat / prompt input mockup */
function IllustrationPrompt() {
  return (
    <>
      <div className="absolute top-4 right-8 h-20 w-20 rounded-full bg-accent/20 blur-[25px]" />
      <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full bg-primary/20 blur-[20px]" />

      <div className="relative w-[80%] max-w-[260px]">
        {/* Incoming bubble */}
        <div className="mb-3 mr-auto w-[70%] rounded-2xl rounded-bl-[4px] bg-white px-4 py-3 shadow-md">
          <div className="h-2 w-[85%] rounded-full bg-gray-200" />
          <div className="mt-1.5 h-2 w-[50%] rounded-full bg-gray-200" />
        </div>
        {/* User bubble */}
        <div className="mb-3 ml-auto w-[75%] rounded-2xl rounded-br-[4px] bg-primary/8 px-4 py-3 shadow-sm">
          <div className="h-2 w-[90%] rounded-full bg-primary/15" />
          <div className="mt-1.5 h-2 w-[60%] rounded-full bg-primary/15" />
        </div>
        {/* Input bar */}
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl ring-1 ring-gray-100">
          <div className="h-2 w-[55%] rounded-full bg-gray-200" />
          <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Floating sparkle dots */}
      <div className="absolute top-[18%] left-[12%] h-2.5 w-2.5 rounded-full bg-accent shadow-md shadow-accent/40" />
      <div className="absolute bottom-[22%] right-[10%] h-2 w-2 rounded-full bg-primary shadow-md shadow-primary/40" />
    </>
  );
}

/** Step 2: AI processing — concentric rings with orbiting nodes */
function IllustrationProcessing() {
  return (
    <>
      <div className="absolute top-[12%] right-[12%] h-24 w-24 rounded-full bg-accent/15 blur-[30px]" />
      <div className="absolute bottom-[12%] left-[12%] h-20 w-20 rounded-full bg-primary/15 blur-[25px]" />

      {/* Concentric rings */}
      <div className="relative">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-primary/10">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-accent/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
          </div>
        </div>
        {/* Orbiting nodes */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-accent shadow-md shadow-accent/40" />
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-md shadow-primary/40" />
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-pink shadow-md shadow-pink/40" />
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary/60 shadow-md" />
      </div>

      {/* Floating data chips */}
      <div className="absolute top-8 right-6 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <div className="h-1.5 w-10 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="absolute bottom-10 left-6 rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <div className="h-1.5 w-8 rounded-full bg-gray-200" />
        </div>
      </div>
    </>
  );
}

/** Step 3: Customisation — settings panel with palette, sliders, toggle */
function IllustrationCustomize() {
  return (
    <>
      <div className="absolute top-6 left-8 h-16 w-16 rounded-full bg-primary/15 blur-[20px]" />
      <div className="absolute bottom-8 right-6 h-14 w-14 rounded-full bg-accent/15 blur-[18px]" />

      {/* Settings card */}
      <div className="relative w-[80%] max-w-[240px] rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-50">
        {/* Colour palette */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary ring-2 ring-primary/30 ring-offset-1" />
          <div className="h-6 w-6 rounded-full bg-accent" />
          <div className="h-6 w-6 rounded-full bg-pink" />
          <div className="h-6 w-6 rounded-full bg-gray-800" />
          <div className="h-6 w-6 rounded-full border border-gray-200 bg-white" />
        </div>

        {/* Slider 1 */}
        <div className="mb-3.5">
          <div className="mb-1.5 h-1.5 w-10 rounded-full bg-gray-200" />
          <div className="relative h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-accent" />
            <div className="absolute top-1/2 left-[68%] -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-primary bg-white shadow-sm" />
          </div>
        </div>

        {/* Slider 2 */}
        <div className="mb-4">
          <div className="mb-1.5 h-1.5 w-14 rounded-full bg-gray-200" />
          <div className="relative h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-accent to-primary" />
            <div className="absolute top-1/2 left-[42%] -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-accent bg-white shadow-sm" />
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-16 rounded-full bg-gray-200" />
          <div className="flex h-6 w-10 items-center rounded-full bg-primary px-0.5">
            <div className="ml-auto h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>

      {/* Floating pen icon */}
      <div className="absolute top-[10%] right-[8%] flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </>
  );
}

/** Step 4: Publish — browser + phone mockup (matches Frame 719 reference) */
function IllustrationPublish() {
  return (
    <>
      <div className="absolute top-[8%] right-[8%] h-24 w-24 rounded-full bg-accent/12 blur-[30px]" />
      <div className="absolute bottom-[12%] left-[8%] h-20 w-20 rounded-full bg-primary/12 blur-[25px]" />

      {/* Browser mockup */}
      <div className="relative" style={{ perspective: "600px" }}>
        <div
          className="rounded-xl bg-white shadow-2xl ring-1 ring-gray-100"
          style={{ transform: "rotateY(-4deg)", width: 190 }}
        >
          {/* Chrome */}
          <div className="flex items-center gap-1.5 border-b border-gray-100 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-[#FF5F57]" />
            <div className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
            <div className="h-2 w-2 rounded-full bg-[#28C840]" />
            <div className="ml-2 h-2.5 flex-1 rounded-full bg-gray-50 ring-1 ring-gray-100" />
          </div>
          {/* Page */}
          <div className="p-3">
            <div className="mb-2 h-2.5 w-[55%] rounded-full bg-gray-800" />
            <div className="mb-1 h-1.5 w-[85%] rounded-full bg-gray-100" />
            <div className="mb-3 h-1.5 w-[65%] rounded-full bg-gray-100" />
            <div className="mb-2 flex gap-2">
              <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15" />
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="h-1.5 w-full rounded-full bg-gray-100" />
                <div className="h-1.5 w-[75%] rounded-full bg-gray-100" />
                <div className="h-1.5 w-[50%] rounded-full bg-gray-100" />
              </div>
            </div>
            <div className="mt-2 h-5 w-16 rounded-full bg-gradient-to-r from-accent to-primary" />
          </div>
        </div>

        {/* Phone */}
        <div
          className="absolute -right-6 -bottom-3 w-[72px] rounded-xl bg-white shadow-xl ring-1 ring-gray-100"
          style={{ transform: "rotateY(-2deg)" }}
        >
          <div className="p-2">
            <div className="mx-auto mb-1.5 h-1 w-6 rounded-full bg-gray-200" />
            <div className="mb-1 h-1.5 w-full rounded-full bg-gray-800" />
            <div className="mb-1 h-1 w-[80%] rounded-full bg-gray-100" />
            <div className="h-8 rounded-md bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="mx-auto mt-1.5 h-3 w-12 rounded-full bg-gradient-to-r from-accent to-primary" />
          </div>
        </div>
      </div>

      {/* Success badge */}
      <div className="absolute top-[12%] right-[10%] flex h-9 w-9 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/30">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Globe */}
      <div className="absolute bottom-[18%] left-[10%] flex h-8 w-8 items-center justify-center rounded-full bg-primary/8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#464EFF" strokeWidth="1.5"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="#464EFF" strokeWidth="1.5"/>
        </svg>
      </div>
    </>
  );
}

/* ─── Illustration registry ─── */
const illustrations = [
  IllustrationPrompt,
  IllustrationProcessing,
  IllustrationCustomize,
  IllustrationPublish,
];

/* Soft pastel backgrounds for each variant */
const stepBackgrounds = [
  "linear-gradient(135deg, #F0F1FF 0%, #E8FFE9 100%)",
  "linear-gradient(135deg, #E8FFE9 0%, #F0F1FF 100%)",
  "linear-gradient(135deg, #F0F1FF 0%, #FFE8F0 50%, #E8FFE9 100%)",
  "linear-gradient(135deg, #E8FFE9 0%, #F0F1FF 100%)",
];

/* ─── Section component ─── */

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
            const Illustration = illustrations[idx % illustrations.length];
            const bg = stepBackgrounds[idx % stepBackgrounds.length];
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

                {/* Right — illustration (desktop) */}
                <div className="relative hidden w-[45%] shrink-0 md:block">
                  <div
                    className="absolute inset-3 flex items-center justify-center overflow-hidden rounded-[32px]"
                    style={{ background: bg }}
                  >
                    <Illustration />
                  </div>
                </div>

                {/* Mobile illustration */}
                <div className="mx-4 mb-4 md:hidden">
                  <div
                    className="relative flex h-44 items-center justify-center overflow-hidden rounded-[20px]"
                    style={{ background: bg }}
                  >
                    <Illustration />
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
