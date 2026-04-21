import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <article className={cn('bg-bg-card rounded-[24px] lg:rounded-[32px] shadow-card', className)}>
      {children}
    </article>
  );
}
