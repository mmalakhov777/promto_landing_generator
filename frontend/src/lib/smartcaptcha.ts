/**
 * Yandex SmartCaptcha (invisible mode) integration.
 *
 * Loads the SmartCaptcha script and provides a function to execute
 * the invisible captcha challenge + server-side verification.
 */

declare global {
  interface Window {
    smartCaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          invisible: boolean;
          callback: (token: string) => void;
          hl?: string;
        },
      ) => number;
      execute: (widgetId: number) => void;
      reset: (widgetId: number) => void;
    };
  }
}

let scriptLoaded = false;

function loadScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.smartCaptcha) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src*="smartcaptcha.yandexcloud.net"]',
    );
    if (existing) {
      existing.addEventListener("load", () => {
        scriptLoaded = true;
        resolve();
      });
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://smartcaptcha.yandexcloud.net/captcha.js?render=onload";
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load SmartCaptcha"));
    document.head.appendChild(script);
  });
}

/**
 * Execute invisible captcha and verify token on the server.
 *
 * @returns true if verification passed or captcha is not configured.
 */
export async function executeAndVerify(
  clientKey: string,
  container: HTMLElement,
  apiUrl: string,
): Promise<boolean> {
  if (!clientKey) return true; // no captcha configured — pass through

  try {
    await loadScript();

    if (!window.smartCaptcha) return true; // script failed — don't block user

    const token = await new Promise<string>((resolve, reject) => {
      const widgetId = window.smartCaptcha!.render(container, {
        sitekey: clientKey,
        invisible: true,
        callback: (t: string) => resolve(t),
      });
      window.smartCaptcha!.execute(widgetId);

      // Timeout after 30s
      setTimeout(() => reject(new Error("Captcha timeout")), 30_000);
    });

    const params = new URLSearchParams({ token });
    const resp = await fetch(`${apiUrl}/api/v1/captcha/verify?${params}`, {
      method: "POST",
    });
    const data = await resp.json();
    return data.ok === true;
  } catch {
    // On any error, don't block the user (graceful degradation)
    return true;
  }
}
