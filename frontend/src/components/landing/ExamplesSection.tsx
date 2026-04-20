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
        <h2 className="mb-12 text-center text-3xl font-bold text-text">{title}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md"
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
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold text-text">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-text-muted">{item.description}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-hover transition-colors"
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
