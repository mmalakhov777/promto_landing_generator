import type { Metadata } from 'next';

import { onest } from './fonts';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  metadataBase: new URL('https://promto.ai'),
  title: {
    default: 'Промто — Создайте сайт за пару минут с помощью ИИ',
    template: '%s | Промто',
  },
  description:
    'Промто превращает вашу идею в действующий сайт, сервис или бот: придумывает структуру, создаёт дизайн, пишет тексты и собирает в готовый продукт. Без знаний кода — только ваш запрос.',
  authors: [{ name: 'Promto' }],
  creator: 'Promto',
  publisher: 'Promto',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://promto.ai',
    siteName: 'Промто',
    title: 'Промто — Создайте сайт за пару минут с помощью ИИ',
    description:
      'ИИ-сервис, который создаёт сайты, сервисы и чат-боты по вашим запросам. Без знаний кода — от идеи до готового продукта за 5 минут.',
    // TODO: добавить OG-изображение перед запуском (1200x630px)
    // images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Промто — ИИ-конструктор сайтов' }],
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Промто — Создайте сайт за пару минут с помощью ИИ',
    description:
      'ИИ-сервис, который создаёт сайты, сервисы и чат-боты по вашим запросам. Без знаний кода — от идеи до готового продукта за 5 минут.',
    // TODO: добавить Twitter Card изображение перед запуском
    images: [],
  },
  alternates: {
    canonical: 'https://promto.ai',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Промто',
  description:
    'ИИ-сервис для создания сайтов, сервисов и чат-ботов по текстовому описанию',
  applicationCategory: 'WebApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '2000',
    highPrice: '10000',
    priceCurrency: 'RUB',
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('promto-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${onest.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-bg-page text-text-primary transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
