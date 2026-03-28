import Image from 'next/image';
import { FOOTER_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { AiMagic } from '@/components/icons/ai-magic';

export function Footer() {
  return (
    <footer className="relative z-10 pt-[72px] lg:pt-[100px] pb-10 lg:pb-12" aria-label="Подвал сайта">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px] xl:px-[120px] flex flex-col gap-[60px] lg:gap-[180px]">
        {/* ── Top section ── */}
        <div className="flex flex-col gap-[60px] lg:flex-row lg:justify-between">
          {/* Logo + tagline */}
          <div className="w-[240px] flex-shrink-0 flex flex-col gap-8 lg:gap-10">
            <Image
              src="/images/footer-logo-black.svg"
              alt="Промто"
              width={142}
              height={34}
              className="w-[142px] h-[34px] block dark-hidden"
            />
            <Image
              src="/images/footer-logo-white-mono.svg"
              alt="Промто"
              width={142}
              height={34}
              className="w-[142px] h-[34px] hidden dark-visible"
            />
            <p className="text-sm text-text-muted lg:text-text-secondary leading-[1.25]">
              Единая платформа для разработки.
              {' '}Создавайте продукты за недели
              {' '}вместо месяцев.
            </p>
          </div>

          {/* Nav columns + CTA — desktop: row gap-120; mobile: column gap-60 */}
          <div className="flex flex-col gap-[60px] lg:flex-row lg:gap-[60px] xl:gap-[120px]">
            {/* Link groups */}
            {FOOTER_LINKS.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className="flex flex-col gap-6 lg:gap-4"
              >
                <h3 className="text-sm text-text-muted lg:text-text-secondary leading-[1.2]">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-6 lg:gap-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-text-primary leading-[1.2] hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* CTA column */}
            <div className="flex flex-col gap-8 lg:w-[274px]">
              <p className="text-sm text-text-primary leading-[1.2]">
                Создавайте продукты с Промто быстрее,<br />
                чем рынок успеет измениться
              </p>
              <Button variant="outline" size="md" icon={<AiMagic size={18} color="gradient" />} href="https://app.promto.ai">
                Попробовать бесплатно
              </Button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        {/* Mobile: legal links column, then copyright */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col gap-6 w-[183px]">
            <a
              href="https://app.promto.ai/termsofuse"
              className="text-xs text-text-muted leading-[1.25] hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm"
            >
              Пользовательское соглашение
            </a>
            <a
              href="https://app.promto.ai/policy.pdf"
              className="text-xs text-text-muted leading-[1.25] hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm"
            >
              Политика конфиденциальности
            </a>
          </div>
          <span className="text-xs text-text-muted leading-[1.25]">© Promto, 2026</span>
        </div>

        {/* Desktop: copyright left, legal links right */}
        <div className="hidden lg:flex items-center justify-between">
          <span className="text-xs text-text-secondary leading-[1.25]">© Promto, 2026</span>
          <div className="flex gap-[80px]">
            <a
              href="https://app.promto.ai/termsofuse"
              className="text-xs text-text-secondary leading-[1.25] text-right hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm"
            >
              Пользовательское соглашение
            </a>
            <a
              href="https://app.promto.ai/policy.pdf"
              className="text-xs text-text-secondary leading-[1.25] text-right hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm"
            >
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
