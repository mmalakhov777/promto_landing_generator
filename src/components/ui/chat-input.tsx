'use client';

import { useState, useEffect, useRef } from 'react';
import { Microphone } from '@/components/icons/microphone';
import { ChevronDown } from '@/components/icons/chevron-down';
import { MODES } from '@/lib/use-rotating-content';

function IconFigma() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 18.333a2.5 2.5 0 0 0 2.5-2.5v-2.5H7.5a2.5 2.5 0 0 0 0 5Z" fill="#0ACF83"/>
      <path d="M5 10.833a2.5 2.5 0 0 1 2.5-2.5H10v5H7.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="#A259FF"/>
      <path d="M5 5.833a2.5 2.5 0 0 1 2.5-2.5H10v5H7.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="#F24E1E"/>
      <path d="M10 3.333h2.5a2.5 2.5 0 0 1 0 5H10v-5Z" fill="#FF7262"/>
      <path d="M15 8.333a2.5 2.5 0 1 1-2.5 2.5 2.5 2.5 0 0 1 2.5-2.5Z" fill="#1ABCFE"/>
    </svg>
  );
}

function IconAttach() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 1.667A8.333 8.333 0 0 0 7.366 17.9c.417.075.57-.18.57-.4v-1.508c-2.321.504-2.812-1.005-2.812-1.005a2.213 2.213 0 0 0-.929-1.22c-.758-.519.058-.508.058-.508a1.754 1.754 0 0 1 1.28.862 1.78 1.78 0 0 0 2.433.694 1.785 1.785 0 0 1 .53-1.117c-1.852-.21-3.8-.926-3.8-4.12a3.224 3.224 0 0 1 .858-2.24 3 3 0 0 1 .082-2.208s.7-.225 2.292.855a7.9 7.9 0 0 1 4.167 0c1.592-1.08 2.291-.855 2.291-.855a3 3 0 0 1 .083 2.209 3.224 3.224 0 0 1 .858 2.239c0 3.202-1.95 3.908-3.808 4.113a1.994 1.994 0 0 1 .567 1.548v2.296c0 .272.15.48.575.398A8.334 8.334 0 0 0 10 1.667Z" fill="var(--theme-github-fill)"/>
    </svg>
  );
}

export function ChatInput() {
  const [userValue, setUserValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Pro Max');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const inputRef = useRef<HTMLInputElement>(null);

  const fillInput = (text: string) => {
    setUserValue(text);
    setFocused(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const showPlaceholder = !focused && userValue.length === 0;

  return (
    <div className="relative w-full h-[160px] lg:h-[154px]">
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-[24px] animate-gradient-shift"
        style={{
          padding: '1.25px',
          background: 'var(--theme-gradient-border)',
          backgroundSize: '200% 200%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Inner area */}
      <div
        className="absolute inset-1 rounded-[20px] flex flex-col justify-between p-5 lg:px-6 lg:pt-6 lg:pb-[21px] transition-colors duration-300"
        style={{ backgroundColor: 'var(--theme-chat-inner-bg)' }}
      >
        {/* Input area with typewriter overlay */}
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={userValue}
            onChange={(e) => setUserValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent text-base text-text-primary leading-[1.24] font-normal outline-none relative z-10 text-left"
            aria-label="Описание задачи"
          />
          {showPlaceholder && (
            <div
              data-rotating-placeholder=""
              className="absolute inset-0 flex items-center text-base text-text-placeholder leading-[1.4] font-normal pointer-events-none text-left"
              style={{
                filter: 'blur(0px)',
                opacity: 1,
                transition: 'filter 0.6s ease, opacity 0.6s ease',
              }}
            >
              Попроси Промто создать сайт на React...
            </div>
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between">
          {/* Left: Integration icons + Agent selector */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Figma icon */}
            <button
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Подключить Figma"
              onClick={() => fillInput('Расскажи как перенести дизайн из Фигмы')}
            >
              <IconFigma />
            </button>

            {/* Attach icon */}
            <button
              className="flex-shrink-0 text-text-placeholder hover:text-text-secondary transition-colors cursor-pointer"
              aria-label="Прикрепить файл"
              onClick={() => fillInput('Как прикрепить файлы')}
            >
              <IconAttach />
            </button>

            {/* GitHub icon */}
            <button
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Подключить GitHub"
              onClick={() => fillInput('Расскажи как подключить свой GitHub')}
            >
              <IconGitHub />
            </button>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-border-light flex-shrink-0" aria-hidden="true" />

            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-1 lg:gap-[5.5px] text-sm lg:text-base font-medium text-text-placeholder leading-[1.24] cursor-pointer hover:text-text-secondary transition-colors"
                aria-label="Выбрать агента"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {selectedMode}
                <span
                  className="transition-transform duration-200"
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                >
                  <ChevronDown size={24} className="lg:hidden" />
                  <ChevronDown size={28} className="hidden lg:block" />
                </span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute left-0 bottom-full mb-2 rounded-2xl py-2 min-w-[180px] z-50"
                  style={{
                    backgroundColor: 'var(--theme-dropdown-bg)',
                    boxShadow: 'var(--theme-dropdown-shadow)',
                  }}
                >
                  {MODES.map((agent) => (
                    <button
                      key={agent}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors"
                      style={{
                        color: agent === selectedMode ? 'var(--color-brand-blue)' : 'var(--theme-text-primary)',
                        backgroundColor: agent === selectedMode ? 'rgba(70, 78, 255, 0.05)' : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (agent !== selectedMode) e.currentTarget.style.backgroundColor = 'var(--theme-dropdown-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (agent !== selectedMode) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        setSelectedMode(agent);
                        setDropdownOpen(false);
                      }}
                    >
                      {agent}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Mic + Send */}
          <div className="flex items-center gap-3 lg:gap-5">
            <button
              className="flex-shrink-0 text-text-placeholder hover:text-text-secondary transition-colors cursor-pointer"
              aria-label="Голосовой ввод"
              onClick={() => fillInput('В Промто все запросы можно давать голосом')}
            >
              <Microphone size={24} className="lg:hidden" />
              <Microphone size={28} className="hidden lg:block" />
            </button>

            {/* Send button — gradient circle with arrow up */}
            <a
              href="https://app.promto.ai"
              className="flex-shrink-0 relative transition-all duration-200 hover:opacity-85 hover:scale-[1.05] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-full w-8 h-8 lg:w-[39px] lg:h-[39px]"
              aria-label="Отправить"
            >
              <div
                className="absolute inset-0 rounded-full animate-gradient-shift-slow"
                style={{
                  background: 'var(--theme-send-btn-bg)',
                  backgroundSize: '200% 200%',
                }}
              />
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="relative lg:hidden" aria-hidden="true">
                <path d="M16 22.6663V9.33301M16 9.33301L10.2857 15.0473M16 9.33301L21.7143 15.0473" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="39" height="39" viewBox="0 0 39 39" fill="none" className="relative hidden lg:block" aria-hidden="true">
                <path d="M19.5 27.6251V11.3751M19.5 11.3751L12.5357 18.3394M19.5 11.3751L26.4643 18.3394" stroke="white" strokeWidth="2.27746" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
