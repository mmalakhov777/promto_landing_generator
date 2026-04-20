import type { Locale } from "@/types/public";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale: Locale;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <a href={`/${locale}/`} className="hover:text-primary transition-colors">
            {locale === "ru" ? "Главная" : "Home"}
          </a>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span className="text-border">/</span>
            {item.href && idx < items.length - 1 ? (
              <a href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-text">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
