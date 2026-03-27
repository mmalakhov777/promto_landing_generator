import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className }: SectionContainerProps) {
  return (
    <div className={cn('max-w-[1440px] mx-auto px-6 lg:px-[60px] xl:px-[120px]', className)}>
      {children}
    </div>
  );
}
