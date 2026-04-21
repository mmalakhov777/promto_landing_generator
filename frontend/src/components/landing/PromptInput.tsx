"use client";

import { useRef, useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { executeAndVerify } from "@/lib/smartcaptcha";

interface PromptInputProps {
  placeholder: string;
  ctaText: string;
  platformUrl: string;
  categorySlug: string;
  landingSlug: string;
  metrikaId?: string;
  captchaClientKey?: string;
  apiUrl?: string;
}

export function PromptInput({
  placeholder,
  ctaText,
  platformUrl,
  categorySlug,
  landingSlug,
  metrikaId,
  captchaClientKey,
  apiUrl = "",
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // Track metrika goals
      if (metrikaId) {
        reachGoal(metrikaId, "prompt_submit");
        reachGoal(metrikaId, "cta_click");
      }

      // SmartCaptcha verification (invisible)
      if (captchaClientKey && captchaRef.current && apiUrl) {
        const ok = await executeAndVerify(
          captchaClientKey,
          captchaRef.current,
          apiUrl,
        );
        if (!ok) {
          setSubmitting(false);
          return;
        }
      }

      // Redirect to platform
      const params = new URLSearchParams({
        prompt: prompt || placeholder,
        utm_source: "types",
        utm_medium: "landing",
        utm_campaign: categorySlug,
        utm_content: landingSlug,
      });
      window.location.href = `${platformUrl}?${params.toString()}`;
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-[60px] border border-border bg-surface px-6 py-3.5 text-sm text-text outline-none placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-gradient px-8 py-3.5 text-sm transition-all disabled:opacity-70"
      >
        {ctaText}
      </button>
      {/* Hidden container for invisible SmartCaptcha widget */}
      <div ref={captchaRef} className="hidden" />
    </form>
  );
}
