'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const AGENT_CONTENT: Record<string, { words: string[]; placeholders: string[] }> = {
  'Дизайнер': {
    words: ['сайт', 'лендинг', 'интерфейс', 'приложение', 'страницу', 'дизайн'],
    placeholders: [
      'Попроси Промто создать сайт для бренда...',
      'Попроси Промто разработать лендинг для продукта...',
      'Попроси Промто создать интерфейс мобильного приложения...',
      'Попроси Промто придумать дизайн-систему...',
      'Попроси Промто нарисовать страницу оформления заказа...',
      'Попроси Промто создать дизайн онбординга...',
    ],
  },
  'Разработчик': {
    words: ['сайт', 'API', 'бота', 'сервис', 'приложение', 'бэкенд'],
    placeholders: [
      'Попроси Промто создать сайт на React...',
      'Попроси Промто написать REST API для магазина...',
      'Попроси Промто создать Telegram-бота...',
      'Попроси Промто разработать микросервис...',
      'Попроси Промто написать мобильное приложение...',
      'Попроси Промто настроить бэкенд с авторизацией...',
    ],
  },
  'Маркетолог': {
    words: ['лендинг', 'воронку', 'рассылку', 'магазин', 'рекламу', 'контент'],
    placeholders: [
      'Попроси Промто создать лендинг для кампании...',
      'Попроси Промто настроить воронку продаж...',
      'Попроси Промто написать email-рассылку...',
      'Попроси Промто запустить интернет-магазин...',
      'Попроси Промто создать рекламный баннер...',
      'Попроси Промто придумать контент-стратегию...',
    ],
  },
};

export const MODES = Object.keys(AGENT_CONTENT);

const ROTATE_INTERVAL = 4000;
const BLUR_DURATION = 600;

export function useRotatingContent() {
  const [mode, setModeState] = useState('Разработчик');
  const [index, setIndex] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const content = AGENT_CONTENT[mode];

  // Auto-rotate every 4s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBlurred(true);
      timeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % content.words.length);
        setBlurred(false);
      }, BLUR_DURATION);
    }, ROTATE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content.words.length]);

  const setMode = useCallback((newMode: string) => {
    if (newMode === mode) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setBlurred(true);
    timeoutRef.current = setTimeout(() => {
      setModeState(newMode);
      setIndex(0);
      setBlurred(false);
    }, BLUR_DURATION);
  }, [mode]);

  const word = content.words[index] ?? content.words[0];
  const placeholder = content.placeholders[index] ?? content.placeholders[0];

  return { mode, word, placeholder, blurred, setMode };
}
