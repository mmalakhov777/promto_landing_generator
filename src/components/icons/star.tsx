interface IconProps {
  className?: string;
  size?: number;
}

export function Star({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
