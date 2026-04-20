"use client";

import { useEffect } from "react";

interface YandexMetrikaProps {
  id: string;
}

/**
 * Loads Yandex Metrika counter script and initializes tracking.
 * Skips loading when `?preview=true` (admin preview mode).
 */
export function YandexMetrika({ id }: YandexMetrikaProps) {
  useEffect(() => {
    if (!id) return;

    // Skip in admin preview mode
    if (new URLSearchParams(window.location.search).get("preview") === "true") {
      return;
    }

    // Initialize ym command queue
    window.ym =
      window.ym ||
      function (...args: unknown[]) {
        (window.ym as unknown as { a: unknown[][] }).a =
          (window.ym as unknown as { a: unknown[][] }).a || [];
        (window.ym as unknown as { a: unknown[][] }).a.push(args);
      };

    window.ym(Number(id), "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });

    // Load the script
    const script = document.createElement("script");
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [id]);

  if (!id) return null;

  return (
    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://mc.yandex.ru/watch/${id}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
}
