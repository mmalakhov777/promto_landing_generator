import { SectionContainer } from '@/components/ui/section-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from '@/components/icons/arrow-up-right';

/* ── Card data ────────────────────────────────────────────────── */

interface ServiceCard {
  mobileTitle: React.ReactNode;
  desktopTitle: React.ReactNode;
  desc: string;
  btnLabel: string;
}

const CARDS: ServiceCard[] = [
  {
    mobileTitle: <>Лендинги, многостраничные сайты<br />и посадочные страницы</>,
    desktopTitle: <>Лендинги, многостраничные сайты и посадочные страницы</>,
    desc: 'Продвижение услуг или товаров, блог, онлайн\u2011курсы и другие задачи',
    btnLabel: 'Сделать сайт',
  },
  {
    mobileTitle: <>Чат&#x2011;боты для<br />социальных сетей</>,
    desktopTitle: <>Чат&#x2011;боты для<br />социальных сетей</>,
    desc: 'Запись на бьюти\u2011процедуры, консультации, поддержка клиентов или личные задачи',
    btnLabel: 'Сделать бот',
  },
  {
    mobileTitle: <>Внутренние бизнес&#x2011;сервисы</>,
    desktopTitle: <>Внутренние бизнес&#x2011;сервисы</>,
    desc: 'Автоматизация рабочих процессов: графики дежурств, учёт задач, аналитика, отчётность',
    btnLabel: 'Сделать сервис',
  },
  {
    mobileTitle: <>Персональные инструменты</>,
    desktopTitle: <>Персональные инструменты</>,
    desc: 'Трекеры привычек, спортивные дневники, напоминалки, планировщики',
    btnLabel: 'Сделать трекер',
  },
  {
    mobileTitle: <>Автоматизации<br />для бизнеса</>,
    desktopTitle: <>Автоматизации<br />для бизнеса</>,
    desc: 'Сбор новостей и уведомлений в мессенджер, автоматическое формирование отчётов, рассылка оповещений',
    btnLabel: 'Автоматизировать',
  },
];

export function WhatCanDo() {
  return (
    <section
      id="use-cases"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="usecases-heading"
    >
      <SectionContainer>
        {/* Mobile heading with line break */}
        <SectionHeading id="usecases-heading" align="center" className="mb-[60px] lg:mb-20 lg:hidden">
          Что можно сделать
          <br />в Промто?
        </SectionHeading>

        {/* Desktop heading — single line */}
        <SectionHeading align="center" className="mb-20 hidden lg:block" aria-hidden="true">
          Что можно сделать в Промто?
        </SectionHeading>

        {/* Desktop: horizontal columns with vertical dividers */}
        <div className="hidden lg:flex items-stretch gap-[30px]">
          {CARDS.map((card, i) => (
            <div key={card.btnLabel} className="contents">
              <article className="flex flex-col justify-between flex-1 min-w-0 gap-8">
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-medium text-text-primary leading-[1.24] hyphens-auto">{card.desktopTitle}</h3>
                  <p className="text-sm font-normal text-text-secondary leading-[1.3]">{card.desc}</p>
                </div>
                <Button
                  variant="action"
                  size="sm"
                  href="https://app.promto.ai"
                  icon={<ArrowUpRight size={18} />}
                >
                  {card.btnLabel}
                </Button>
              </article>
              {i < CARDS.length - 1 && (
                <div className="flex-shrink-0 w-[1.25px] self-stretch bg-border-light" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: stacked rows with horizontal dividers */}
        <div className="flex flex-col gap-8 lg:hidden">
          {CARDS.map((card, i) => (
            <div key={card.btnLabel}>
              <article className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-medium text-text-primary leading-[1.24]">{card.mobileTitle}</h3>
                  <p className="text-xs font-normal text-text-secondary leading-[1.4]">{card.desc}</p>
                </div>
                <Button
                  variant="action"
                  size="sm"
                  href="https://app.promto.ai"
                  icon={<ArrowUpRight size={18} />}
                >
                  {card.btnLabel}
                </Button>
              </article>
              {i < CARDS.length - 1 && (
                <div className="h-[1.25px] bg-border-light mt-8" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
