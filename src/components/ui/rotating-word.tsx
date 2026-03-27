'use client';

import { useRotatingContent } from '@/lib/use-rotating-content';

interface RotatingWordProps {
  className?: string;
  gradient: string;
  suffix: string;
}

export function RotatingWord({ className, gradient, suffix }: RotatingWordProps) {
  const { word, blurred } = useRotatingContent();
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <span
      className={`bg-clip-text text-transparent ${className ?? ''}`}
      style={{
        backgroundImage: `linear-gradient(${gradient})`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          filter: blurred ? 'blur(10px)' : 'blur(0)',
          opacity: blurred ? 0 : 1,
          transition: 'filter 0.6s ease, opacity 0.6s ease',
        }}
      >
        {capitalized}
      </span>
      {suffix}
    </span>
  );
}
