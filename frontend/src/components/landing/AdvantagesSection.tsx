import type { AdvantageItem } from "@/types/public";

const iconMap: Record<string, string> = {
  star: "⭐",
  rocket: "🚀",
  shield: "🛡️",
  zap: "⚡",
  heart: "❤️",
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
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[32px] bg-surface p-8 shadow-card shadow-card-hover transition-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] text-2xl" style={{
                background: [
                  'linear-gradient(196deg, #FFD478 0%, #FF9854 91%)',
                  'linear-gradient(193deg, #5EFF6E 0%, #289F35 100%)',
                  'linear-gradient(196deg, #575EFF 0%, #E478FF 91%)',
                  'linear-gradient(196deg, #3F50EF 0%, #223DDB 100%)',
                ][idx % 4]
              }}>
                <span className="text-lg">{iconMap[item.icon] || "✨"}</span>
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
