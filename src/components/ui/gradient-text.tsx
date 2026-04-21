import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  as?: 'span' | 'p' | 'h1' | 'h2';
  angle?: string;
  className?: string;
}

export function GradientText({
  children,
  as: Tag = 'span',
  angle,
  className,
}: GradientTextProps) {
  if (angle) {
    return (
      <Tag
        className={cn('relative bg-clip-text text-transparent', className)}
        style={{ backgroundImage: `linear-gradient(${angle})` }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(
        'bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
