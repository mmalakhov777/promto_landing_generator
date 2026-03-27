'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = ['Сайт', 'API', 'Бота', 'Сервис', 'Приложение', 'Бэкенд'];

interface RotatingWordProps {
  className?: string;
  gradient: string;
}

export function RotatingWord({ className, gradient }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const id = setInterval(() => {
      setBlurred(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setBlurred(false);
      }, 600);
    }, 4000);

    return () => clearInterval(id);
  }, [mounted]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        filter: blurred ? 'blur(10px)' : 'blur(0px)',
        opacity: blurred ? 0 : 1,
        transition: 'filter 0.6s ease, opacity 0.6s ease',
      }}
    >
      <span
        style={{
          backgroundImage: `linear-gradient(${gradient})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {WORDS[index]}
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
