import { cn } from '@/lib/utils';

interface GradientBorderProps {
  children: React.ReactNode;
  as?: 'span' | 'div';
  borderWidth?: number;
  borderRadius?: number;
  gradientAngle?: string;
  className?: string;
  animated?: boolean;
}

export function GradientBorder({
  children,
  as: Tag = 'span',
  borderWidth = 1.25,
  borderRadius = 60,
  gradientAngle = '3deg, rgba(70,78,255,1) 10%, rgba(94,255,110,1) 100%',
  className,
  animated,
}: GradientBorderProps) {
  return (
    <Tag
      className={cn(Tag === 'span' ? 'relative inline-flex' : 'relative flex', className)}
      style={{ borderRadius }}
    >
      <span
        className={cn('gradient-border-mask absolute inset-0 pointer-events-none', animated && 'animate-gradient-shift-slow')}
        style={{
          borderRadius,
          padding: borderWidth,
          background: animated
            ? 'var(--theme-gradient-border)'
            : `linear-gradient(${gradientAngle})`,
          backgroundSize: animated ? '200% 200%' : undefined,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
      {children}
    </Tag>
  );
}
