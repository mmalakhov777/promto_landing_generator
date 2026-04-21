import { cn } from '@/lib/utils';

type IconBoxColor = 'red' | 'green' | 'blue' | 'orange' | 'purple';

interface IconBoxProps {
  icon: React.ReactNode;
  color: IconBoxColor;
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap: Record<IconBoxColor, string> = {
  red: 'var(--color-accent-red)',
  green: 'linear-gradient(193deg, var(--color-accent-green-to) 0%, var(--color-accent-green-from) 100%)',
  blue: 'linear-gradient(196deg, var(--color-accent-blue-from) 0%, var(--color-accent-blue-to) 100%)',
  orange: 'linear-gradient(196deg, var(--color-accent-orange-from) 0%, var(--color-accent-orange-to) 91%)',
  purple: 'linear-gradient(196deg, var(--color-accent-purple-from) 0%, var(--color-accent-purple-to) 91%)',
};

export function IconBox({ icon, color, size = 'sm', className }: IconBoxProps) {
  const sizeClass = size === 'sm'
    ? 'w-10 h-10 rounded-[10px]'
    : 'w-10 h-10 rounded-[10px] lg:w-[50px] lg:h-[50px] lg:rounded-[14px]';

  return (
    <span
      className={cn('flex items-center justify-center flex-shrink-0 text-white', sizeClass, className)}
      style={{ background: colorMap[color] }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}
