import { useId } from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: 'gradient' | 'currentColor';
}

export function AiMagic({ className, size = 18, color = 'currentColor' }: IconProps) {
  const id = useId();
  const strokeValue = color === 'gradient' ? `url(#${id})` : 'currentColor';
  const fillValue = color === 'gradient' ? `url(#${id})` : 'currentColor';

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M7.5 5.25L7.113 6.2955C6.606 7.6665 6.3525 8.352 5.85225 8.85225C5.352 9.3525 4.6665 9.606 3.2955 10.113L2.25 10.5L3.2955 10.887C4.6665 11.394 5.352 11.6483 5.85225 12.1478C6.3525 12.6473 6.606 13.3335 7.113 14.7045L7.5 15.75L7.887 14.7045C8.394 13.3335 8.64825 12.648 9.14775 12.1478C9.64725 11.6475 10.3335 11.394 11.7045 10.887L12.75 10.5L11.7045 10.113C10.3335 9.606 9.648 9.3525 9.14775 8.85225C8.6475 8.352 8.394 7.6665 7.887 6.2955L7.5 5.25ZM13.5 2.25L13.3342 2.69775C13.1167 3.28575 13.008 3.57975 12.7942 3.7935C12.5797 4.008 12.2857 4.11675 11.6977 4.3335L11.25 4.5L11.6985 4.66575C12.2857 4.88325 12.5797 4.992 12.7935 5.20575C13.008 5.42025 13.1167 5.71425 13.3335 6.30225L13.5 6.75L13.6657 6.30225C13.8832 5.71425 13.992 5.42025 14.2057 5.2065C14.4202 4.992 14.7142 4.88325 15.3022 4.6665L15.75 4.5L15.3015 4.33425C14.7143 4.11675 14.4202 4.008 14.2065 3.79425C13.992 3.57975 13.8832 3.28575 13.6665 2.69775L13.5 2.25Z"
        stroke={strokeValue}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <circle cx="13.5" cy="4.5001" r="0.9" fill={fillValue} />
      {color === 'gradient' && (
        <defs>
          <linearGradient id={id} x1="2" y1="16" x2="16" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#464EFF" />
            <stop offset="1" stopColor="#5EFF6E" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
