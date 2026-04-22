/**
 * Decorative gradient orbs for the full page background.
 * Matches Figma node 1-503 (landing page_b2c desktop) where 6 ellipses
 * are placed at the root frame level spanning the entire page height.
 *
 * All orbs use:
 * - Fill: linear-gradient(200deg, #464EFF 21%, #5EFF6E 88%)
 * - Opacity: 0.5
 * - Large blur (180–230px)
 * - Positioned partially off-screen left/right to create ambient glow
 */
export function PageBackgroundOrbs() {
  const gradient = "linear-gradient(200deg, rgba(70,78,255,1) 21%, rgba(94,255,110,1) 88%)";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* Orb 1 — top-right (Figma: x:1151 y:17, 955px, blur:228px) */}
      <div
        className="absolute top-0 -right-[200px] h-[955px] w-[955px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(228px)" }}
      />

      {/* Orb 2 — left, below hero (Figma: x:-525 y:566, 761px, blur:182px) */}
      <div
        className="absolute top-[7%] -left-[525px] h-[761px] w-[761px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(182px)" }}
      />

      {/* Orb 3 — right, middle (Figma: x:1151 y:1986, 955px, blur:228px) */}
      <div
        className="absolute top-[25%] -right-[200px] h-[955px] w-[955px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(228px)" }}
      />

      {/* Orb 4 — right, lower (Figma: x:1151 y:5408, 955px, blur:228px) */}
      <div
        className="absolute top-[69%] -right-[200px] h-[955px] w-[955px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(228px)" }}
      />

      {/* Orb 5 — left, near bottom (Figma: x:-525 y:6121, 761px, blur:182px) */}
      <div
        className="absolute top-[79%] -left-[525px] h-[761px] w-[761px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(182px)" }}
      />

      {/* Orb 6 — bottom-left (Figma: x:98 y:7644, 764px, blur:183px) */}
      <div
        className="absolute bottom-0 -left-[200px] h-[764px] w-[764px] rounded-full opacity-50"
        style={{ background: gradient, filter: "blur(183px)" }}
      />
    </div>
  );
}
