import Image from "next/image";
import type { ExampleItem } from "@/types/public";

interface ExamplesSectionProps {
  title: string;
  items: ExampleItem[];
}

export function ExamplesSection({ title, items }: ExamplesSectionProps) {
  if (!items.length) return null;

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-[38px] font-medium leading-[1.12] text-text">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-[32px] bg-surface shadow-card shadow-card-hover transition-shadow"
            >
              {item.image_url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium text-text">{item.title}</h3>
                {item.description && (
                  <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="mt-3 inline-block text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                  >
                    ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
