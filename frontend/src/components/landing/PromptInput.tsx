"use client";

import { useState } from "react";

interface PromptInputProps {
  placeholder: string;
  ctaText: string;
  platformUrl: string;
  categorySlug: string;
  landingSlug: string;
}

export function PromptInput({
  placeholder,
  ctaText,
  platformUrl,
  categorySlug,
  landingSlug,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      prompt: prompt || placeholder,
      utm_source: "types",
      utm_medium: "landing",
      utm_campaign: categorySlug,
      utm_content: landingSlug,
    });
    window.location.href = `${platformUrl}?${params.toString()}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
      />
      <button
        type="submit"
        className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover active:scale-[0.98] transition-all"
      >
        {ctaText}
      </button>
    </form>
  );
}
