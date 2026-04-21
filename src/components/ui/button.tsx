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
  rel?: string;
  target?: string;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'pl-6 pr-5 py-3 h-[42px]',
  md: 'px-6 py-[17px]',
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2';

function isExternal(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

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
  rel: relProp,
  target: targetProp,
}: ButtonProps) {
  const rel = relProp ?? (href && isExternal(href) ? 'noopener noreferrer' : undefined);
  const target = targetProp ?? (href && isExternal(href) ? '_blank' : undefined);
  if (variant === 'primary') {
    const inner = (
      <>
        {icon}
        {children}
      </>
    );

    const cls = cn(
      `btn-primary inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium text-white transition-all duration-200 hover:opacity-85 hover:scale-[1.02] hover:shadow-lg ${focusRing}`,
      sizeStyles[size],
      animated && 'animate-cta-glow animate-gradient-shift-slow',
      className,
    );

    const style = animated
      ? {
          background: 'var(--theme-gradient-primary-animated)',
          backgroundSize: '200% 200%',
        }
      : {
          background: 'var(--theme-btn-primary-bg)',
        };

    if (href) return <a href={href} className={cls} style={style} rel={rel} target={target}>{inner}</a>;
    return <button className={cls} style={style} onClick={onClick}>{inner}</button>;
  }

  // outline & action share gradient border + gradient text
  const gradientAngle = `var(--theme-gradient-border-static)`;

  const borderWidth = borderWidthProp ?? (size === 'sm' ? 1.5 : 1.5);

  const textGradientAngle = `var(--theme-gradient-text)`;

  const inner = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <GradientText angle={textGradientAngle} className="font-medium">{children}</GradientText>
    </>
  );

  const cls = cn(
    'btn-outline-sm inline-flex items-center justify-center gap-2 rounded-[60px] text-sm font-medium transition-all duration-200 hover:opacity-75 hover:scale-[1.02]',
    sizeStyles[size],
    className,
  );

  const borderProps = {
    borderWidth,
    borderRadius: 60,
    gradientAngle,
    animated,
  };

  if (href) {
    return (
      <GradientBorder
        {...borderProps}
        as="a"
        href={href}
        rel={rel}
        target={target}
        className={cn(cls, animated && 'animate-cta-glow', focusRing)}
      >
        {inner}
      </GradientBorder>
    );
  }
  return (
    <GradientBorder
      {...borderProps}
      className={cn(cls, animated && 'animate-cta-glow', focusRing)}
    >
      <button className="inline-flex items-center justify-center gap-2 w-full h-full" onClick={onClick}>
        {inner}
      </button>
    </GradientBorder>
  );
}
