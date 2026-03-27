import { SectionContainer } from '@/components/ui/section-container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { IconBox } from '@/components/ui/icon-box';
import { ChartLine } from '@/components/icons/chart-line';
import { Globe } from '@/components/icons/globe';
import { ScaleUp } from '@/components/icons/scale-up';
import { CodeExport } from '@/components/icons/code-export';

export function WhatIsPromto() {
  return (
    <section
      id="features"
      className="py-[72px] lg:py-[100px]"
      aria-labelledby="what-heading"
    >
      <SectionContainer>
        <div className="flex flex-col xl:flex-row gap-[60px] xl:gap-[80px] 2xl:gap-[128px] items-start xl:items-center">
          {/* Left: text */}
          <div className="flex-shrink-0 xl:w-[400px] 2xl:w-[478px] text-center xl:text-left">
            <SectionHeading id="what-heading" align="center" className="xl:text-left">
              Что такое Промто?
            </SectionHeading>

            {/* Mobile body text */}
            <p className="mt-6 text-sm text-text-secondary leading-[1.4] xl:hidden">
              Это ИИ&#x2011;сервис, который создаёт сайты, сервисы, чат&#x2011;боты, трекеры и другие продукты по вашим запросам. Теперь реализовать цифровое решение — это просто объяснить сервису в диалоге, что вам нужно, как если бы вы давали ТЗ разработчику. Но вместо недель ожидания вы получаете готовый результат через пару минут.
              <br /><br />
              И нет смысла себя ограничивать: вы действительно можете реализовать любую идею, даже если никогда этого не делали.
            </p>

            {/* Desktop body text */}
            <p className="mt-6 text-sm text-text-secondary leading-[1.3] hidden xl:block">
              Это ИИ&#x2011;сервис, который создаёт сайты, сервисы, чат&#x2011;боты, трекеры и другие продукты по вашим запросам. Теперь реализовать цифровое решение — это просто объяснить сервису в диалоге, что вам нужно, как если бы вы давали ТЗ разработчику. Но вместо недель ожидания вы получаете готовый результат через пару минут.
              <br /><br />
              И нет смысла себя ограничивать: вы действительно можете реализовать любую идею, даже если никогда этого не делали.
            </p>
          </div>

          {/* Right: feature cards — 2×2 grid */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Card 1: Без лимитов по токенам */}
            <Card className="p-6 xl:p-8 flex flex-col gap-6 xl:gap-8">
              <IconBox icon={<ChartLine size={20} />} color="green" size="sm" />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] sm:hidden">
                  Без лимитов по токенам
                </h3>
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] hidden sm:block">
                  Без лимитов по&nbsp;токенам
                </h3>
                <p className="text-xs font-normal text-text-secondary leading-[1.3] sm:hidden">
                  Никаких ограничений по объёму
                  <br />и количеству выполненных задач
                </p>
                <p className="text-sm text-text-secondary leading-[1.3] hidden sm:block">
                  Никаких ограничений по&nbsp;объёму и&nbsp;количеству выполненных задач
                </p>
              </div>
            </Card>

            {/* Card 2: Публикация в один клик */}
            <Card className="p-6 xl:p-8 flex flex-col gap-6 xl:gap-8">
              <IconBox icon={<Globe size={20} />} color="blue" size="sm" />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] sm:hidden">
                  Публикация в один клик
                </h3>
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] hidden sm:block">
                  Публикация в&nbsp;один клик
                </h3>
                <p className="text-xs font-normal text-text-secondary leading-[1.3] sm:hidden">
                  Готовый продукт сразу доступен
                  <br />онлайн — просто нажмите «Опубликовать»
                </p>
                <p className="text-sm text-text-secondary leading-[1.3] hidden sm:block">
                  Готовый продукт сразу доступен онлайн — просто нажмите «Опубликовать»
                </p>
              </div>
            </Card>

            {/* Card 3: Нет ограничений по масштабированию */}
            <Card className="p-6 xl:p-8 flex flex-col gap-6 xl:gap-8">
              <IconBox icon={<ScaleUp size={20} />} color="purple" size="sm" />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] sm:hidden">
                  Нет ограничений по масштабированию
                </h3>
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] hidden sm:block">
                  Нет ограничений по&nbsp;масштабированию
                </h3>
                <p className="text-xs font-normal text-text-secondary leading-[1.3] sm:hidden">
                  Создавайте проекты любой сложности
                  <br />— от лендинга до полноценного сервиса
                </p>
                <p className="text-sm text-text-secondary leading-[1.3] hidden sm:block">
                  Создавайте проекты любой сложности — от&nbsp;лендинга до&nbsp;полноценного сервиса
                </p>
              </div>
            </Card>

            {/* Card 4: Нет привязки к сервису */}
            <Card className="p-6 xl:p-8 flex flex-col gap-6 xl:gap-8">
              <IconBox icon={<CodeExport size={20} />} color="orange" size="sm" />
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] sm:hidden">
                  Нет привязки к сервису
                </h3>
                <h3 className="text-xl font-medium text-text-primary leading-[1.24] hidden sm:block">
                  Нет привязки к&nbsp;сервису
                </h3>
                <p className="text-xs font-normal text-text-secondary leading-[1.3] sm:hidden">
                  Экспортируйте код и работайте
                  <br />с ним где угодно
                </p>
                <p className="text-sm text-text-secondary leading-[1.3] hidden sm:block">
                  Экспортируйте код и&nbsp;работайте с&nbsp;ним где угодно
                </p>
              </div>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
