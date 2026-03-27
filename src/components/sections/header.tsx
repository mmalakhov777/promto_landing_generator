'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300"
        style={{ backgroundColor: 'var(--theme-header-bg)' }}
      >
        {/* Desktop nav */}
        <nav
          className="hidden lg:flex max-w-[1440px] mx-auto px-[60px] xl:px-[120px] py-[20px] items-center justify-between"
          aria-label="Основная навигация"
        >
          <div className="flex items-center gap-[60px] xl:gap-[162px]">
            <Link href="/" className="flex-shrink-0" aria-label="Промто — на главную">
              <img
                src={theme === 'dark' ? '/images/footer-logo.svg' : '/logo-desktop.svg'}
                alt="Промто"
                width={121}
                height={32}
              />
            </Link>
            <ul className="flex items-center gap-[30px] xl:gap-[60px]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[14px] font-medium leading-[1.2] text-text-primary hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:text-brand-blue"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" borderWidth={1.5} href="https://app.promto.ai">Войти</Button>
          </div>
        </nav>

        {/* Mobile nav */}
        <nav
          className="flex lg:hidden items-center justify-between h-[72px] px-6"
          aria-label="Мобильная навигация"
        >
          <Link href="/" className="flex-shrink-0" aria-label="Промто — на главную">
            <img src="/logo-mobile.svg" alt="Промто" width={42} height={42} />
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" href="https://app.promto.ai">Войти</Button>

            {/* Hamburger — full Figma SVG with built-in border + gradient lines */}
            <button
              type="button"
              className="w-[42px] h-[42px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-[32px]"
              onClick={() => setMobileOpen(true)}
              aria-label="Открыть меню"
            >
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true" style={{ pointerEvents: 'none' }}>
                <rect x="0.625" y="0.625" width="40.75" height="40.75" rx="20.375" stroke="url(#hb-border)" strokeWidth="1.25" />
                <path d="M14 16H28M14 21H28M14 26H28" stroke="url(#hb-lines)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="hb-border" x1="21" y1="35.5" x2="42" y2="-18" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#464EFF" />
                    <stop offset="1" stopColor="#5EFF6E" />
                  </linearGradient>
                  <linearGradient id="hb-lines" x1="19.5" y1="26" x2="29" y2="4.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#464EFF" />
                    <stop offset="1" stopColor="#5EFF6E" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* MobileMenu outside header to avoid z-50 stacking context trap */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
