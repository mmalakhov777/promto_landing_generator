import { GradientText } from '@/components/ui/gradient-text';
import { AiMagic } from '@/components/icons/ai-magic';
import { ChatInput } from '@/components/ui/chat-input';
import { RotatingWord } from '@/components/ui/rotating-word';

export function Hero() {
  return (
    <section
      id="hero"
      className="pt-10 lg:pt-[120px] pb-[72px] lg:pb-[100px]"
      aria-label="Главный экран"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        {/* ── Title + Subtitle block ── */}
        <div className="w-full max-w-[327px] lg:max-w-[1200px] flex flex-col items-center gap-6 lg:gap-10">
          {/* Headline */}
          <h1 className="w-full max-w-[299px] lg:max-w-[1200px] text-[28px] lg:text-[48px] font-medium leading-[1.24] lg:leading-[1.12]">
            <RotatingWord
              gradient="var(--theme-gradient-text)"
            />
          </h1>

          {/* Subheadline — 14px mobile / 16px desktop */}
          <p className="text-sm lg:text-base text-text-secondary leading-[1.4] max-w-[327px] lg:max-w-[580px]">
            Промто превращает вашу идею в&nbsp;действующий сайт, сервис или бот: придумывает структуру, создает дизайн, пишет тексты и&nbsp;собирает в&nbsp;готовый продукт. Без знаний кода и&nbsp;сложных конструкторов&nbsp;&mdash; только ваш запрос и&nbsp;готовый результат.
          </p>
        </div>

        {/* ── Chat input ── */}
        <div className="mt-10 lg:mt-[50px] w-full max-w-[351px] lg:max-w-[700px]">
          <ChatInput />
        </div>

        {/* ── CTA buttons + Disclaimer ── */}
        <div className="mt-10 lg:mt-[50px] w-full max-w-[327px] lg:max-w-[442px] flex flex-col items-center gap-4 lg:gap-5">
          {/* Buttons: column on mobile, row on desktop */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3">
            {/* Outline "Попробовать бесплатно" — exact Figma SVG gradient border */}
            <a
              href="https://app.promto.ai"
              className="btn-cta-outline relative w-full lg:w-[247px] h-[52px] inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium transition-all duration-200 hover:opacity-75 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 animate-cta-glow"
            >
              {/* Animated gradient border — hidden in dark theme via CSS */}
              <div
                className="gradient-border-mask absolute inset-0 rounded-[60px] animate-gradient-shift-slow"
                style={{
                  padding: '1.5px',
                  background: 'var(--theme-gradient-border)',
                  backgroundSize: '200% 200%',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
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

        </div>
      </div>
    </section>
  );
}
