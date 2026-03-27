'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';

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

const ROTATE_INTERVAL = 4000;
const BLUR_DURATION = 600;

// Shared singleton state so title + placeholder stay in sync
let _mode = 'Разработчик';
let _index = 0;
let _blurred = false;
let _listeners = new Set<() => void>();
let _intervalId: ReturnType<typeof setInterval> | null = null;

function notify() {
  _listeners.forEach((l) => l());
}

function startInterval() {
  if (_intervalId) return;
  _intervalId = setInterval(() => {
    _blurred = true;
    notify();
    setTimeout(() => {
      const content = AGENT_CONTENT[_mode];
      _index = (_index + 1) % content.words.length;
      _blurred = false;
      notify();
    }, BLUR_DURATION);
  }, ROTATE_INTERVAL);
}

function stopInterval() {
  if (_intervalId) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
}

function subscribe(listener: () => void) {
  _listeners.add(listener);
  if (_listeners.size === 1) startInterval();
  return () => {
    _listeners.delete(listener);
    if (_listeners.size === 0) stopInterval();
  };
}

function getSnapshot() {
  const content = AGENT_CONTENT[_mode];
  return {
    mode: _mode,
    word: content.words[_index] ?? content.words[0],
    placeholder: content.placeholders[_index] ?? content.placeholders[0],
    blurred: _blurred,
  };
}

// Keep a stable reference when values haven't changed
let _lastSnapshot = getSnapshot();
function getStableSnapshot() {
  const next = getSnapshot();
  if (
    next.mode === _lastSnapshot.mode &&
    next.word === _lastSnapshot.word &&
    next.placeholder === _lastSnapshot.placeholder &&
    next.blurred === _lastSnapshot.blurred
  ) {
    return _lastSnapshot;
  }
  _lastSnapshot = next;
  return next;
}

export function useRotatingContent() {
  const snapshot = useSyncExternalStore(subscribe, getStableSnapshot, getStableSnapshot);

  const setMode = useCallback((mode: string) => {
    if (mode === _mode) return;
    stopInterval();
    _blurred = true;
    notify();
    setTimeout(() => {
      _mode = mode;
      _index = 0;
      _blurred = false;
      notify();
      startInterval();
    }, BLUR_DURATION);
  }, []);

  return { ...snapshot, setMode };
}

export const MODES = Object.keys(AGENT_CONTENT);
