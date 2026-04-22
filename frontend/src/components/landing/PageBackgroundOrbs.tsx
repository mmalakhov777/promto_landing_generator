/**
 * Decorative gradient orbs for the full page background.
 * Matches Figma node 1-503 (desktop) and 1-1006 (mobile).
 *
 * Desktop (lg+): 6 large orbs with Figma-exact sizes and blur.
 * Mobile (<lg):  4 smaller orbs, stronger blur, lower opacity,
 *                pushed further off-screen for a subtle ambient glow.
 */
export function PageBackgroundOrbs() {
  const gradient = "linear-gradient(200deg, rgba(70,78,255,1) 21%, rgba(94,255,110,1) 88%)";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Orb 1 — top-right */}
      <div
        className="absolute top-0 -right-[250px] h-[400px] w-[400px] rounded-full opacity-20 blur-[150px] lg:-right-[200px] lg:h-[955px] lg:w-[955px] lg:opacity-50 lg:blur-[228px]"
        style={{ background: gradient }}
      />

      {/* Orb 2 — left, below hero */}
      <div
        className="absolute top-[7%] -left-[300px] h-[400px] w-[400px] rounded-full opacity-20 blur-[150px] lg:-left-[525px] lg:h-[761px] lg:w-[761px] lg:opacity-50 lg:blur-[182px]"
        style={{ background: gradient }}
      />

      {/* Orb 3 — right, middle (desktop only) */}
      <div
        className="absolute top-[25%] -right-[200px] hidden rounded-full lg:block lg:h-[955px] lg:w-[955px] lg:opacity-50 lg:blur-[228px]"
        style={{ background: gradient }}
      />

      {/* Orb 4 — right, lower */}
      <div
        className="absolute top-[69%] -right-[250px] h-[400px] w-[400px] rounded-full opacity-20 blur-[150px] lg:-right-[200px] lg:h-[955px] lg:w-[955px] lg:opacity-50 lg:blur-[228px]"
        style={{ background: gradient }}
      />

      {/* Orb 5 — left, near bottom (desktop only) */}
      <div
        className="absolute top-[79%] -left-[525px] hidden rounded-full lg:block lg:h-[761px] lg:w-[761px] lg:opacity-50 lg:blur-[182px]"
        style={{ background: gradient }}
      />

      {/* Orb 6 — bottom-left */}
      <div
        className="absolute bottom-0 -left-[250px] h-[400px] w-[400px] rounded-full opacity-20 blur-[150px] lg:-left-[200px] lg:h-[764px] lg:w-[764px] lg:opacity-50 lg:blur-[183px]"
        style={{ background: gradient }}
      />
    </div>
  );
}
