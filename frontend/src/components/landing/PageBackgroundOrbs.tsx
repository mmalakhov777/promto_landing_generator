/**
 * Decorative gradient orbs for the full page background.
 * Matches Figma node 1-503 (desktop) and 1-1006 (mobile).
 *
 * Desktop: 6 large orbs (761–955px, blur 180–228px, opacity 0.5)
 * Mobile:  Smaller orbs (300–400px, blur 80–100px, opacity 0.3)
 *          pushed further off-screen to create a subtle ambient glow
 *          without overwhelming the 390px viewport.
 */
export function PageBackgroundOrbs() {
  const gradient = "linear-gradient(200deg, rgba(70,78,255,1) 21%, rgba(94,255,110,1) 88%)";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* Orb 1 — top-right */}
      <div
        className="absolute top-0 -right-[150px] h-[300px] w-[300px] rounded-full opacity-30 lg:-right-[200px] lg:h-[955px] lg:w-[955px] lg:opacity-50"
        style={{ background: gradient, filter: "var(--orb-blur-sm)" }}
      />

      {/* Orb 2 — left, below hero */}
      <div
        className="absolute top-[7%] -left-[200px] h-[300px] w-[300px] rounded-full opacity-30 lg:-left-[525px] lg:h-[761px] lg:w-[761px] lg:opacity-50"
        style={{ background: gradient, filter: "var(--orb-blur-sm)" }}
      />

      {/* Orb 3 — right, middle (hidden on mobile to reduce clutter) */}
      <div
        className="absolute top-[25%] -right-[150px] hidden h-[955px] w-[955px] rounded-full opacity-50 lg:block lg:-right-[200px]"
        style={{ background: gradient, filter: "var(--orb-blur-lg)" }}
      />

      {/* Orb 4 — right, lower */}
      <div
        className="absolute top-[69%] -right-[150px] h-[300px] w-[300px] rounded-full opacity-30 lg:-right-[200px] lg:h-[955px] lg:w-[955px] lg:opacity-50"
        style={{ background: gradient, filter: "var(--orb-blur-sm)" }}
      />

      {/* Orb 5 — left, near bottom (hidden on mobile) */}
      <div
        className="absolute top-[79%] -left-[525px] hidden h-[761px] w-[761px] rounded-full opacity-50 lg:block"
        style={{ background: gradient, filter: "var(--orb-blur-lg)" }}
      />

      {/* Orb 6 — bottom-left */}
      <div
        className="absolute bottom-0 -left-[150px] h-[300px] w-[300px] rounded-full opacity-30 lg:-left-[200px] lg:h-[764px] lg:w-[764px] lg:opacity-50"
        style={{ background: gradient, filter: "var(--orb-blur-sm)" }}
      />
    </div>
  );
}
