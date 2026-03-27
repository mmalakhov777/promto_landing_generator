import { useId } from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: 'gradient' | 'white' | 'currentColor';
}

export function ArrowUpRight({ className, size = 18, color = 'gradient' }: IconProps) {
  const id = useId();
  const strokeValue = color === 'gradient' ? `url(#${id})` : color === 'white' ? '#FFFFFF' : 'currentColor';

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M5.25 12.75L12.75 5.25M12.75 5.25H6.75M12.75 5.25V11.25" stroke={strokeValue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {color === 'gradient' && (
        <defs>
          <linearGradient id={id} x1="13" y1="-6.5" x2="7" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5EFF6E" />
            <stop offset="1" stopColor="#464EFF" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
