interface IconProps {
  className?: string;
  size?: number;
}

export function CirclePlus({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 12h6M12 9v6M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
