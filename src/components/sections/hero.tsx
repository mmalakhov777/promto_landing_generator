'use client';

import { AiMagic } from '@/components/icons/ai-magic';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat-input';
import { RotatingWord } from '@/components/ui/rotating-word';

export function Hero() {
  return (
    <section
      id="hero"
      className="pt-10 md:pt-[80px] lg:pt-[120px] pb-[72px] lg:pb-[100px]"
      aria-label="Главный экран"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center px-6 md:px-10 lg:px-0">
        {/* ── Title + Subtitle block ── */}
        <div className="w-full max-w-[327px] md:max-w-[600px] lg:max-w-[1200px] flex flex-col items-center gap-6 lg:gap-10">
          {/* Headline */}
          <h1 className="w-full max-w-[299px] md:max-w-[600px] lg:max-w-[1200px] text-[28px] md:text-[38px] lg:text-[48px] font-medium leading-[1.24] md:leading-[1.16] lg:leading-[1.12]">
            <RotatingWord
              gradient="var(--theme-gradient-text)"
            />
          </h1>

          {/* Subheadline — 14px mobile / 16px desktop */}
          <p className="text-sm md:text-base lg:text-base text-text-secondary leading-[1.4] max-w-[327px] md:max-w-[520px] lg:max-w-[580px]">
            Промто превращает вашу идею в&nbsp;действующий сайт, сервис или бот: придумывает структуру, создает дизайн, пишет тексты и&nbsp;собирает в&nbsp;готовый продукт. Без знаний кода и&nbsp;сложных конструкторов&nbsp;&mdash; только ваш запрос и&nbsp;готовый результат.
          </p>
        </div>

        {/* ── Chat input ── */}
        <div className="mt-10 lg:mt-[50px] w-full max-w-[351px] md:max-w-[600px] lg:max-w-[700px]">
          <ChatInput />
        </div>

        {/* ── CTA buttons + Disclaimer ── */}
        <div className="mt-10 lg:mt-[50px] w-full max-w-[327px] md:max-w-[442px] lg:max-w-[442px] flex flex-col items-center gap-4 lg:gap-5">
          {/* Buttons: column on mobile, row on desktop */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3">
            <Button variant="outline" size="md" icon={<AiMagic size={18} color="gradient" />} href="https://app.promto.ai" className="w-full md:w-auto justify-center">
              Попробовать бесплатно
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
