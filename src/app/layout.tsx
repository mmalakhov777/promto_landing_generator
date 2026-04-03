import type { Metadata } from 'next';

import { onest } from './fonts';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';
import { FAQ_ITEMS } from '@/lib/constants';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export const metadata: Metadata = {
  metadataBase: new URL('https://promto.ai'),
  title: {
    default: 'Промто — создание сайтов, сервисов и ботов с помощью ИИ',
    template: '%s | Промто',
  },
  description:
    'Начните с небольшого лендинга и развивайте его до крупного сервиса. Промто — ИИ-платформа, которая превращает идею в готовый сайт, сервис или бот. Без знаний кода — только ваш запрос и готовый результат.',
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
    title: 'Промто — от небольшого проекта до крупного сервиса с помощью ИИ',
    description:
      'Начните с простого лендинга и масштабируйте до полноценного продукта. Промто создаёт структуру, дизайн, тексты и код — вам остаётся только описать идею.',
    // TODO: добавить OG-изображение перед запуском (1200x630px)
    // images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Промто — ИИ-конструктор сайтов' }],
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Промто — от небольшого проекта до крупного сервиса с помощью ИИ',
    description:
      'Начните с простого лендинга и масштабируйте до полноценного продукта. Промто создаёт структуру, дизайн, тексты и код — вам остаётся только описать идею.',
    // TODO: добавить Twitter Card изображение перед запуском
    images: [],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#FAFAFA',
  },
  alternates: {
    canonical: 'https://promto.ai',
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://promto.ai/#organization',
  name: 'Промто',
  url: 'https://promto.ai',
  logo: {
    '@type': 'ImageObject',
    url: 'https://promto.ai/logo-desktop.svg',
    width: 121,
    height: 32,
  },
  description:
    'ИИ-платформа для создания сайтов, сервисов и чат-ботов по текстовому описанию.',
};

const jsonLdSoftwareApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': 'https://promto.ai/#software',
  name: 'Промто',
  url: 'https://promto.ai',
  description:
    'ИИ-сервис для создания сайтов, сервисов и чат-ботов по текстовому описанию',
  applicationCategory: 'WebApplication',
  operatingSystem: 'All',
  offers: [
    {
      '@type': 'Offer',
      name: 'Мини',
      price: '2000',
      priceCurrency: 'RUB',
      url: 'https://promto.ai/#pricing',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
    },
    {
      '@type': 'Offer',
      name: 'Про',
      price: '4000',
      priceCurrency: 'RUB',
      url: 'https://promto.ai/#pricing',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
    },
    {
      '@type': 'Offer',
      name: 'Про Макс',
      price: '10000',
      priceCurrency: 'RUB',
      url: 'https://promto.ai/#pricing',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
    },
  ],
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://promto.ai/#faq',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://promto.ai/#website',
  name: 'Промто',
  url: 'https://promto.ai',
  publisher: { '@id': 'https://promto.ai/#organization' },
  inLanguage: 'ru',
};

const themeScript = `(function(){
  // URL normalization: redirect multiple slashes and /index.html
  try{
    var p=location.pathname;
    var c=p.replace(/\\/{2,}/g,'/');
    if(c.length>1)c=c.replace(/\\/$/,'');
    if(c==='/index.html')c='/';
    if(c!==p){location.replace(c+location.search);return;}
  }catch(e){}
  try{
    var t=localStorage.getItem('promto-theme');
    if(t==='dark'||t==='light'){
      document.documentElement.setAttribute('data-theme',t);
    }else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){
      document.documentElement.setAttribute('data-theme','dark');
    }
  }catch(e){}

  document.addEventListener('DOMContentLoaded', function() {
    // ── Theme toggle ──
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-theme-toggle]');
      if (!btn) return;
      var html = document.documentElement;
      var isDark = html.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('promto-theme', next); } catch(ex) {}
      document.querySelectorAll('[data-theme-toggle]').forEach(function(b) {
        var sun = b.querySelector('[data-icon="sun"]');
        var moon = b.querySelector('[data-icon="moon"]');
        if (sun) sun.style.display = next === 'dark' ? 'block' : 'none';
        if (moon) moon.style.display = next === 'dark' ? 'none' : 'block';
        b.setAttribute('aria-label', next === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
      });
    });
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b) {
      var sun = b.querySelector('[data-icon="sun"]');
      var moon = b.querySelector('[data-icon="moon"]');
      if (sun) sun.style.display = isDark ? 'block' : 'none';
      if (moon) moon.style.display = isDark ? 'none' : 'block';
    });

    // ── Rotating title + placeholder animation (pure DOM, no React) ──
    var WORDS = ['Сайт','API','Бот','Сервис','Приложение','Бэкенд'];
    var PLACEHOLDERS = [
      'Попроси Промто создать сайт на React...',
      'Попроси Промто написать REST API для магазина...',
      'Попроси Промто создать Telegram-бота...',
      'Попроси Промто разработать микросервис...',
      'Попроси Промто написать мобильное приложение...',
      'Попроси Промто настроить бэкенд с авторизацией...'
    ];
    var wordIdx = 0;
    var titleEls = document.querySelectorAll('[data-rotating-title]');
    var wordEls = document.querySelectorAll('[data-rotating-word]');
    var phEls = document.querySelectorAll('[data-rotating-placeholder]');

    if (titleEls.length > 0) {
      setInterval(function() {
        // Blur out
        titleEls.forEach(function(el) { el.style.filter = 'blur(10px)'; el.style.opacity = '0'; });
        phEls.forEach(function(el) { el.style.filter = 'blur(10px)'; el.style.opacity = '0'; });
        setTimeout(function() {
          wordIdx = (wordIdx + 1) % WORDS.length;
          wordEls.forEach(function(el) { el.textContent = WORDS[wordIdx]; });
          phEls.forEach(function(el) { el.textContent = PLACEHOLDERS[wordIdx]; });
          // Blur in
          titleEls.forEach(function(el) { el.style.filter = 'blur(0px)'; el.style.opacity = '1'; });
          phEls.forEach(function(el) { el.style.filter = 'blur(0px)'; el.style.opacity = '1'; });
        }, 600);
      }, 4000);
    }
  });
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${onest.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Search engine verification */}
        <meta name="google-site-verification" content="googleed94bd73087c7011" />
        <meta name="yandex-verification" content="cff33828be7a82fd" />
        {/* Preconnect hints */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://app.promto.ai" />
        {/* Theme script — must run before paint to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Yandex.Metrika — deferred to not block rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load',function(){(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=108237139','ym');ym(108237139,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true})});`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/108237139" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </head>
      <body className="min-h-dvh flex flex-col bg-bg-page text-text-primary transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApp).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdFaq).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite).replace(/</g, '\\u003c'),
          }}
        />
        <ThemeProvider>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
