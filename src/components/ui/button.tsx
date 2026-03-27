import { cn } from '@/lib/utils';
import { GradientBorder } from '@/components/ui/gradient-border';
import { GradientText } from '@/components/ui/gradient-text';

type ButtonVariant = 'primary' | 'outline' | 'action';
type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  borderWidth?: number;
  animated?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'pl-6 pr-5 py-3 h-[42px]',
  md: 'px-6 py-[17px]',
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2';

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  href,
  children,
  className,
  onClick,
  borderWidth: borderWidthProp,
  animated,
}: ButtonProps) {
  if (variant === 'primary') {
    const inner = (
      <>
        {icon}
        {children}
      </>
    );

    const cls = cn(
      `inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium text-white transition-all duration-200 hover:opacity-85 hover:scale-[1.02] hover:shadow-lg ${focusRing}`,
      sizeStyles[size],
      animated && 'animate-cta-glow animate-gradient-shift-slow',
      className,
    );

    const style = animated
      ? {
          background: 'linear-gradient(135deg, #5EFF6E 0%, #464EFF 50%, #5EFF6E 100%)',
          backgroundSize: '200% 200%',
        }
      : {
          background: 'linear-gradient(186deg, var(--color-brand-green) -11%, var(--color-brand-blue) 71%)',
        };

    if (href) return <a href={href} className={cls} style={style}>{inner}</a>;
    return <button className={cls} style={style} onClick={onClick}>{inner}</button>;
  }

  // outline & action share gradient border + gradient text
  const gradientAngle = size === 'sm'
    ? '4deg, rgba(70,78,255,1) 30%, rgba(94,255,110,1) 100%'
    : '187deg, var(--color-brand-green) -22%, var(--color-brand-blue) 67%';

  const borderWidth = borderWidthProp ?? (size === 'sm' ? 1.5 : 1.5);

  const textGradientAngle = size === 'sm'
    ? '182deg, rgba(94,255,110,1) 0%, rgba(70,78,255,1) 79%'
    : '0deg, rgba(70,78,255,1) 21%, rgba(94,255,110,1) 100%';

  const inner = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <GradientText angle={textGradientAngle} className="font-medium">{children}</GradientText>
    </>
  );

  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium transition-all duration-200 hover:opacity-75 hover:scale-[1.02]',
    sizeStyles[size],
    className,
  );

  const content = (
    <GradientBorder
      borderWidth={borderWidth}
      borderRadius={60}
      gradientAngle={gradientAngle}
      className={cls}
      animated={animated}
    >
      {inner}
    </GradientBorder>
  );

  if (href) {
    return <a href={href} className={cn('inline-flex rounded-[60px]', animated && 'animate-cta-glow', focusRing, className)}>{content}</a>;
  }
  return <button className={cn('inline-flex rounded-[60px]', animated && 'animate-cta-glow', focusRing, className)} onClick={onClick}>{content}</button>;
}
