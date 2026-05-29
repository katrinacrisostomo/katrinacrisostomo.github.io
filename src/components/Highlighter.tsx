import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type HighlighterColor = "yellow" | "pink" | "green" | "blue";

const COLOR_GRADIENTS: Record<HighlighterColor, string> = {
  yellow:
    "linear-gradient(82deg,#f2be2273,#f2be221f 6%,#f2be2240 93%,#f2be2280)",
  pink: "linear-gradient(82deg,#d6409f6b,#d6409f1f 6%,#d6409f38 93%,#d6409f7a)",
  green:
    "linear-gradient(82deg,#2ea06e6b,#2ea06e1f 6%,#2ea06e38 93%,#2ea06e7a)",
  blue: "linear-gradient(82deg,#3884f46b,#3884f41f 6%,#3884f438 93%,#3884f47a)",
};

export type HighlighterProps = {
  children: ReactNode;
  /** Preset highlight ink color. Defaults to yellow. */
  color?: HighlighterColor;
  /** Custom gradient; overrides `color` when set. */
  gradient?: string;
  className?: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Highlighter({
  children,
  color = "yellow",
  gradient,
  className,
}: HighlighterProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsHighlighted(true);
      return;
    }

    const node = markRef.current;
    if (!node) return;

    let played = false;
    let canAnimate = false;

    const playHighlight = () => {
      if (played) return;
      played = true;
      observer.disconnect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsHighlighted(true);
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            canAnimate = true;
            continue;
          }
          if (canAnimate && entry.intersectionRatio >= 0.2) {
            playHighlight();
          }
        }
      },
      {
        threshold: [0, 0.2, 0.35],
        rootMargin: "-20% 0px -20% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const highlightGradient = gradient ?? COLOR_GRADIENTS[color];
  const composedClassName = [
    "highlighter-mark",
    isHighlighted ? "is-highlighted" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    "--highlight-gradient": highlightGradient,
  } as CSSProperties;

  return (
    <span ref={markRef} className={composedClassName} style={style}>
      {children}
    </span>
  );
}
