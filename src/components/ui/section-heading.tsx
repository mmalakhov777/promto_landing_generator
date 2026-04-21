import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  id?: string;
  className?: string;
}

export function SectionHeading({
  children,
  as: Tag = 'h2',
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-semibold text-text-primary',
        Tag === 'h1'
          ? 'text-[28px] lg:text-[48px] leading-[1.24] lg:leading-[1.12] tracking-[-0.5px]'
          : 'text-[28px] lg:text-[38px] leading-[1.24] lg:leading-[1.12]',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
