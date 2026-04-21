"use client";

import { useRef, useState } from "react";
import { reachGoal } from "@/lib/metrika";
import { executeAndVerify } from "@/lib/smartcaptcha";
import { getUtmParams } from "@/lib/utm";

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
      if (metrikaId) {
        reachGoal(metrikaId, "prompt_submit");
        reachGoal(metrikaId, "cta_click");
      }

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

      const utm = getUtmParams("hero", landingSlug, "send_prompt");
      const params = new URLSearchParams({
        prompt: prompt || placeholder,
        ...utm,
      });
      window.location.href = `${platformUrl}?${params.toString()}`;
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[700px]">
      {/* Outer gradient border container */}
      <div className="relative rounded-[24px] p-[1.5px]" style={{ background: 'linear-gradient(4deg, rgba(70, 78, 255, 1) 10%, rgba(94, 255, 110, 1) 100%)' }}>
        {/* Inner white area */}
        <div className="rounded-[22.5px] bg-white px-7 pt-6 pb-5">
          {/* Text input area */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full resize-none bg-transparent text-base leading-[1.24] text-text outline-none placeholder:text-text-light"
          />

          {/* Bottom toolbar */}
          <div className="mt-2 flex items-center gap-1">
            {/* Plus / attach button */}
            <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center text-text-light transition-colors hover:text-text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/add-plus.svg" alt="" width={28} height={28} className="opacity-70" />
            </button>

            {/* Agent selector (decorative) */}
            <button type="button" className="flex items-center gap-0.5 text-text-light transition-colors hover:text-text-muted">
              <span className="text-base font-medium">{ctaText}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/caret-down.svg" alt="" width={28} height={28} className="opacity-70" />
            </button>

            <div className="flex-1" />

            {/* Microphone icon */}
            <button type="button" className="flex h-7 w-7 shrink-0 items-center justify-center text-text-light transition-colors hover:text-text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/microphone.svg" alt="" width={28} height={28} className="opacity-70" />
            </button>

            {/* Send button — gradient circle */}
            <button
              type="submit"
              disabled={submitting}
              className="ml-1 flex h-[39px] w-[39px] shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-50 hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(196deg, #5EFF6E 0%, #464EFF 71%)' }}
              aria-label="Отправить"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 15.75V2.25M9 2.25L3.375 7.875M9 2.25L14.625 7.875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden container for invisible SmartCaptcha widget */}
      <div ref={captchaRef} className="hidden" />
    </form>
  );
}
