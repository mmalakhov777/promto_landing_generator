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

/* Gradient backgrounds from Figma design system */
const gradients = [
  "linear-gradient(196deg, #FFD478 0%, #FF9854 91%)",
  "linear-gradient(193deg, #5EFF6E 0%, #289F35 100%)",
  "linear-gradient(196deg, #575EFF 0%, #E478FF 91%)",
  "linear-gradient(196deg, #3F50EF 0%, #223DDB 100%)",
];

interface AdvantagesSectionProps {
  title: string;
  items: AdvantageItem[];
}

export function AdvantagesSection({ title, items }: AdvantagesSectionProps) {
  if (!items.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className={`grid gap-6 sm:grid-cols-2 ${items.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[32px] bg-surface p-8 shadow-card shadow-card-hover transition-all"
            >
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] text-white"
                style={{ background: gradients[idx % gradients.length] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconSvgMap[item.icon] || "/icons/plus-square.svg"}
                  alt=""
                  width={22}
                  height={22}
                  className="brightness-0 invert"
                />
              </div>
              <h3 className="mb-2 text-lg font-medium text-text">{item.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
