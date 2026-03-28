'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { AiMagic } from '@/components/icons/ai-magic';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const dialog = dialogRef.current;
    if (dialog) {
      const first = dialog.querySelector<HTMLElement>(focusableSelector);
      first?.focus();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const menu = (
    <div
      ref={dialogRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'var(--theme-menu-bg)' }}
      className="flex flex-col backdrop-blur-[12px]"
      aria-modal="true"
      role="dialog"
      aria-label="Мобильное меню"
    >
      <div className="flex flex-col" style={{ gap: 215, paddingBottom: 60, minHeight: '100%' }}>

        <div className="flex flex-col gap-[60px]">

          <div className="flex items-center justify-between h-[72px] px-6">
            <a href="/" className="flex-shrink-0" aria-label="Промто — на главную">
              <img src="/menu-logo.svg" alt="Промто" width={34} height={42} />
            </a>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" href="https://app.promto.ai">Войти</Button>

              <button
                type="button"
                onClick={onClose}
                className="w-[42px] h-[42px] flex items-center justify-center rounded-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                aria-label="Закрыть меню"
              >
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true" style={{ pointerEvents: 'none' }}>
                  <rect x="0.625" y="0.625" width="40.75" height="40.75" rx="20.375" stroke="url(#menu-hb-border)" strokeWidth="1.25" />
                  <path d="M14 16H28M14 21H28M14 26H28" stroke="url(#menu-hb-lines)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="menu-hb-border" x1="21" y1="35.5" x2="42" y2="-18" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#464EFF" />
                      <stop offset="1" stopColor="#5EFF6E" />
                    </linearGradient>
                    <linearGradient id="menu-hb-lines" x1="19.5" y1="26" x2="29" y2="4.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#464EFF" />
                      <stop offset="1" stopColor="#5EFF6E" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <nav className="px-6" aria-label="Мобильная навигация">
            <ul className="flex flex-col gap-[32px]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block text-[16px] font-medium leading-[1.2] text-text-primary"
                    onClick={onClose}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="px-6 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col gap-3">
            <Button variant="outline" size="md" icon={<AiMagic size={18} color="gradient" />} href="https://app.promto.ai" className="w-full justify-center">
              Попробовать бесплатно
            </Button>
          </div>
          <p className="text-[12px] font-normal leading-[1.2] text-text-secondary text-center">
            Банковская карта не потребуется:<br />пробный период без привязки карты
          </p>
        </div>

      </div>
    </div>
  );

  return createPortal(menu, document.body);
}
