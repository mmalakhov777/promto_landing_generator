import Image from 'next/image';
import type { ReactNode } from 'react';

interface StepCardProps {
  number: string;
  desktopTitle: ReactNode;
  mobileTitle: ReactNode;
  description: string;
  desktopImage: string;
  mobileImage: string;
  desktopSize: { w: number; h: number };
  mobileSize: { w: number; h: number };
}

export function StepCard({
  number,
  desktopTitle,
  mobileTitle,
  description,
  desktopImage,
  mobileImage,
  desktopSize,
  mobileSize,
}: StepCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[32px]">
      {/* Gradient border — mobile: 32deg, desktop: 3deg */}
      <span
        className="absolute inset-0 pointer-events-none rounded-[24px] lg:rounded-[32px] z-10"
        aria-hidden="true"
      >
        {/* Mobile border */}
        <span
          className="absolute inset-0 rounded-[24px] lg:hidden"
          style={{
            padding: 1.25,
            background: `linear-gradient(32deg, var(--theme-accent-from) 46%, var(--theme-accent-to) 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        {/* Desktop border */}
        <span
          className="absolute inset-0 rounded-[32px] hidden lg:block"
          style={{
            padding: 1.25,
            background: `linear-gradient(3deg, var(--theme-accent-from) 10%, var(--theme-accent-to) 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </span>

      {/* Card content */}
      <div className="relative w-full rounded-[24px] lg:rounded-[32px]">
        {/* ── Desktop layout ── */}
        <div className="hidden lg:flex items-center min-h-[339px] pl-[60px] pr-3 py-3">
          {/* Text */}
          <div className="flex-shrink-0 w-[397px] flex flex-col gap-8">
            <span className="text-sm font-normal text-text-secondary leading-[1.3]">
              {number}
            </span>
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold text-text-primary leading-[1.2]">{desktopTitle}</h3>
              <p className="text-sm font-normal text-text-secondary leading-[1.3]">{description}</p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Illustration */}
          <div className="flex-shrink-0 w-[650px] h-[315px] relative rounded-[32px] overflow-hidden">
            <Image
              src={desktopImage}
              alt=""
              width={desktopSize.w}
              height={desktopSize.h}
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="lg:hidden relative">
          {/* Text area */}
          <div className="px-6 pt-8 pb-0 flex flex-col gap-6">
            <span className="text-xs font-normal text-text-secondary leading-[1.3]">
              {number}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-text-primary leading-[1.2]">{mobileTitle}</h3>
              <p className="text-xs font-normal text-text-secondary leading-[1.3]">{description}</p>
            </div>
          </div>

          {/* Mobile illustration */}
          <div className="relative w-full mt-4 px-2 pb-2">
            <div className="relative w-full rounded-[20px] overflow-hidden"
              style={{ aspectRatio: `${mobileSize.w} / ${mobileSize.h}` }}>
              <Image
                src={mobileImage}
                alt=""
                width={mobileSize.w}
                height={mobileSize.h}
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
