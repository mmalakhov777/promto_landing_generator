'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = ['Сайт', 'Приложение', 'Сервис', 'Платформа'];
const DISPLAY_TIME = 3500;
const FADE_MS = 500;

interface RotatingWordProps {
  className?: string;
  gradient: string;
  suffix: string;
}

export function RotatingWord({ className, gradient, suffix }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cycle = useCallback(() => {
    setFading(true);
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % WORDS.length);
      setFading(false);
    }, FADE_MS);
  }, []);

  useEffect(() => {
    const id = setInterval(cycle, DISPLAY_TIME + FADE_MS);
    return () => {
      clearInterval(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cycle]);

  return (
    <span
      className={`bg-clip-text text-transparent ${className ?? ''}`}
      style={{
        backgroundImage: `linear-gradient(${gradient})`,
        transition: `opacity ${FADE_MS}ms ease`,
        opacity: fading ? 0 : 1,
      }}
    >
      {WORDS[index]}{suffix}
    </span>
  );
}
