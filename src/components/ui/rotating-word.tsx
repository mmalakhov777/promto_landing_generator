'use client';

const WORDS = ['Сайт', 'API', 'Бота', 'Сервис', 'Приложение', 'Бэкенд'];

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
      {/* Inline container that reserves width of the widest word */}
      <span className="inline-grid" style={{ gridTemplateColumns: '1fr', verticalAlign: 'baseline', lineHeight: 'inherit' }}>
        {/* Hidden words to reserve max width */}
        {WORDS.map((word) => (
          <span
            key={word}
            aria-hidden="true"
            className="invisible"
            style={{ ...gradientStyle, gridRow: 1, gridColumn: 1, lineHeight: 'inherit' }}
          >
            {word}
          </span>
        ))}
        {/* Visible rotating word — same grid cell, stacked on top */}
        <span
          data-rotating-word=""
          style={{ ...gradientStyle, gridRow: 1, gridColumn: 1, lineHeight: 'inherit' }}
        >
          {WORDS[0]}
        </span>
      </span>
      <span className="text-text-primary">
        {' '}за пару минут&nbsp;&mdash;
      </span>
      <br className="hidden lg:block" />
      <span className="text-text-primary">
        {' '}просто напишите, что вам нужно
      </span>
    </span>
  );
}
