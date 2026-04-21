interface IconProps {
  className?: string;
  size?: number;
}

export function Monitor({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.25 15H6.75M3 10.3501V6.15015C3 5.31007 3 4.88972 3.16349 4.56885C3.3073 4.2866 3.5366 4.0573 3.81885 3.91349C4.13972 3.75 4.56007 3.75 5.40015 3.75H12.6001C13.4402 3.75 13.8597 3.75 14.1805 3.91349C14.4628 4.0573 14.6929 4.2866 14.8367 4.56885C15 4.8894 15 5.30925 15 6.14768V10.3523C15 11.1908 15 11.61 14.8367 11.9305C14.6929 12.2128 14.4628 12.4429 14.1805 12.5867C13.86 12.75 13.4408 12.75 12.6023 12.75H5.39768C4.55925 12.75 4.1394 12.75 3.81885 12.5867C3.5366 12.4429 3.3073 12.2128 3.16349 11.9305C3 11.6097 3 11.1902 3 10.3501Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
