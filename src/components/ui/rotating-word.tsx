'use client';

const WORDS = ['Сайт', 'API', 'Бот', 'Сервис', 'Приложение', 'Бэкенд'];

interface RotatingWordProps {
  className?: string;
  gradient: string;
}

export function RotatingWord({ className, gradient }: RotatingWordProps) {
  // Animation is handled by the inline script in layout.tsx (DOM-based, no React hydration needed)
  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradient})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <span
      className={className}
      data-rotating-title=""
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        filter: 'blur(0px)',
        opacity: 1,
        transition: 'filter 0.6s ease, opacity 0.6s ease',
      }}
    >
      <span
        data-rotating-word=""
        style={gradientStyle}
      >
        {WORDS[0]}
      </span>
      <span className="text-text-primary">
        {' '}с помощью ИИ&nbsp;&mdash;
      </span>
      <br className="hidden lg:block" />
      <span className="text-text-primary">
        {' '}просто опишите идею в&nbsp;Промто
      </span>
    </span>
  );
}
