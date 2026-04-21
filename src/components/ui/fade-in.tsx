'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasHydrated]);

  return (
    <div
      ref={ref}
      className={cn(hasHydrated && !isVisible && 'opacity-0', className)}
      style={
        hasHydrated
          ? {
              transitionProperty: 'opacity, transform',
              transitionDuration: '0.8s',
              transitionTimingFunction: 'ease-out',
              transitionDelay: delay ? `${delay}ms` : '0ms',
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
