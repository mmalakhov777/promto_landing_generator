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
    <div ref={ref} className="border-y border-border bg-surface py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4 md:gap-16">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`text-center transition-all duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            <div className="text-2xl font-bold text-primary md:text-3xl">
              {item.value}
            </div>
            <div className="mt-1 text-sm text-text-muted">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
