interface IconProps {
  className?: string;
  size?: number;
}

export function Network({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="4" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="4" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 6.5l4.5 4M17.5 6.5L13 10M6 17.5l4.5-4M17.5 17.5L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
