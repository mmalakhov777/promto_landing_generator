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
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const id = setInterval(() => {
      setBlurred(true);
      setTimeout(() => {
        const content = AGENT_CONTENT[modeRef.current];
        setIndex((i) => (i + 1) % content.words.length);
        setBlurred(false);
      }, BLUR_DURATION);
    }, ROTATE_INTERVAL);

    return () => clearInterval(id);
  }, []);

  const setMode = useCallback((newMode: string) => {
    setBlurred(true);
    setTimeout(() => {
      setModeState(newMode);
      modeRef.current = newMode;
      setIndex(0);
      setBlurred(false);
    }, BLUR_DURATION);
  }, []);

  const content = AGENT_CONTENT[mode];
  const word = content.words[index] ?? content.words[0];
  const placeholder = content.placeholders[index] ?? content.placeholders[0];

  return { mode, word, placeholder, blurred, setMode };
}
