import { useEffect, useId, useRef } from "react";

/**
 * QueryStructureComparison
 * ────────────────────────
 * A self-contained, transparent, responsive web animation comparing
 *   · Raw query string  → 1 outcome (Execute query)
 *   · Structured query  → 4 outcomes (Execute · Save · Re-render · Reuse across surfaces)
 *
 * Drop the component anywhere in your React tree; it fills the parent's
 * width and maintains a 1920×1080 (16:9) aspect ratio. The animation
 * timeline uses pure CSS keyframes — no animation libraries required.
 *
 * Usage:
 *   <QueryStructureComparison />
 *   <QueryStructureComparison playOnMount maxWidth={1200} />
 *
 * The component automatically:
 *   · scales the 1920×1080 stage to fit its container
 *   · plays on scroll-into-view (or immediately when `playOnMount`)
 *   · respects `prefers-reduced-motion` (renders final state, no motion)
 */
export interface QueryStructureComparisonProps {
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
  "Diagram: a raw query string flows to a single Execute action, while a structured query object (Column, Operator, Value) flows to four actions — Execute, Save, Re-render, and Reuse across surfaces — illustrating the product leverage gained from structured data.";

export function QueryStructureComparison({
  playOnMount = false,
  replayOnReenter = false,
  maxWidth,
  className = "",
  ariaLabel = DEFAULT_ARIA_LABEL,
}: QueryStructureComparisonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const gradId = (name: string) => `qsc-grad-${reactId.replace(/:/g, "")}-${name}`;

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const fit = () => {
      const scale = container.clientWidth / 1760;
      stage.style.transform = `scale(${scale}) translate(-100px, -60px)`;
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
        className={`qsc ${className}`.trim()}
        role="img"
        aria-label={ariaLabel}
        style={style}
      >
        <div ref={stageRef} className="qsc-stage">
          <div className="qsc-glow" />

          <div className="qsc-eyebrow qsc-eyebrow--left">
            <span className="qsc-dash" />
            As a string
            <span className="qsc-dash" />
          </div>
          <div className="qsc-eyebrow qsc-eyebrow--right">
            <span className="qsc-dash" />
            As structured data
            <span className="qsc-dash" />
          </div>

          <svg
            className="qsc-connectors"
            width="1920"
            height="1080"
            viewBox="0 0 1920 1080"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={gradId("left")}
                gradientUnits="userSpaceOnUse"
                x1="480"
                y1="448"
                x2="480"
                y2="600"
              >
                <stop offset="0%" stopColor="rgba(120,132,156,0.55)" />
                <stop offset="100%" stopColor="rgba(120,132,156,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("rExecute")}
                gradientUnits="userSpaceOnUse"
                x1="1440"
                y1="460"
                x2="1110"
                y2="600"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(120,132,156,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("rSave")}
                gradientUnits="userSpaceOnUse"
                x1="1440"
                y1="460"
                x2="1285"
                y2="600"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(120,132,156,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("rRender")}
                gradientUnits="userSpaceOnUse"
                x1="1440"
                y1="460"
                x2="1470"
                y2="600"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(120,132,156,0.30)" />
              </linearGradient>
              <linearGradient
                id={gradId("rReuse")}
                gradientUnits="userSpaceOnUse"
                x1="1440"
                y1="460"
                x2="1719"
                y2="600"
              >
                <stop offset="0%" stopColor="rgba(99,91,255,0.55)" />
                <stop offset="100%" stopColor="rgba(120,132,156,0.30)" />
              </linearGradient>
            </defs>

            <line
              className="qsc-line qsc-line--left"
              x1="480"
              y1="448"
              x2="480"
              y2="600"
              stroke={`url(#${gradId("left")})`}
              pathLength="100"
            />
            <line
              className="qsc-line qsc-line--r-execute"
              x1="1440"
              y1="460"
              x2="1110"
              y2="600"
              stroke={`url(#${gradId("rExecute")})`}
              pathLength="100"
            />
            <line
              className="qsc-line qsc-line--r-save"
              x1="1440"
              y1="460"
              x2="1285"
              y2="600"
              stroke={`url(#${gradId("rSave")})`}
              pathLength="100"
            />
            <line
              className="qsc-line qsc-line--r-render"
              x1="1440"
              y1="460"
              x2="1470"
              y2="600"
              stroke={`url(#${gradId("rRender")})`}
              pathLength="100"
            />
            <line
              className="qsc-line qsc-line--r-reuse"
              x1="1440"
              y1="460"
              x2="1719"
              y2="600"
              stroke={`url(#${gradId("rReuse")})`}
              pathLength="100"
            />
          </svg>

          <div className="qsc-card qsc-card--left">
            <div className="qsc-header">Raw query string</div>
            <div className="qsc-code">
              <span className="qsc-quote">&quot;</span>
              <span className="qsc-col">status</span>
              <span className="qsc-op"> = </span>
              <span className="qsc-str">&apos;error&apos;</span>{" "}
              <span className="qsc-kw">AND</span>{" "}
              <span className="qsc-col">latency</span>
              <span className="qsc-op"> &gt; </span>
              <span className="qsc-num">1000</span>
              <span className="qsc-quote">&quot;</span>
            </div>
          </div>
          <div className="qsc-pill qsc-pill--left">Execute query</div>

          <div className="qsc-card qsc-card--right">
            <div className="qsc-header">Structured query</div>
            <div className="qsc-row qsc-row--column">
              <div className="qsc-row-label">Column</div>
              <div className="qsc-row-value">trace.latency_ms</div>
            </div>
            <div className="qsc-row qsc-row--operator">
              <div className="qsc-row-label">Operator</div>
              <div className="qsc-row-value qsc-accent">&gt;</div>
            </div>
            <div className="qsc-row qsc-row--value">
              <div className="qsc-row-label">Value</div>
              <div className="qsc-row-value">1000</div>
            </div>
          </div>
          <div className="qsc-pill qsc-pill--execute">Execute</div>
          <div className="qsc-pill qsc-pill--save">Save</div>
          <div className="qsc-pill qsc-pill--render">Re-render</div>
          <div className="qsc-pill qsc-pill--reuse">Reuse across surfaces</div>
        </div>
      </div>
    </>
  );
}

export default QueryStructureComparison;

// ──────────────────────────────────────────────
// Styles · inlined so the component is drop-in.
// All classes are namespaced under `qsc-` to avoid
// host-page collisions.
// ──────────────────────────────────────────────
const styles = /* css */ `
.qsc {
  position: relative;
  width: 100%;
  max-width: 1760px;
  aspect-ratio: 1760 / 680;
  background: transparent;
  margin: 0 auto;
  contain: layout paint;
  overflow: hidden;
}
.qsc-stage {
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
  font-feature-settings: "ss01", "cv11";
}

.qsc-eyebrow {
  position: absolute;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #697386;
  text-align: center;
  opacity: 0;
  will-change: transform, opacity;
}
.qsc-eyebrow--left  { left: 180px;  top: 232px; width: 600px; }
.qsc-eyebrow--right { left: 1140px; top: 120px; width: 600px; }
.qsc-dash {
  display: inline-block;
  width: 18px;
  height: 1px;
  background: #c1c9d2;
  vertical-align: middle;
  margin: 0 12px 4px;
}

.qsc-connectors {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.qsc-line {
  fill: none;
  stroke-width: 1.25;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}

.qsc-card {
  position: absolute;
  background: #ffffff;
  border-radius: 14px;
  z-index: 2;
  opacity: 0;
  will-change: transform, opacity;
}
.qsc-card--left {
  left: 180px; top: 280px;
  width: 600px; height: 168px;
  border: 1px solid #e3e8ee;
  box-shadow:
    0 4px 14px 0 rgba(50, 50, 93, 0.05),
    0 1px 3px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.qsc-card--right {
  left: 1140px; top: 180px;
  width: 600px; height: 280px;
  border: 1px solid #dcddff;
  box-shadow:
    0 8px 24px 0 rgba(99, 91, 255, 0.1),
    0 2px 6px 0 rgba(50, 50, 93, 0.06),
    0 1px 2px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.qsc-card--right::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 14px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(99, 91, 255, 0.55), rgba(99, 91, 255, 0) 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

.qsc-glow {
  position: absolute;
  left: 1040px; top: 80px;
  width: 800px; height: 540px;
  background: radial-gradient(closest-side, rgba(99, 91, 255, 0.16), rgba(99, 91, 255, 0) 72%);
  opacity: 0;
  pointer-events: none;
  border-radius: 50%;
  z-index: 0;
  will-change: transform, opacity;
  transform: scale(0.82);
  transform-origin: 50% 50%;
}

.qsc-header {
  padding: 18px 26px 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #697386;
  border-bottom: 1px solid #f1f3f5;
  position: relative;
  z-index: 2;
}

.qsc-code {
  padding: 30px 28px;
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 22px;
  line-height: 1;
  color: #0a2540;
  letter-spacing: -0.005em;
  white-space: nowrap;
}
.qsc-quote { color: #697386; }
.qsc-col   { color: #1a1f36; }
.qsc-op    { color: #635bff; }
.qsc-str   { color: #cd3d64; }
.qsc-kw    { color: #697386; font-weight: 600; }
.qsc-num   { color: #0a2540; }

.qsc-row {
  display: flex;
  align-items: center;
  padding: 18px 28px;
  border-bottom: 1px solid #f1f3f5;
  position: relative;
  z-index: 2;
  opacity: 0;
  will-change: transform, opacity;
}
.qsc-row:last-child { border-bottom: none; }
.qsc-row-label {
  width: 130px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #697386;
}
.qsc-row-value {
  flex: 1;
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 20px;
  color: #0a2540;
  letter-spacing: -0.005em;
}
.qsc-row-value.qsc-accent { color: #635bff; }

.qsc-pill {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e3e8ee;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: #1a1f36;
  box-shadow:
    0 2px 5px 0 rgba(50, 50, 93, 0.05),
    0 1px 2px 0 rgba(0, 0, 0, 0.04);
  height: 72px;
  z-index: 2;
  opacity: 0;
  will-change: transform, opacity;
}
.qsc-pill--left    { left: 330px;  top: 600px; width: 300px; }
.qsc-pill--execute { left: 1040px; top: 600px; width: 140px; }
.qsc-pill--save    { left: 1230px; top: 600px; width: 110px; }
.qsc-pill--render  { left: 1390px; top: 600px; width: 160px; }
.qsc-pill--reuse   { left: 1599px; top: 600px; width: 240px; font-size: 20px; }

@keyframes qsc-fade-in    { from { opacity: 0; transform: translateY(4px);  } to { opacity: 1; transform: translateY(0); } }
@keyframes qsc-rise       { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes qsc-rise-sm    { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: translateY(0); } }
@keyframes qsc-rise-pill  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
@keyframes qsc-draw       { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
@keyframes qsc-glow-in    { from { opacity: 0; transform: scale(0.82); } to { opacity: 1; transform: scale(1); } }
@keyframes qsc-glow-breathe {
  0%, 100% { opacity: 1;    transform: scale(1);    }
  50%      { opacity: 0.78; transform: scale(1.04); }
}

.qsc-stage.is-playing .qsc-eyebrow--left   { animation: qsc-fade-in   0.55s cubic-bezier(0.25, 1, 0.5, 1)       0.15s forwards; }
.qsc-stage.is-playing .qsc-eyebrow--right  { animation: qsc-fade-in   0.55s cubic-bezier(0.25, 1, 0.5, 1)       0.25s forwards; }
.qsc-stage.is-playing .qsc-card--left      { animation: qsc-rise      0.7s  cubic-bezier(0.215, 0.61, 0.355, 1) 0.35s forwards; }
.qsc-stage.is-playing .qsc-card--right     { animation: qsc-rise      0.7s  cubic-bezier(0.16, 1, 0.3, 1)       0.45s forwards; }
.qsc-stage.is-playing .qsc-row--column     { animation: qsc-rise-sm   0.5s  cubic-bezier(0.25, 1, 0.5, 1)       0.95s forwards; }
.qsc-stage.is-playing .qsc-row--operator   { animation: qsc-rise-sm   0.5s  cubic-bezier(0.25, 1, 0.5, 1)       1.15s forwards; }
.qsc-stage.is-playing .qsc-row--value      { animation: qsc-rise-sm   0.5s  cubic-bezier(0.25, 1, 0.5, 1)       1.35s forwards; }
.qsc-stage.is-playing .qsc-line--left      { animation: qsc-draw      0.85s cubic-bezier(0.45, 0, 0.55, 1)      2s    forwards; }
.qsc-stage.is-playing .qsc-pill--left      { animation: qsc-rise-pill 0.55s cubic-bezier(0.25, 1, 0.5, 1)       2.55s forwards; }
.qsc-stage.is-playing .qsc-glow {
  animation:
    qsc-glow-in       1.3s cubic-bezier(0.25, 1, 0.5, 1) 2.4s forwards,
    qsc-glow-breathe  4.5s ease-in-out                   3.8s infinite;
}
.qsc-stage.is-playing .qsc-line--r-render  { animation: qsc-draw      0.7s  cubic-bezier(0.45, 0, 0.55, 1)      2.7s  forwards; }
.qsc-stage.is-playing .qsc-line--r-save    { animation: qsc-draw      0.7s  cubic-bezier(0.45, 0, 0.55, 1)      2.8s  forwards; }
.qsc-stage.is-playing .qsc-line--r-reuse   { animation: qsc-draw      0.75s cubic-bezier(0.45, 0, 0.55, 1)      2.9s  forwards; }
.qsc-stage.is-playing .qsc-line--r-execute { animation: qsc-draw      0.75s cubic-bezier(0.45, 0, 0.55, 1)      3s    forwards; }
.qsc-stage.is-playing .qsc-pill--render    { animation: qsc-rise-pill 0.5s  cubic-bezier(0.25, 1, 0.5, 1)       3.25s forwards; }
.qsc-stage.is-playing .qsc-pill--save      { animation: qsc-rise-pill 0.5s  cubic-bezier(0.25, 1, 0.5, 1)       3.35s forwards; }
.qsc-stage.is-playing .qsc-pill--reuse     { animation: qsc-rise-pill 0.5s  cubic-bezier(0.25, 1, 0.5, 1)       3.45s forwards; }
.qsc-stage.is-playing .qsc-pill--execute   { animation: qsc-rise-pill 0.5s  cubic-bezier(0.25, 1, 0.5, 1)       3.55s forwards; }

@media (prefers-reduced-motion: reduce) {
  .qsc-eyebrow,
  .qsc-card,
  .qsc-pill,
  .qsc-row,
  .qsc-glow {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
  .qsc-glow {
    transform: scale(1);
  }
  .qsc-line {
    stroke-dashoffset: 0;
    animation: none !important;
  }
}
`;
