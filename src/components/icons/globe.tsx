interface IconProps {
  className?: string;
  size?: number;
}

export function Globe({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
