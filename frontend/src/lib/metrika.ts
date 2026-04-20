/**
 * Yandex Metrika goal tracking utility.
 *
 * Usage:
 *   reachGoal("12345", "cta_click");
 */

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function reachGoal(metrikaId: string, goal: string): void {
  if (typeof window !== "undefined" && metrikaId && window.ym) {
    window.ym(Number(metrikaId), "reachGoal", goal);
  }
}
