// LevelAuto lockup — vectorized from the brand artwork.
// The "LEVEL" mark is exact geometry (traced, line-fitted, mirror-symmetric
// about x=314); the "AUTO" line is set in the body face so it stays crisp at
// any size. Colors come from the design tokens in globals.css.

const RED = [
  "M69.11 0L86 0L86 4.26L33 101L27.63 113L124.39 113L128.44 115.27L137.4 130L2.67 130L0.52 127.85L9 110Z",
  "M619 110L627.48 127.85L625.33 130L490.6 130L499.56 115.27L503.61 113L600.37 113L595 101L542 4.26L542 0L558.89 0Z",
];

const BLUE =
  "M314 144.58L246.29 17L113.47 17L105.09 0L256.76 0L312.36 106L315.64 106L371.24 0L522.91 0L514.53 17L381.71 17Z";

const WHITE = [
  "M126.91 52L241.93 52L246.4 57.4L252.37 70L135.57 70L130 61Z",
  "M498 61L492.43 70L375.63 70L381.6 57.4L386.07 52L501.09 52Z",
  "M148.71 113L274.04 113L282.1 129.43L163 130L157.09 129Z",
  "M470.91 129L465 130L345.9 129.43L353.96 113L479.29 113Z",
];

// Ink centers of the four glyphs, measured off the artwork.
const AUTO: [string, number][] = [
  ["A", 229.5],
  ["U", 287],
  ["T", 342.5],
  ["O", 397.5],
];

type LogoProps = {
  className?: string;
  /** `full` adds the "— AUTO —" line; `mark` is the LEVEL chevron alone. */
  variant?: "full" | "mark";
};

export function Logo({ className, variant = "full" }: LogoProps) {
  const full = variant === "full";

  return (
    <svg
      viewBox={full ? "0 0 628 183" : "0 0 628 145"}
      role="img"
      aria-label="LevelAuto"
      className={className ?? "h-9 w-auto"}
    >
      {RED.map((d) => (
        <path key={d} d={d} fill="var(--accent)" />
      ))}
      <path d={BLUE} fill="var(--secondary)" />
      {WHITE.map((d) => (
        <path key={d} d={d} fill="var(--foreground)" />
      ))}

      {full && (
        <g fill="var(--foreground)">
          <rect x="20" y="171" width="177" height="3" />
          <rect x="431" y="171" width="177" height="3" />
          {AUTO.map(([ch, x]) => (
            <text
              key={ch}
              x={x}
              y={183}
              textAnchor="middle"
              fontFamily="var(--font-manrope), sans-serif"
              fontSize={29}
              fontWeight={300}
            >
              {ch}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
