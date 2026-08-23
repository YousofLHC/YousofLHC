import type { CSSProperties, ReactNode } from "react";

/**
 * CSS-first reveal: content is fully visible without JavaScript — the entrance
 * animation runs via a pure CSS keyframe on mount. This guarantees nothing on
 * the page is ever blank while JS/hydration loads (critical for slow links).
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const style = {
    "--ry": `${y}px`,
    animationDelay: `${delay}s`,
  } as CSSProperties;
  return (
    <div className={`reveal${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
