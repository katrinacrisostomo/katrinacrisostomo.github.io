import { useEffect, useId, useRef } from "react";

/**
 * QueryBuilderDiagram
 * ───────────────────
 * A self-contained, transparent, responsive web animation showing a central
 * "Query Builder" card linked outward to four product surfaces:
 *   · Logs · Dashboards · Evals · Segments
 *
 * Drop the component anywhere in your React tree; it fills the parent's
 * width and renders into a cropped 1440×800 viewport (carved from a 1920×1080
 * stage). The animation timeline uses pure CSS keyframes — no animation
 * libraries required.
 *
 * Usage:
 *   <QueryBuilderDiagram />
 *   <QueryBuilderDiagram playOnMount maxWidth={1200} />
 *
 * The component automatically:
 *   · scales the stage to fit its container
 *   · plays on scroll-into-view (or immediately when `playOnMount`)
 *   · respects `prefers-reduced-motion` (renders final state, no motion)
 */
export interface QueryBuilderDiagramProps {
  /** Play immediately on mount instead of waiting for scroll-into-view. */
  playOnMount?: boolean;
  /** Replay the animation each time the component re-enters the viewport. */
  replayOnReenter?: boolean;
  /** Cap the rendered width. Defaults to the cropped stage width. */
  maxWidth?: number | string;
  /** Extra className applied to the outer container. */
  className?: string;
  /** Accessibility label override. */
  ariaLabel?: string;
}

const DEFAULT_ARIA_LABEL =
  "Diagram: a central Query Builder card connects outward via thin lines to four product surfaces — Logs, Dashboards, Evals, and Segments — illustrating that one structured query powers many surfaces.";

export function QueryBuilderDiagram({
  playOnMount = false,
  replayOnReenter = false,
  maxWidth,
  className = "",
  ariaLabel = DEFAULT_ARIA_LABEL,
}: QueryBuilderDiagramProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const gradId = (name: string) =>
    `qbd-grad-${reactId.replace(/:/g, "")}-${name}`;

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const fit = () => {
      const scale = container.clientWidth / 1440;
      stage.style.transform = `scale(${scale}) translate(-240px, -140px)`;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);

    let played = false;
    let io: IntersectionObserver | null = null;

    if (playOnMount) {
      stage.classList.add("is-playing");
      played = true;
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (!played) {
              played = true;
              stage.classList.add("is-playing");
            } else if (replayOnReenter) {
              stage.classList.remove("is-playing");
              // Force reflow to restart the CSS animations.
              void stage.offsetWidth;
              stage.classList.add("is-playing");
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
    };
  }, [playOnMount, replayOnReenter]);

  const style: React.CSSProperties | undefined =
    maxWidth !== undefined ? { maxWidth } : undefined;

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className={`qbd ${className}`.trim()}
        role="img"
        aria-label={ariaLabel}
        style={style}
      >
        <div ref={stageRef} className="qbd-stage">
          <svg
            className="qbd-connectors"
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={gradId("n")}
                gradientUnits="userSpaceOnUse"
                x1="960"
                y1="480"
                x2="960"
                y2="268"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(135,145,165,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("e")}
                gradientUnits="userSpaceOnUse"
                x1="1150"
                y1="540"
                x2="1370"
                y2="540"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(135,145,165,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("s")}
                gradientUnits="userSpaceOnUse"
                x1="960"
                y1="600"
                x2="960"
                y2="812"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(135,145,165,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("w")}
                gradientUnits="userSpaceOnUse"
                x1="770"
                y1="540"
                x2="550"
                y2="540"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(135,145,165,0.30)" />
              </linearGradient>
            </defs>

            <line
              className="qbd-line qbd-line--n"
              x1="960"
              y1="480"
              x2="960"
              y2="268"
              stroke={`url(#${gradId("n")})`}
              pathLength="100"
            />
            <line
              className="qbd-line qbd-line--e"
              x1="1150"
              y1="540"
              x2="1370"
              y2="540"
              stroke={`url(#${gradId("e")})`}
              pathLength="100"
            />
            <line
              className="qbd-line qbd-line--s"
              x1="960"
              y1="600"
              x2="960"
              y2="812"
              stroke={`url(#${gradId("s")})`}
              pathLength="100"
            />
            <line
              className="qbd-line qbd-line--w"
              x1="770"
              y1="540"
              x2="550"
              y2="540"
              stroke={`url(#${gradId("w")})`}
              pathLength="100"
            />
          </svg>

          <div className="qbd-qb-wrap">
            <div className="qbd-qb-glow" />
            <div className="qbd-qb-card">
              <div className="qbd-qb-label">Query Builder</div>
            </div>
          </div>

          <div className="qbd-card qbd-card--n">
            <div className="qbd-card-label">Logs</div>
          </div>
          <div className="qbd-card qbd-card--e">
            <div className="qbd-card-label">Dashboards</div>
          </div>
          <div className="qbd-card qbd-card--s">
            <div className="qbd-card-label">Evals</div>
          </div>
          <div className="qbd-card qbd-card--w">
            <div className="qbd-card-label">Segments</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QueryBuilderDiagram;

// ──────────────────────────────────────────────
// Styles · inlined so the component is drop-in.
// All classes are namespaced under `qbd-` to avoid
// host-page collisions.
// ──────────────────────────────────────────────
const styles = /* css */ `
.qbd {
  position: relative;
  width: 100%;
  max-width: 1440px;
  aspect-ratio: 1440 / 800;
  background: transparent;
  margin: 0 auto;
  contain: layout paint;
  overflow: hidden;
}
.qbd-stage {
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

/* Connector lines (SVG) */
.qbd-connectors {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}
.qbd-line {
  fill: none;
  stroke-width: 1.25;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}

/* Surface cards (Logs, Dashboards, Evals, Segments) */
.qbd-card {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e6e9ee;
  border-radius: 10px;
  box-shadow:
    0 1px 2px 0 rgba(15, 22, 41, 0.04),
    0 4px 12px -2px rgba(50, 50, 93, 0.05);
  z-index: 2;
  width: 240px;
  height: 76px;
  opacity: 0;
  will-change: transform, opacity;
}
.qbd-card-label {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: #1a1f36;
}
.qbd-card--n { left: 840px;  top: 192px; }   /* Logs */
.qbd-card--e { left: 1370px; top: 502px; }   /* Dashboards */
.qbd-card--s { left: 840px;  top: 812px; }   /* Evals */
.qbd-card--w { left: 310px;  top: 502px; }   /* Segments */

/* Central Query Builder */
.qbd-qb-wrap {
  position: absolute;
  left: 770px;
  top: 480px;
  width: 380px;
  height: 120px;
  z-index: 3;
}
.qbd-qb-glow {
  position: absolute;
  inset: -100px;
  background: radial-gradient(
    closest-side,
    rgba(99, 91, 255, 0.13),
    rgba(99, 91, 255, 0) 70%
  );
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
  will-change: opacity;
}
.qbd-qb-card {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #dfe2ee;
  border-radius: 16px;
  box-shadow:
    0 1px 2px 0 rgba(15, 22, 41, 0.05),
    0 8px 24px -6px rgba(99, 91, 255, 0.12),
    0 4px 12px -3px rgba(50, 50, 93, 0.06);
  z-index: 1;
  opacity: 0;
  will-change: transform, opacity;
}
/* Subtle accent gradient border on the central card */
.qbd-qb-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(99, 91, 255, 0.45),
    rgba(99, 91, 255, 0) 55%,
    rgba(99, 91, 255, 0.18) 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
.qbd-qb-label {
  font-size: 32px;
  font-weight: 600;
  color: #0a2540;
  letter-spacing: -0.02em;
}

/* ──────────────────────────────────────────────
   Animation timeline (matches the HyperFrames source)

   1.  0.10s  · QB card fades + lifts in           (power3.out, 0.65s)
   2.  0.40s  · QB glow blooms                     (power2.out,  0.7s)
   3.  0.95–1.10s · Lines draw outward N→E→S→W    (power2.inOut, 0.65s, 50ms stagger)
   4.  1.55–1.70s · Surface cards fade in          (power2.out,  0.5s, 50ms stagger)
   ────────────────────────────────────────────── */

@keyframes qbd-rise    { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes qbd-rise-sm { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes qbd-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes qbd-draw    { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

/* Easing curves chosen to match the GSAP source:
   power3.out  → cubic-bezier(0.215, 0.61, 0.355, 1)
   power2.out  → cubic-bezier(0.25, 0.46, 0.45, 0.94)
   power2.inOut → cubic-bezier(0.45, 0, 0.55, 1)                                */

.qbd-stage.is-playing .qbd-qb-card  { animation: qbd-rise    0.65s cubic-bezier(0.215, 0.61, 0.355, 1) 0.10s forwards; }
.qbd-stage.is-playing .qbd-qb-glow  { animation: qbd-fade-in 0.70s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.40s forwards; }

.qbd-stage.is-playing .qbd-line--n  { animation: qbd-draw    0.65s cubic-bezier(0.45, 0, 0.55, 1) 0.95s forwards; }
.qbd-stage.is-playing .qbd-line--e  { animation: qbd-draw    0.65s cubic-bezier(0.45, 0, 0.55, 1) 1.00s forwards; }
.qbd-stage.is-playing .qbd-line--s  { animation: qbd-draw    0.65s cubic-bezier(0.45, 0, 0.55, 1) 1.05s forwards; }
.qbd-stage.is-playing .qbd-line--w  { animation: qbd-draw    0.65s cubic-bezier(0.45, 0, 0.55, 1) 1.10s forwards; }

.qbd-stage.is-playing .qbd-card--n  { animation: qbd-rise-sm 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.55s forwards; }
.qbd-stage.is-playing .qbd-card--e  { animation: qbd-rise-sm 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.60s forwards; }
.qbd-stage.is-playing .qbd-card--s  { animation: qbd-rise-sm 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.65s forwards; }
.qbd-stage.is-playing .qbd-card--w  { animation: qbd-rise-sm 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.70s forwards; }

/* Accessibility: surface the diagram in its end state for reduced-motion users. */
@media (prefers-reduced-motion: reduce) {
  .qbd-qb-card,
  .qbd-qb-glow,
  .qbd-card {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
  .qbd-line {
    stroke-dashoffset: 0;
    animation: none !important;
  }
}
`;
