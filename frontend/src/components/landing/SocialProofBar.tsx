"use client";

import { useEffect, useRef, useState } from "react";
import type { SocialProofItem } from "@/types/public";

interface SocialProofBarProps {
  items: SocialProofItem[];
}

export function SocialProofBar({ items }: SocialProofBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  return (
    <div ref={ref} className="py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-10 px-4 md:gap-20">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 text-center transition-all duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={["/icons/people.svg", "/icons/like.svg", "/icons/income.svg", "/icons/arrow-up.svg"][idx % 4]}
                alt=""
                width={18}
                height={18}
                style={{ filter: 'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(4800%) hue-rotate(233deg) brightness(100%) contrast(101%)' }}
              />
            </div>
            <div className="text-left">
              <div className="text-2xl font-medium text-gradient md:text-3xl">
                {item.value}
              </div>
              <div className="mt-0.5 text-sm text-text-muted">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
