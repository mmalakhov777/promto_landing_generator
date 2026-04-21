import type { AdvantageItem } from "@/types/public";

/* Map backend icon keys to SVG files from design system */
const iconSvgMap: Record<string, string> = {
  star: "/icons/like.svg",
  rocket: "/icons/arrow-up.svg",
  shield: "/icons/lock.svg",
  zap: "/icons/income.svg",
  heart: "/icons/like.svg",
  check: "/icons/plus-square.svg",
  globe: "/icons/search.svg",
  clock: "/icons/play.svg",
  palette: "/icons/brush.svg",
  code: "/icons/code.svg",
};

/* Icon badge backgrounds from Figma — cycling colors */
const badgeColors = [
  "#FF4D6B",
  "linear-gradient(193deg, #5EFF6E 0%, #289F35 100%)",
  "linear-gradient(196deg, #3F50EF 0%, #223DDB 100%)",
  "linear-gradient(196deg, #575EFF 0%, #E478FF 91%)",
];

interface AdvantagesSectionProps {
  title: string;
  items: AdvantageItem[];
}

function AdvantageCard({ item, idx }: { item: AdvantageItem; idx: number }) {
  return (
    <div className="rounded-[32px] bg-surface p-8 shadow-card">
      {/* Icon badge — 40x40, radius 10px */}
      <div
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-[10px]"
        style={{ background: badgeColors[idx % badgeColors.length] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSvgMap[item.icon] || "/icons/plus-square.svg"}
          alt=""
          width={24}
          height={24}
          className="brightness-0 invert"
        />
      </div>
      <h3 className="mb-3 text-[20px] font-medium leading-[1.24] text-text">{item.title}</h3>
      <p className="text-sm leading-[1.3] text-text-muted">{item.description}</p>
    </div>
  );
}

export function AdvantagesSection({ title, items }: AdvantagesSectionProps) {
  if (!items.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1200px] px-4">
        {/* Two-column layout: title left, cards right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
          {/* Left — section title + subtitle */}
          <div className="shrink-0 lg:w-[400px] lg:sticky lg:top-32">
            <h2 className="text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-text-muted">
              Промто — это ИИ‑сервис, который создаёт сайты, сервисы, чат-боты, трекеры и другие продукты по вашим запросам. Теперь реализовать цифровое решение — это просто объяснить сервису в диалоге, что вам нужно, как если бы вы давали ТЗ разработчику. Но вместо недель ожидания вы получаете готовый результат через пару минут.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              И нет смысла себя ограничивать: вы действительно можете реализовать любую идею, даже если никогда этого не делали.
            </p>
          </div>

          {/* Right — cards */}
          <div className="flex-1">
            {items.length === 3 ? (
              /* Figma layout: 2 cards on top + 1 wide on bottom */
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AdvantageCard item={items[0]} idx={0} />
                  <AdvantageCard item={items[1]} idx={1} />
                </div>
                <AdvantageCard item={items[2]} idx={2} />
              </div>
            ) : items.length === 2 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, idx) => (
                  <AdvantageCard key={idx} item={item} idx={idx} />
                ))}
              </div>
            ) : items.length === 4 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, idx) => (
                  <AdvantageCard key={idx} item={item} idx={idx} />
                ))}
              </div>
            ) : (
              /* 5+ items: 2-column grid */
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, idx) => (
                  <AdvantageCard key={idx} item={item} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
