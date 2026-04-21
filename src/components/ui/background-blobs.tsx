interface Blob {
  x: number;
  y: number;
  size: number;
  /** CSS blur = Figma blur / 2 (Figma uses radius, CSS uses sigma) */
  blur: number;
  opacity: number;
}

/* Desktop blobs (1440×7789 frame) — blur values halved from Figma */
const desktopBlobs: Blob[] = [
  { x: -525, y: 566, size: 761, blur: 90.89, opacity: 0.5 },
  { x: 1151, y: 17, size: 955.08, blur: 114.06, opacity: 0.5 },
  { x: 1151, y: 1986, size: 955.08, blur: 114.06, opacity: 0.5 },
  { x: -525, y: 6121, size: 761, blur: 90.89, opacity: 0.5 },
  { x: 1151, y: 5408, size: 955.08, blur: 114.06, opacity: 0.5 },
  { x: 97.92, y: 7644, size: 764.08, blur: 91.25, opacity: 0.5 },
];

/*
 * Mobile blobs (375×9716 Figma frame) — blur(80px) per Figma.
 * Y positions stored as percentage of Figma frame height so they
 * scale with the actual rendered page height.
 *
 * Figma positions → percentage of 9716px:
 *   y:282   → 2.90%   (hero top-right)
 *   y:631   → 6.49%   (hero left)
 *   y:5609  → 57.73%  (advantages/pricing area, right)
 *   y:6705  → 69.00%  (pricing/FAQ area, left)
 *   y:7393  → 76.08%  (FAQ/footer area, right)
 *   y:9495  → 97.73%  (footer bottom, left)
 */
interface MobileBlob {
  x: number;
  /** Y as percentage of total page height */
  yPercent: number;
  size: number;
  blur: number;
  opacity: number;
}

const mobileBlobs: MobileBlob[] = [
  { x: 281, yPercent: 2.90, size: 543, blur: 80, opacity: 0.5 },
  { x: -477, yPercent: 6.49, size: 543, blur: 80, opacity: 0.5 },
  { x: 176.54, yPercent: 57.73, size: 767.92, blur: 80, opacity: 0.5 },
  { x: -559.08, yPercent: 69.00, size: 767.92, blur: 80, opacity: 0.5 },
  { x: 202, yPercent: 76.08, size: 741.75, blur: 80, opacity: 0.5 },
  { x: -95, yPercent: 97.73, size: 741.75, blur: 80, opacity: 0.5 },
];

export function BackgroundBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {desktopBlobs.map((blob, i) => (
        <div
          key={`d-${i}`}
          className="hidden lg:block absolute rounded-full animate-blob"
          style={{
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            opacity: blob.opacity,
            background: `linear-gradient(200deg, var(--theme-blob-color-1) 21%, var(--theme-blob-color-2) 88%)`,
            filter: `blur(${blob.blur}px)`,
            animationDelay: `${i * -3}s`,
          }}
        />
      ))}
      {mobileBlobs.map((blob, i) => (
        <div
          key={`m-${i}`}
          className="lg:hidden absolute rounded-full animate-blob"
          style={{
            left: blob.x,
            top: `${blob.yPercent}%`,
            width: blob.size,
            height: blob.size,
            opacity: blob.opacity,
            background: `linear-gradient(200deg, var(--theme-blob-color-1) 21%, var(--theme-blob-color-2) 88%)`,
            filter: `blur(${blob.blur}px)`,
            animationDelay: `${i * -3}s`,
          }}
        />
      ))}
    </div>
  );
}
