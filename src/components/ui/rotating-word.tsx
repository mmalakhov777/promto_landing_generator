'use client';

import { useState, useEffect, useRef } from 'react';

const WORDS = ['сайт', 'API', 'бота', 'сервис', 'приложение', 'бэкенд'];
const ROTATE_INTERVAL = 4000;
const BLUR_DURATION = 600;

interface RotatingWordProps {
  className?: string;
  gradient: string;
  suffix: string;
}

export function RotatingWord({ className, gradient, suffix }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBlurred(true);
      timeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setBlurred(false);
      }, BLUR_DURATION);
    }, ROTATE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const word = WORDS[index];
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <span className={className}>
      <span
        style={{
          display: 'inline-block',
          backgroundImage: `linear-gradient(${gradient})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: blurred ? 'blur(10px)' : 'blur(0)',
          opacity: blurred ? 0 : 1,
          transition: 'filter 0.6s ease, opacity 0.6s ease',
        }}
      >
        {capitalized}
      </span>
      <span
        style={{
          backgroundImage: `linear-gradient(${gradient})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {suffix}
      </span>
    </span>
  );
}
