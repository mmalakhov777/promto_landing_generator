"use client";

import { useState } from "react";

interface VideoSectionProps {
  title: string;
  videoUrl: string;
}

export function VideoSection({ title, videoUrl }: VideoSectionProps) {
  const [loaded, setLoaded] = useState(false);

  if (!videoUrl) return null;

  // Extract YouTube/Rutube embed URL
  const embedUrl = getEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <section className="bg-surface py-section">
      <div className="mx-auto max-w-4xl px-4">
        {title && (
          <h2 className="mb-8 text-center text-3xl font-bold text-text">{title}</h2>
        )}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-secondary">
          {loaded ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          ) : (
            <button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 flex items-center justify-center transition-opacity hover:opacity-80"
              aria-label="Play video"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg">
                <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  // Rutube
  const rtMatch = url.match(/rutube\.ru\/video\/([a-f0-9]+)/);
  if (rtMatch) return `https://rutube.ru/play/embed/${rtMatch[1]}`;

  // Already an embed URL
  if (url.includes("embed")) return url;

  return null;
}
