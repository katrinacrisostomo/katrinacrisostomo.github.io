import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  type CursorTooltipVariant,
  useCursorTooltipState,
} from "./CursorTooltip";

const TOOLTIP_VARIANT_STYLE: Record<
  CursorTooltipVariant,
  { background: string; foreground: string }
> = {
  primary: { background: "var(--color-primary)", foreground: "#ffffff" },
  secondary: { background: "var(--color-secondary)", foreground: "#000000" },
  tertiary: { background: "var(--color-tertiary)", foreground: "#000000" },
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const tooltip = useCursorTooltipState();
  const tooltipStyle = tooltip
    ? TOOLTIP_VARIANT_STYLE[tooltip.variant]
    : TOOLTIP_VARIANT_STYLE.primary;
  const hasTooltip = Boolean(tooltip);
  const hasIcon = Boolean(tooltip?.icon);

  const tooltipBubbleStyle = useMemo(
    () => ({
      backgroundColor: tooltipStyle.background,
      color: tooltipStyle.foreground,
      opacity: hasTooltip ? 1 : 0,
      transform: hasTooltip
        ? "translate3d(0, -50%, 0) scale(1)"
        : "translate3d(-8px, -50%, 0) scale(0.94)",
    }),
    [hasTooltip, tooltipStyle.background, tooltipStyle.foreground],
  );

  const cursorDotStyle = useMemo(
    () => ({
      opacity: hasTooltip ? 0 : 1,
      transform: hasTooltip ? "scale(0.65)" : "scale(1)",
    }),
    [hasTooltip],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!pointerQuery.matches || reducedMotionQuery.matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const cursor = cursorRef.current;
    if (!cursor) {
      root.classList.remove("custom-cursor-active");
      return;
    }

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;
    let isVisible = false;

    const flushPosition = () => {
      rafId = 0;
      cursor.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;

      if (!isVisible) {
        cursor.style.opacity = "1";
        isVisible = true;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") {
        return;
      }

      nextX = e.clientX;
      nextY = e.clientY;

      if (!rafId) {
        rafId = window.requestAnimationFrame(flushPosition);
      }
    };

    const onLeave = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      if (isVisible) {
        cursor.style.opacity = "0";
        isVisible = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onLeave();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0 will-change-transform"
      aria-hidden
    >
      <span
        className="block h-3.5 w-3.5 rounded-full bg-primary shadow-sm transition-[opacity,transform] duration-150 ease-out"
        style={cursorDotStyle}
      />
      <div
        className="absolute left-4 top-1/2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider whitespace-nowrap shadow-sm transition-[opacity,transform,background-color,color] duration-150 ease-out"
        style={tooltipBubbleStyle}
      >
        {hasIcon ? (
          <span className="flex h-3.5 w-3.5 items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">
            {tooltip?.icon}
          </span>
        ) : null}
        <span>{tooltip?.label}</span>
      </div>
    </div>
  );
}
