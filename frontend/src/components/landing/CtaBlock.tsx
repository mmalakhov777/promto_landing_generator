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
    <section
      className={`py-section ${
        isFinal ? "bg-primary text-white" : "bg-surface"
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className={`text-3xl font-bold ${isFinal ? "text-white" : "text-text"}`}>
          {title}
        </div>
        {subtitle && (
          <p className={`mt-4 text-lg ${isFinal ? "text-white/80" : "text-text-muted"}`}>
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex justify-center">
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
              className={`rounded-xl px-8 py-3 text-sm font-medium transition-colors ${
                isFinal
                  ? "bg-white text-primary hover:bg-primary-light"
                  : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {buttonText || title}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
