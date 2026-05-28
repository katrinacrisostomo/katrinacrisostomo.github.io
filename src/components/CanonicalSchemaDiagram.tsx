import { useEffect, useRef } from "react";

/**
 * CanonicalSchemaDiagram
 * ──────────────────────
 * A self-contained, transparent, responsive web animation showing why a
 * single "View logs with errors" preset could not reliably map to three
 * customer datasets whose error signals lived under different column names
 * (`status`, `error_type`, `level` + `is_error`). Dashed connector lines
 * extend from the preset toward each dataset but stop short, with a "?"
 * badge filling the gap to visualize the broken mapping.
 *
 * Drop the component anywhere in your React tree; it fills the parent's
 * width and renders into a cropped 1520×750 viewport (carved from a
 * 1920×1080 stage) so the diagram doesn't carry excess padding above,
 * below, or to the sides of the visible content. The animation timeline
 * uses CSS keyframes for fades and a tiny rAF driver only for the SVG
 * line endpoints (SVG attributes can't be animated via CSS).
 *
 * Usage:
 *   <CanonicalSchemaDiagram />
 *   <CanonicalSchemaDiagram playOnMount maxWidth={1200} />
 *
 * The component automatically:
 *   · scales the 1920×1080 stage to fit its container
 *   · plays on scroll-into-view (or immediately when `playOnMount`)
 *   · respects `prefers-reduced-motion` (renders final state, no motion)
 */
export interface CanonicalSchemaDiagramProps {
  /** Play immediately on mount instead of waiting for scroll-into-view. */
  playOnMount?: boolean;
  /** Replay the animation each time the component re-enters the viewport. */
  replayOnReenter?: boolean;
  /** Cap the rendered width (e.g. `1200` or `"80%"`). Defaults to 1920px. */
  maxWidth?: number | string;
  /** Extra className applied to the outer container. */
  className?: string;
  /** Accessibility label override. */
  ariaLabel?: string;
}

const DEFAULT_ARIA_LABEL =
  "Diagram: a 'View logs with errors' preset button at top connects via dashed lines to three customer datasets — Dataset A with a 'status' column, Dataset B with an 'error_type' column, and Dataset C with 'level' and 'is_error' columns. A question-mark badge sits in the gap above each dataset, illustrating that without a canonical schema the preset cannot reliably know which column to filter on.";

// Line endpoint targets (1920×1080 stage coordinates).
// Origin (x1, y1) is the preset bottom edge; (x2, y2) is the line tip
// 60 px above each dataset card, leaving room for the "?" badge.
const LINE_TARGETS = [
  { sel: ".csd-line--a", x1: 960, y1: 224, x2: 480, y2: 400, delay: 2.05 },
  { sel: ".csd-line--b", x1: 960, y1: 224, x2: 960, y2: 400, delay: 2.1 },
  { sel: ".csd-line--c", x1: 960, y1: 224, x2: 1440, y2: 400, delay: 2.15 },
] as const;

const LINE_DURATION_MS = 750;
const LINE_FADE_MS = 250;

// power2.inOut from GSAP, hand-rolled so the runtime stays dependency-free.
function easeInOutPower2(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function runLineAnimations(stage: HTMLElement, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    for (const target of LINE_TARGETS) {
      const el = stage.querySelector<SVGLineElement>(target.sel);
      if (!el) continue;
      el.setAttribute("x2", String(target.x2));
      el.setAttribute("y2", String(target.y2));
      el.style.opacity = "1";
    }
    return () => undefined;
  }

  const t0 = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const elapsed = now - t0;
    let stillRunning = false;

    for (const target of LINE_TARGETS) {
      const el = stage.querySelector<SVGLineElement>(target.sel);
      if (!el) continue;

      const localElapsed = elapsed - target.delay * 1000;

      const fade = Math.max(0, Math.min(1, localElapsed / LINE_FADE_MS));
      el.style.opacity = String(fade);

      const drawT = Math.max(
        0,
        Math.min(1, localElapsed / LINE_DURATION_MS),
      );
      const eased = easeInOutPower2(drawT);
      el.setAttribute("x2", String(target.x1 + (target.x2 - target.x1) * eased));
      el.setAttribute("y2", String(target.y1 + (target.y2 - target.y1) * eased));

      if (drawT < 1 || fade < 1) stillRunning = true;
    }

    if (stillRunning) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function resetLines(stage: HTMLElement) {
  for (const target of LINE_TARGETS) {
    const el = stage.querySelector<SVGLineElement>(target.sel);
    if (!el) continue;
    el.setAttribute("x2", String(target.x1));
    el.setAttribute("y2", String(target.y1));
    el.style.opacity = "0";
  }
}

export function CanonicalSchemaDiagram({
  playOnMount = false,
  replayOnReenter = false,
  maxWidth,
  className = "",
  ariaLabel = DEFAULT_ARIA_LABEL,
}: CanonicalSchemaDiagramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fit = () => {
      const scale = container.clientWidth / 1520;
      stage.style.transform = `scale(${scale}) translate(-200px, -40px)`;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);

    let played = false;
    let cancelLines: (() => void) | undefined;

    const start = () => {
      stage.classList.add("is-playing");
      cancelLines?.();
      resetLines(stage);
      cancelLines = runLineAnimations(stage, prefersReducedMotion);
    };

    const restart = () => {
      stage.classList.remove("is-playing");
      void stage.offsetWidth;
      start();
    };

    let io: IntersectionObserver | null = null;

    if (playOnMount) {
      start();
      played = true;
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (!played) {
              played = true;
              start();
            } else if (replayOnReenter) {
              restart();
            }
          });
        },
        { threshold: 0.35 },
      );
      io.observe(container);
    }

    return () => {
      ro.disconnect();
      io?.disconnect();
      cancelLines?.();
    };
  }, [playOnMount, replayOnReenter]);

  const style: React.CSSProperties | undefined =
    maxWidth !== undefined ? { maxWidth } : undefined;

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className={`csd ${className}`.trim()}
        role="img"
        aria-label={ariaLabel}
        style={style}
      >
        <div ref={stageRef} className="csd-stage">
          {/* Soft accent glow behind the preset button */}
          <div className="csd-glow-wrap">
            <div className="csd-glow" />
          </div>

          {/* Preset filter button — the source of the (failed) mapping */}
          <div className="csd-preset-wrap">
            <div className="csd-preset-button">
              <span className="csd-preset-dot" />
              <span className="csd-preset-label">View logs with errors</span>
              <svg
                className="csd-preset-chevron"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  d="M4 2 L8 6 L4 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/*
            Dashed connector lines. Endpoints start collapsed at the preset
            bottom edge; the JS runtime animates x2/y2 outward toward each
            card, stopping 60 px short so a "?" can fill the gap.
          */}
          <svg
            className="csd-connectors"
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            aria-hidden="true"
          >
            <line
              className="csd-line csd-line--a"
              x1="960"
              y1="224"
              x2="960"
              y2="224"
            />
            <line
              className="csd-line csd-line--b"
              x1="960"
              y1="224"
              x2="960"
              y2="224"
            />
            <line
              className="csd-line csd-line--c"
              x1="960"
              y1="224"
              x2="960"
              y2="224"
            />
          </svg>

          {/* Three customer datasets — each with a different error-signal column */}
          <div className="csd-card csd-card--a">
            <div className="csd-card-header">Dataset A</div>
            <div className="csd-card-divider" />
            <div className="csd-column-chip">status</div>
          </div>
          <div className="csd-card csd-card--b">
            <div className="csd-card-header">Dataset B</div>
            <div className="csd-card-divider" />
            <div className="csd-column-chip">error_type</div>
          </div>
          <div className="csd-card csd-card--c">
            <div className="csd-card-header">Dataset C</div>
            <div className="csd-card-divider" />
            <div className="csd-column-chip">level</div>
            <div className="csd-column-chip">is_error</div>
          </div>

          {/* "?" badges — broken-mapping markers floating in each gap */}
          <div className="csd-question-mark csd-q--a" aria-hidden="true">
            ?
          </div>
          <div className="csd-question-mark csd-q--b" aria-hidden="true">
            ?
          </div>
          <div className="csd-question-mark csd-q--c" aria-hidden="true">
            ?
          </div>
        </div>
      </div>
    </>
  );
}

export default CanonicalSchemaDiagram;

// ──────────────────────────────────────────────
// Styles · inlined so the component is drop-in.
// All classes are namespaced under `csd-` to avoid
// host-page collisions.
// ──────────────────────────────────────────────
const styles = /* css */ `
.csd {
  position: relative;
  width: 100%;
  max-width: 1520px;
  aspect-ratio: 1520 / 750;
  background: transparent;
  margin: 0 auto;
  contain: layout paint;
  overflow: hidden;
}
.csd-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  will-change: transform;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1f36;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "ss01", "cv11", "ss03";
}

/* ── Soft accent glow behind the preset ── */
.csd-glow-wrap {
  position: absolute;
  top: 110px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}
.csd-glow {
  width: 720px;
  height: 200px;
  background: radial-gradient(
    ellipse closest-side,
    rgba(99, 91, 255, 0.12),
    rgba(99, 91, 255, 0) 70%
  );
  opacity: 0;
  border-radius: 50%;
  will-change: opacity;
}

/* ── Preset filter button ── */
.csd-preset-wrap {
  position: absolute;
  top: 168px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 4;
}
.csd-preset-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 22px;
  background: #ffffff;
  border: 1px solid #e6e9ee;
  border-radius: 10px;
  box-shadow:
    0 1px 2px 0 rgba(15, 22, 41, 0.04),
    0 6px 16px -4px rgba(50, 50, 93, 0.07);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #0a2540;
  letter-spacing: -0.012em;
  opacity: 0;
  will-change: transform, opacity;
}
.csd-preset-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ed5f74;
  box-shadow: 0 0 0 4px rgba(237, 95, 116, 0.14);
  flex-shrink: 0;
}
.csd-preset-chevron { color: #8792a2; flex-shrink: 0; }

/* ── Broken-mapping connector lines (SVG) ── */
.csd-connectors {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}
.csd-line {
  fill: none;
  stroke: #a5b0c4;
  stroke-width: 1.5;
  stroke-dasharray: 6 8;
  stroke-linecap: round;
  opacity: 0;
  will-change: opacity;
}

/* ── Dataset cards ── */
.csd-card {
  position: absolute;
  width: 400px;
  height: 300px;
  background: #ffffff;
  border: 1px solid #e6e9ee;
  border-radius: 12px;
  box-shadow:
    0 1px 2px 0 rgba(15, 22, 41, 0.04),
    0 10px 28px -10px rgba(50, 50, 93, 0.07);
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
  opacity: 0;
  will-change: transform, opacity;
}
.csd-card--a { left: 280px;  top: 460px; }
.csd-card--b { left: 760px;  top: 460px; }
.csd-card--c { left: 1240px; top: 460px; }

.csd-card-header {
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #687385;
}
.csd-card-divider {
  height: 1px;
  background: #eef0f5;
  margin: -6px -32px 0;
}
.csd-column-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f7f8fb;
  border: 1px solid #eaecf3;
  border-radius: 8px;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 19px;
  font-weight: 500;
  color: #1a1f36;
  width: fit-content;
  letter-spacing: -0.005em;
}

/* ── Question-mark badges ── */
.csd-question-mark {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px dashed rgba(99, 91, 255, 0.45);
  color: #635bff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  box-shadow:
    0 1px 2px 0 rgba(15, 22, 41, 0.04),
    0 4px 10px -3px rgba(99, 91, 255, 0.12);
  opacity: 0;
  will-change: opacity, transform;
}
.csd-q--a { left: 458px;  top: 410px; }
.csd-q--b { left: 938px;  top: 410px; }
.csd-q--c { left: 1418px; top: 410px; }

/* ──────────────────────────────────────────────
   Animation timeline (matches the HyperFrames source)

   1.  0.20s · Preset button rises in              (power3.out, 0.65s)
   2.  0.35s · Glow blooms underneath              (power2.out, 0.80s)
   3.  1.00–1.20s · Three dataset cards rise in   (power3.out, 0.60s, 100ms stagger)
   4.  2.05–2.15s · Lines extend outward + fade   (JS-driven, see runLineAnimations)
   5.  2.70–2.90s · "?" badges fade + scale in    (power2.out, 0.55s, 100ms stagger)
   ────────────────────────────────────────────── */

@keyframes csd-rise-8  { from { opacity: 0; transform: translateY(8px); }  to { opacity: 1; transform: translateY(0); } }
@keyframes csd-rise-14 { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes csd-fade-in { from { opacity: 0; }                              to { opacity: 1; } }
@keyframes csd-pop     { from { opacity: 0; transform: scale(0.85); }       to { opacity: 1; transform: scale(1); } }

/* GSAP easing → CSS cubic-bezier
   power3.out   → cubic-bezier(0.215, 0.61, 0.355, 1)
   power2.out   → cubic-bezier(0.25, 0.46, 0.45, 0.94) */

.csd-stage.is-playing .csd-preset-button { animation: csd-rise-8  0.65s cubic-bezier(0.215, 0.61, 0.355, 1) 0.20s forwards; }
.csd-stage.is-playing .csd-glow          { animation: csd-fade-in 0.80s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s forwards; }

.csd-stage.is-playing .csd-card--a { animation: csd-rise-14 0.60s cubic-bezier(0.215, 0.61, 0.355, 1) 1.00s forwards; }
.csd-stage.is-playing .csd-card--b { animation: csd-rise-14 0.60s cubic-bezier(0.215, 0.61, 0.355, 1) 1.10s forwards; }
.csd-stage.is-playing .csd-card--c { animation: csd-rise-14 0.60s cubic-bezier(0.215, 0.61, 0.355, 1) 1.20s forwards; }

.csd-stage.is-playing .csd-q--a { animation: csd-pop 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.70s forwards; }
.csd-stage.is-playing .csd-q--b { animation: csd-pop 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.80s forwards; }
.csd-stage.is-playing .csd-q--c { animation: csd-pop 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.90s forwards; }

/* Reduced-motion: render the final state, no animation. */
@media (prefers-reduced-motion: reduce) {
  .csd-preset-button,
  .csd-glow,
  .csd-card,
  .csd-question-mark,
  .csd-line {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
}
`;
