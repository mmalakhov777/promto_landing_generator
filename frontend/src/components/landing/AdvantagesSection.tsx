import type { AdvantageItem } from "@/types/public";

const iconMap: Record<string, string> = {
  star: "⭐",
  rocket: "🚀",
  shield: "🛡️",
  zap: "⚡",
  heart: "❤��",
  check: "✅",
  globe: "🌍",
  clock: "⏰",
  palette: "🎨",
  code: "💻",
};

interface AdvantagesSectionProps {
  title: string;
  items: AdvantageItem[];
}

export function AdvantagesSection({ title, items }: AdvantagesSectionProps) {
  if (!items.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-text">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{iconMap[item.icon] || "✨"}</div>
              <h3 className="mb-2 text-lg font-semibold text-text">{item.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
