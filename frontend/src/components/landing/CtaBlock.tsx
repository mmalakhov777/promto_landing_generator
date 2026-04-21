"use client";

import { useRef } from "react";
import { reachGoal } from "@/lib/metrika";
import { PromptInput } from "./PromptInput";

interface CtaBlockProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  platformUrl: string;
  categorySlug: string;
  landingSlug: string;
  placeholder?: string;
  variant?: "mid" | "final";
  metrikaId?: string;
  captchaClientKey?: string;
  apiUrl?: string;
}

export function CtaBlock({
  title,
  subtitle,
  buttonText,
  platformUrl,
  categorySlug,
  landingSlug,
  placeholder,
  variant = "mid",
  metrikaId,
  captchaClientKey,
  apiUrl,
}: CtaBlockProps) {
  const trackedRef = useRef(false);
  const isFinal = variant === "final";

  if (!title) return null;

  const handleLinkClick = () => {
    if (metrikaId && !trackedRef.current) {
      trackedRef.current = true;
      reachGoal(metrikaId, "cta_click");
    }
  };

  return (
    <section className="py-section">
      <div className={`mx-auto max-w-6xl px-4 ${isFinal ? "" : ""}`}>
        <div className={`rounded-[32px] px-8 py-16 text-center md:px-16 ${
          isFinal
            ? "relative overflow-hidden bg-secondary"
            : "relative overflow-hidden bg-surface shadow-card"
        }`}>
          {isFinal ? (
            <>
              {/* Decorative gradient orbs for dark final CTA */}
              <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-30 blur-[80px]" style={{ background: '#464EFF' }} />
              <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-30 blur-[80px]" style={{ background: '#5EFF6E' }} />
              <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[60px]" style={{ background: '#E478FF' }} />
            </>
          ) : (
            <>
              <div className="absolute -top-10 right-0 h-40 w-40 rounded-full opacity-10 blur-[60px]" style={{ background: '#464EFF' }} />
              <div className="absolute -bottom-10 left-0 h-40 w-40 rounded-full opacity-10 blur-[60px]" style={{ background: '#5EFF6E' }} />
            </>
          )}
          {/* Urgency icon */}
          <div className="relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[14px]" style={{
            background: isFinal
              ? 'linear-gradient(196deg, #575EFF 0%, #E478FF 91%)'
              : 'linear-gradient(196deg, #FFD478 0%, #FF9854 91%)'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/arrow-up.svg" alt="" width={24} height={24} className="brightness-0 invert" />
          </div>
          <div className={`relative text-[38px] font-medium leading-[1.12] ${isFinal ? "text-white" : "text-text"}`}>
            {title}
          </div>
          {subtitle && (
            <p className={`relative mt-4 text-base ${isFinal ? "text-white/70" : "text-text-muted"}`}>
              {subtitle}
            </p>
          )}
          <div className="relative mt-8 flex justify-center">
            {placeholder ? (
              <PromptInput
                placeholder={placeholder}
                ctaText={buttonText || title}
                platformUrl={platformUrl}
                categorySlug={categorySlug}
                landingSlug={landingSlug}
                metrikaId={metrikaId}
                captchaClientKey={captchaClientKey}
                apiUrl={apiUrl}
              />
            ) : (
              <a
                href={`${platformUrl}?utm_source=types&utm_medium=landing&utm_campaign=${categorySlug}&utm_content=${landingSlug}`}
                rel="nofollow noopener"
                onClick={handleLinkClick}
                className="btn-gradient px-10 py-4 text-sm"
              >
                {buttonText || title}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
