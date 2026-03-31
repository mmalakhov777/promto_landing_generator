import type { Metadata } from 'next';
import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { BackgroundBlobs } from '@/components/ui/background-blobs';

export const metadata: Metadata = {
  title: 'Карта сайта',
  description: 'ИИ-платформа Промто: создание сайтов, сервисов, чат‑ботов, трекеров и других продуктов по вашим запросам. Готовый результат через пару минут. Карта сайта.',
  alternates: { canonical: 'https://promto.ai/karta-sajta' },
};

const SITEMAP_SECTIONS = [
  {
    title: 'Главная',
    links: [
      { label: 'Главная страница', href: '/' },
    ],
  },
  {
    title: 'Продукт',
    links: [
      { label: 'Возможности', href: '/#features' },
      { label: 'Как это работает', href: '/#how-it-works' },
      { label: 'Тарифы', href: '/#pricing' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '/#about' },
      { label: 'Кейсы', href: '/#use-cases' },
    ],
  },
  {
    title: 'Прочее',
    links: [
      { label: 'Карта сайта', href: '/karta-sajta' },
    ],
  },
];

export default function KartaSajtaPage() {
  return (
    <div className="relative overflow-x-clip min-h-dvh flex flex-col">
      <BackgroundBlobs />
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="relative z-10 flex-1 px-6 lg:px-[60px] xl:px-[120px] max-w-[1440px] mx-auto w-full py-16 lg:py-24">
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><a href="/" className="hover:text-brand-blue transition-colors">Главная</a></li>
            <li aria-hidden="true">/</li>
            <li className="text-text-primary" aria-current="page">Карта сайта</li>
          </ol>
        </nav>

        <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-12">
          Карта сайта
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SITEMAP_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-base font-semibold text-text-primary mb-4 border-b border-[var(--theme-border-light)] pb-2">
                {section.title}
              </p>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-brand-blue transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
