'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AGENTS } from '@/lib/constants';
import { Plus } from '@/components/icons/plus';
import { Minus } from '@/components/icons/minus';
import { Star } from '@/components/icons/star';

export function AgentCounterCards() {
  const [counts, setCounts] = useState(() => AGENTS.map(() => 1));

  const updateCount = (idx: number, delta: number) => {
    setCounts((prev) => prev.map((c, i) => (i === idx ? Math.max(0, c + delta) : c)));
  };

  return (
    <div className="flex items-end gap-2 lg:gap-3">
      {AGENTS.map((agent, i) => {
        const isFeatured = i === 1;
        return (
          <div
            key={agent.label}
            className={cn(
              'rounded-[12px] lg:rounded-[17px] bg-bg-card p-3 lg:p-4 flex flex-col',
              isFeatured ? 'w-[100px] lg:w-[194px] shadow-card-lg' : 'w-[86px] lg:w-[166px] shadow-card',
            )}
          >
            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-[8px] bg-subtle flex items-center justify-center mb-3 lg:mb-4">
              <Star size={14} className="text-brand-blue" />
            </div>
            <p className="text-[11px] lg:text-sm font-medium text-text-primary leading-tight truncate">{agent.label.split(' ')[0]}</p>
            <p className="text-[9px] lg:text-[10px] text-text-placeholder mt-0.5">{agent.price}</p>
            <div className="flex items-center gap-1 mt-3 lg:mt-4">
              <button
                onClick={() => updateCount(i, -1)}
                className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-subtle flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                aria-label={`Убрать ${agent.label}`}
              >
                <Minus size={10} className="text-text-secondary" />
              </button>
              <span className="text-xs font-medium text-text-primary w-4 text-center">{counts[i]}</span>
              <button
                onClick={() => updateCount(i, 1)}
                className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                style={{ background: 'linear-gradient(2deg, rgba(70,78,255,1) 0%, rgba(94,255,110,1) 100%)' }}
                aria-label={`Добавить ${agent.label}`}
              >
                <Plus size={10} className="text-white" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
