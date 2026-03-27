interface IconProps {
  className?: string;
  size?: number;
}

export function Hamburger({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hamburger-gradient" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(18)">
          <stop offset="0%" stopColor="rgba(70,78,255,1)" />
          <stop offset="100%" stopColor="rgba(94,255,110,1)" />
        </linearGradient>
      </defs>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="url(#hamburger-gradient)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
