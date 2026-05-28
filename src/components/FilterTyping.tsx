import { useEffect, useRef } from "react";

/**
 * FilterTyping
 * ────────────
 * A self-contained, transparent, responsive web animation that types out
 * a complex filter expression step-by-step in a code editor card. Each
 * typing step is followed by a brief reflow (with a subtle opacity dip)
 * that wraps the prior expression in parentheses and indents it before
 * appending the next clause.
 *
 *   Step 1 ·  {RUN}.status = 'error'
 *   Step 2 ·  + and {RUN}.latency_ms > 1000
 *   Step 3 ·  + or {RUN}.experiment = 'A'
 *   Step 4 ·  + and {RUN}.model_version != 'baseline'
 *               + word_count({RUN}.output) > 50
 *   Step 5 ·  + and not ({RUN}.feedback = 'irrelevant')
 *
 * Drop the component anywhere in your React tree; it fills the parent's
 * width and renders into a cropped 1280×800 viewport (carved from a
 * 1920×1080 stage). The animation timeline runs on a single
 * `requestAnimationFrame` loop with pure-JS easing curves — no animation
 * libraries required.
 *
 * Usage:
 *   <FilterTyping />
 *   <FilterTyping playOnMount maxWidth={1200} />
 *
 * The component automatically:
 *   · scales the stage to fit its container
 *   · plays on scroll-into-view (or immediately when `playOnMount`)
 *   · respects `prefers-reduced-motion` (renders final state, no motion)
 */
export interface FilterTypingProps {
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
  "Animation: a complex filter expression is composed step by step in a code editor — each new clause is typed, then the prior expression is wrapped in parentheses and indented before the next clause is added.";

// ──────────────────────────────────────────────
// Timeline constants (mirror the HyperFrames source).
// ──────────────────────────────────────────────
const STEP1 = "{RUN}.status = 'error'";
const STEP2 = "{RUN}.status = 'error'\nand {RUN}.latency_ms > 1000";
const STEP3_BASE =
  "({RUN}.status = 'error'\nand {RUN}.latency_ms > 1000)\nor ";
const STEP3_ADD = "{RUN}.experiment = 'A'";
const STEP3_FINAL = STEP3_BASE + STEP3_ADD;
const STEP4_BASE_BEFORE =
  "(\n  ({RUN}.status = 'error'\n  and {RUN}.latency_ms > 1000)\n  or (\n    {RUN}.experiment = 'A'\n    ";
const STEP4_BASE_AFTER = "\n  )\n)";
const STEP4_ADD = "and {RUN}.model_version != 'baseline'";
const STEP4_FINAL_BEFORE = STEP4_BASE_BEFORE + STEP4_ADD;
const STEP5_BASE_BEFORE =
  "(\n  (\n    {RUN}.status = 'error'\n    and {RUN}.latency_ms > 1000\n  )\n  or (\n    {RUN}.experiment = 'A'\n    and {RUN}.model_version != 'baseline'\n    and word_count({RUN}.output) > 50\n  )\n)";
const STEP5_ADD = "\nand not ({RUN}.feedback = 'irrelevant')";
const STEP5_FINAL = STEP5_BASE_BEFORE + STEP5_ADD;

const T = {
  type1Start: 0.4,
  type1End: 1.35,
  grow2Start: 1.5,
  grow2Dur: 0.4,
  type2Start: 1.85,
  type2End: 2.85,
  reflow3Start: 3.25,
  reflow3End: 3.65,
  reflow3GrowDur: 0.45,
  type3Start: 3.65,
  type3End: 4.5,
  reflow4Start: 4.95,
  reflow4End: 5.45,
  reflow4GrowDur: 0.55,
  type4Start: 5.45,
  type4End: 6.65,
  reflow5Start: 7.05,
  reflow5End: 7.6,
  reflow5GrowDur: 0.6,
  type5Start: 7.6,
  type5End: 8.9,
  holdEnd: 11.0,
};

// ──────────────────────────────────────────────
// Easing curves (match the GSAP source eases).
// ──────────────────────────────────────────────
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeInQuad = (p: number) => p * p;
const easeOutQuad = (p: number) => 1 - (1 - p) * (1 - p);
const clamp01 = (p: number) => (p < 0 ? 0 : p > 1 ? 1 : p);

// ──────────────────────────────────────────────
// Time-driven render functions.
// Each is a pure function of t (seconds since play start).
// ──────────────────────────────────────────────
function computeText(t: number): { before: string; after: string } {
  if (t < T.type1Start) return { before: "", after: "" };

  if (t < T.type1End) {
    const p = (t - T.type1Start) / (T.type1End - T.type1Start);
    return { before: STEP1.slice(0, Math.round(STEP1.length * p)), after: "" };
  }
  if (t < T.type2Start) return { before: STEP1, after: "" };

  if (t < T.type2End) {
    const p = (t - T.type2Start) / (T.type2End - T.type2Start);
    const targetLen =
      STEP1.length + Math.round((STEP2.length - STEP1.length) * p);
    return { before: STEP2.slice(0, targetLen), after: "" };
  }
  if (t < T.reflow3Start) return { before: STEP2, after: "" };

  if (t < T.reflow3End) {
    const mid = T.reflow3Start + (T.reflow3End - T.reflow3Start) * 0.4;
    return t < mid
      ? { before: STEP2, after: "" }
      : { before: STEP3_BASE, after: "" };
  }
  if (t < T.type3End) {
    const p = (t - T.type3Start) / (T.type3End - T.type3Start);
    const addLen = Math.round(STEP3_ADD.length * p);
    return { before: STEP3_BASE + STEP3_ADD.slice(0, addLen), after: "" };
  }
  if (t < T.reflow4Start) return { before: STEP3_FINAL, after: "" };

  if (t < T.reflow4End) {
    const mid = T.reflow4Start + (T.reflow4End - T.reflow4Start) * 0.4;
    return t < mid
      ? { before: STEP3_FINAL, after: "" }
      : { before: STEP4_BASE_BEFORE, after: STEP4_BASE_AFTER };
  }
  if (t < T.type4End) {
    const p = (t - T.type4Start) / (T.type4End - T.type4Start);
    const addLen = Math.round(STEP4_ADD.length * p);
    return {
      before: STEP4_BASE_BEFORE + STEP4_ADD.slice(0, addLen),
      after: STEP4_BASE_AFTER,
    };
  }
  if (t < T.reflow5Start)
    return { before: STEP4_FINAL_BEFORE, after: STEP4_BASE_AFTER };

  if (t < T.reflow5End) {
    const mid = T.reflow5Start + (T.reflow5End - T.reflow5Start) * 0.4;
    return t < mid
      ? { before: STEP4_FINAL_BEFORE, after: STEP4_BASE_AFTER }
      : { before: STEP5_BASE_BEFORE, after: "" };
  }
  if (t < T.type5End) {
    const p = (t - T.type5Start) / (T.type5End - T.type5Start);
    const addLen = Math.round(STEP5_ADD.length * p);
    return { before: STEP5_BASE_BEFORE + STEP5_ADD.slice(0, addLen), after: "" };
  }
  return { before: STEP5_FINAL, after: "" };
}

function computeEntrance(t: number): { opacity: number; y: number } {
  const dur = 0.55;
  if (t >= dur) return { opacity: 1, y: 0 };
  if (t <= 0) return { opacity: 0, y: 14 };
  const p = easeOutCubic(t / dur);
  return { opacity: p, y: 14 * (1 - p) };
}

function computeHeight(t: number): number {
  if (t < T.grow2Start) return 120;
  if (t < T.grow2Start + T.grow2Dur) {
    const p = clamp01((t - T.grow2Start) / T.grow2Dur);
    return 120 + (168 - 120) * easeInOutCubic(p);
  }
  if (t < T.reflow3Start) return 168;
  if (t < T.reflow3Start + T.reflow3GrowDur) {
    const p = clamp01((t - T.reflow3Start) / T.reflow3GrowDur);
    return 168 + (215 - 168) * easeInOutCubic(p);
  }
  if (t < T.reflow4Start) return 215;
  if (t < T.reflow4Start + T.reflow4GrowDur) {
    const p = clamp01((t - T.reflow4Start) / T.reflow4GrowDur);
    return 215 + (445 - 215) * easeInOutCubic(p);
  }
  if (t < T.reflow5Start) return 445;
  if (t < T.reflow5Start + T.reflow5GrowDur) {
    const p = clamp01((t - T.reflow5Start) / T.reflow5GrowDur);
    return 445 + (630 - 445) * easeInOutCubic(p);
  }
  return 630;
}

function computeDipOpacity(t: number): number {
  // Brief dip-and-restore on each reflow: code fades to 0.3 then back to 1.
  // dipPortion = 35% of the reflow window is the fade-out, 65% is fade-in.
  const dips: { time: number; duration: number }[] = [
    { time: T.reflow3Start, duration: 0.4 },
    { time: T.reflow4Start, duration: 0.5 },
    { time: T.reflow5Start, duration: 0.55 },
  ];
  for (const dip of dips) {
    const t0 = dip.time;
    const dipEnd = t0 + dip.duration * 0.35;
    const restoreEnd = t0 + dip.duration;
    if (t >= t0 && t < dipEnd) {
      const p = (t - t0) / (dipEnd - t0);
      return 1 - 0.7 * easeInQuad(p);
    }
    if (t >= dipEnd && t < restoreEnd) {
      const p = (t - dipEnd) / (restoreEnd - dipEnd);
      return 0.3 + 0.7 * easeOutQuad(p);
    }
  }
  return 1;
}

function computeCursorOpacity(t: number): string {
  // 1Hz blink, 55% on / 45% off.
  const period = 1.0;
  const phase = ((t % period) + period) % period;
  return phase < 0.55 ? "1" : "0";
}

export function FilterTyping({
  playOnMount = false,
  replayOnReenter = false,
  maxWidth,
  className = "",
  ariaLabel = DEFAULT_ARIA_LABEL,
}: FilterTypingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const codeRef = useRef<HTMLPreElement | null>(null);
  const codeBeforeRef = useRef<HTMLSpanElement | null>(null);
  const codeAfterRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const editor = editorRef.current;
    const code = codeRef.current;
    const codeBefore = codeBeforeRef.current;
    const codeAfter = codeAfterRef.current;
    const cursor = cursorRef.current;
    if (
      !container ||
      !stage ||
      !editor ||
      !code ||
      !codeBefore ||
      !codeAfter ||
      !cursor
    ) {
      return;
    }

    const fit = () => {
      const scale = container.clientWidth / 1280;
      stage.style.transform = `scale(${scale}) translate(-320px, -140px)`;
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(container);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showInitialState = () => {
      editor.style.opacity = "0";
      editor.style.transform = "translateY(14px)";
      editor.style.height = "120px";
      code.style.opacity = "1";
      codeBefore.textContent = "";
      codeAfter.textContent = "";
      cursor.style.opacity = "1";
    };

    const showFinalState = () => {
      editor.style.opacity = "1";
      editor.style.transform = "translateY(0px)";
      editor.style.height = "630px";
      code.style.opacity = "1";
      codeBefore.textContent = STEP5_FINAL;
      codeAfter.textContent = "";
      cursor.style.opacity = "0";
    };

    if (reduced) {
      showFinalState();
      return () => ro.disconnect();
    }

    showInitialState();

    let raf: number | null = null;
    let startTime: number | null = null;
    let played = false;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const t = (now - startTime) / 1000;

      const ent = computeEntrance(t);
      editor.style.opacity = String(ent.opacity);
      editor.style.transform = `translateY(${ent.y}px)`;
      editor.style.height = `${computeHeight(t)}px`;
      code.style.opacity = String(computeDipOpacity(t));

      const txt = computeText(t);
      codeBefore.textContent = txt.before;
      codeAfter.textContent = txt.after;
      cursor.style.opacity = computeCursorOpacity(t);

      if (t < T.holdEnd) {
        raf = requestAnimationFrame(tick);
      } else {
        showFinalState();
      }
    };

    const start = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      startTime = null;
      showInitialState();
      raf = requestAnimationFrame(tick);
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
              start();
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
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [playOnMount, replayOnReenter]);

  const style: React.CSSProperties | undefined =
    maxWidth !== undefined ? { maxWidth } : undefined;

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className={`fty ${className}`.trim()}
        role="img"
        aria-label={ariaLabel}
        style={style}
      >
        <div ref={stageRef} className="fty-stage">
          <div className="fty-scene">
            <div ref={editorRef} className="fty-editor">
              <pre ref={codeRef} className="fty-code">
                <span ref={codeBeforeRef} className="fty-code-before" />
                <span ref={cursorRef} className="fty-cursor" />
                <span ref={codeAfterRef} className="fty-code-after" />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterTyping;

// ──────────────────────────────────────────────
// Styles · inlined so the component is drop-in.
// All classes namespaced under `fty-` to avoid
// collisions with the host page.
// ──────────────────────────────────────────────
const styles = /* css */ `
.fty {
  position: relative;
  width: 100%;
  max-width: 1280px;
  aspect-ratio: 1280 / 800;
  background: transparent;
  margin: 0 auto;
  contain: layout paint;
  overflow: hidden;
}
.fty-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  will-change: transform;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fty-scene {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  box-sizing: border-box;
}
.fty-editor {
  width: 1100px;
  height: 120px;
  background: #ffffff;
  border: 1px solid #9ca3af;
  border-radius: 6px;
  padding: 36px 42px;
  box-sizing: border-box;
  box-shadow:
    0 1px 2px rgba(11, 7, 84, 0.04),
    0 18px 48px rgba(11, 7, 84, 0.06);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(14px);
  will-change: opacity, transform, height;
}
.fty-code {
  margin: 0;
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 30px;
  line-height: 1.55;
  color: #0b0754;
  white-space: pre;
  font-variant-ligatures: none;
  letter-spacing: -0.005em;
  will-change: opacity;
}
.fty-code-before,
.fty-code-after {
  display: inline;
}
.fty-cursor {
  display: inline-block;
  width: 3px;
  height: 31px;
  background: #0b0754;
  vertical-align: text-bottom;
  margin-left: 1px;
  transform: translateY(3px);
}

/* Accessibility: surface the diagram in its end state for reduced-motion users. */
@media (prefers-reduced-motion: reduce) {
  .fty-editor {
    opacity: 1 !important;
    transform: none !important;
    height: 630px !important;
  }
  .fty-code {
    opacity: 1 !important;
  }
  .fty-cursor {
    opacity: 0 !important;
  }
}
`;
