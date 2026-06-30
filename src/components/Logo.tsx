// LevelAuto wordmark — red / blue / white on dark (brand reference).
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-semibold tracking-tight text-lg ${className ?? ""}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 22 L16 10 L20 14 L8 26 Z" fill="#DC2626" />
        <path d="M12 22 L24 10 L28 14 L16 26 Z" fill="#2563EB" />
      </svg>
      <span className="text-white">
        Level<span className="text-accent">Auto</span>
      </span>
    </span>
  );
}
