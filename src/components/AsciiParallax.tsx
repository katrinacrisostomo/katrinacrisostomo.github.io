import React, { useEffect, useRef, useState } from "react";
import {
  prepareWithSegments,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";

type AsciiParallaxProps = {
  rowCount?: number;
  rowHeight?: number;
  fontSize?: number;
  className?: string;
};

type MeasuredGrapheme = {
  key: string;
  glyph: string;
  baseX: number;
  width: number;
  isSpace: boolean;
  isStar: boolean;
};

type PatternRow = {
  id: string;
  color: string;
  speed: number;
  patternWidth: number;
  patternChars: MeasuredGrapheme[];
};

type RenderRow = {
  id: string;
  color: string;
  speed: number;
  patternWidth: number;
  chars: MeasuredGrapheme[];
};

type PointerState = {
  x: number;
  y: number;
  targetIntensity: number;
  intensity: number;
};

const DEFAULT_ROW_COUNT = 6;
const DEFAULT_ROW_HEIGHT = 22;
const DEFAULT_FONT_SIZE = 16;
const ROW_SPEEDS = [60, -40, 22, -14, 30, -55] as const;
const ROW_COLOR = "var(--color-primary, #99104B)";
const SYMBOL_POOL = [
  "*",
  "+",
  ".",
  ",",
  ":",
  ";",
  "'",
  '"',
  "`",
  "^",
  "~",
  "o",
  // 'O',
  "(",
  ")",
  "{",
  "}",
  "<",
  ">",
  "/",
  "\\",
  // '-',
  // '_',
  // '=',
  "|",
  "…",
  "⋅",
  "°",
  "☆",
];
const FONT_FAMILY =
  'var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
const PRETEXT_FONT_FAMILY = '"IBM Plex Mono", ui-monospace, monospace';
const REPEL_RADIUS = 110;
const REPEL_SIGMA = 72;
const REPEL_STRENGTH = 14;
const BASE_CHAR_OPACITY = 0.82;
const STAR_SYMBOL = "☆";
const STAR_BASE_SCALE = 1;
const POINTER_INTENSITY_EASE = 10;

function createSeededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function splitGraphemes(segment: string, segmenter: Intl.Segmenter): string[] {
  const graphemes: string[] = [];
  for (const part of segmenter.segment(segment)) {
    graphemes.push(part.segment);
  }
  return graphemes;
}

function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

function randomInt(
  random: () => number,
  minInclusive: number,
  maxInclusive: number,
): number {
  return (
    Math.floor(random() * (maxInclusive - minInclusive + 1)) + minInclusive
  );
}

function getRowDensity(rowIndex: number, rowCount: number): number {
  if (rowCount <= 1) {
    return 1;
  }

  const center = (rowCount - 1) / 2;
  const normalizedDistance = Math.abs(rowIndex - center) / Math.max(center, 1);
  return Math.max(0, 1 - normalizedDistance);
}

function buildRowText(
  seed: number,
  tokenCount: number,
  density: number,
  edgeSparsityBoost: boolean,
): string {
  const random = createSeededRandom(seed);
  let result = "";
  const skipChance = Math.min(
    0.92,
    lerp(0.36, 0.08, density) + (edgeSparsityBoost ? 0.08 : 0),
  );
  const clusterChance = Math.min(
    0,
    lerp(0.08, 0.38, density) + (edgeSparsityBoost ? 0.04 : 0),
  );
  const minGap = Math.max(
    1,
    Math.round(lerp(3, 1, density)) + (edgeSparsityBoost ? 1 : 0),
  );
  const maxGap = Math.max(
    minGap,
    Math.round(lerp(7, 3, density)) + (edgeSparsityBoost ? 2 : 0),
  );
  const sparseRunMin = minGap + 2;
  const sparseRunMax = maxGap + 5;

  for (let index = 0; index < tokenCount; index++) {
    if (random() < skipChance) {
      result += " ".repeat(randomInt(random, sparseRunMin, sparseRunMax));
      continue;
    }

    const firstSymbol = SYMBOL_POOL[Math.floor(random() * SYMBOL_POOL.length)]!;
    result += firstSymbol;
    result += " ".repeat(randomInt(random, minGap, maxGap));

    if (random() < clusterChance) {
      const secondSymbol =
        SYMBOL_POOL[Math.floor(random() * SYMBOL_POOL.length)]!;
      result += secondSymbol;
      result += " ".repeat(randomInt(random, 1, Math.max(1, maxGap - 1)));

      if (random() < clusterChance * 0.35) {
        const thirdSymbol =
          SYMBOL_POOL[Math.floor(random() * SYMBOL_POOL.length)]!;
        result += thirdSymbol;
        result += " ".repeat(randomInt(random, 1, Math.max(1, maxGap - 2)));
      }
    }
  }

  return `${result.trim()}   `;
}

function normalizeLoopOffset(offset: number, loopWidth: number): number {
  if (!Number.isFinite(loopWidth) || loopWidth <= 0) {
    return 0;
  }

  let normalized = offset % loopWidth;
  if (normalized > 0) {
    normalized -= loopWidth;
  }
  return normalized;
}

function getRowSpeed(rowIndex: number, rowCount: number): number {
  if (rowCount === ROW_SPEEDS.length) {
    return ROW_SPEEDS[rowIndex] ?? ROW_SPEEDS[rowIndex % ROW_SPEEDS.length]!;
  }

  if (rowCount <= 1) {
    return ROW_SPEEDS[0];
  }

  const center = (rowCount - 1) / 2;
  const distanceFromCenter = Math.abs(rowIndex - center) / center;
  const magnitude = 14 + distanceFromCenter * 46;
  const direction = rowIndex % 2 === 0 ? 1 : -1;
  return magnitude * direction;
}

function toGraphemeWidths(
  prepared: PreparedTextWithSegments,
  segmentIndex: number,
  graphemeCount: number,
): number[] {
  const segmentWidth = prepared.widths[segmentIndex] ?? 0;
  const fitAdvances = prepared.breakableFitAdvances[segmentIndex];

  if (fitAdvances !== null && fitAdvances?.length === graphemeCount) {
    return fitAdvances;
  }

  if (graphemeCount <= 1) {
    return [segmentWidth];
  }

  const fallbackWidth = segmentWidth / graphemeCount;
  return Array.from({ length: graphemeCount }, () => fallbackWidth);
}

function measurePattern(
  source: string,
  fontSize: number,
  segmenter: Intl.Segmenter,
): { chars: MeasuredGrapheme[]; width: number } {
  const prepared = prepareWithSegments(
    source,
    `${fontSize}px ${PRETEXT_FONT_FAMILY}`,
    {
      whiteSpace: "pre-wrap",
    },
  );
  const chars: MeasuredGrapheme[] = [];
  let cursor = 0;

  prepared.segments.forEach((segment, segmentIndex) => {
    const graphemes = splitGraphemes(segment, segmenter);
    if (graphemes.length === 0) {
      return;
    }

    const widths = toGraphemeWidths(prepared, segmentIndex, graphemes.length);
    graphemes.forEach((glyph, graphemeIndex) => {
      const width = widths[graphemeIndex] ?? 0;
      chars.push({
        key: `${segmentIndex}-${graphemeIndex}-${chars.length}`,
        glyph,
        baseX: cursor,
        width,
        isSpace: glyph.trim().length === 0,
        isStar: glyph === STAR_SYMBOL,
      });
      cursor += width;
    });
  });

  if (chars.length === 0 || cursor <= 0) {
    chars.push({
      key: "fallback",
      glyph: ".",
      baseX: 0,
      width: fontSize,
      isSpace: false,
      isStar: false,
    });
    cursor = fontSize;
  }

  return { chars, width: cursor };
}

function expandPattern(pattern: PatternRow, viewportWidth: number): RenderRow {
  const targetWidth = Math.max(viewportWidth * 2, pattern.patternWidth * 2);
  const repeatCount = Math.max(
    3,
    Math.ceil(targetWidth / pattern.patternWidth) + 1,
  );
  const chars: MeasuredGrapheme[] = [];

  for (let repeatIndex = 0; repeatIndex < repeatCount; repeatIndex++) {
    for (const patternChar of pattern.patternChars) {
      chars.push({
        key: `${repeatIndex}-${patternChar.key}`,
        glyph: patternChar.glyph,
        width: patternChar.width,
        baseX: patternChar.baseX + repeatIndex * pattern.patternWidth,
        isSpace: patternChar.isSpace,
        isStar: patternChar.isStar,
      });
    }
  }

  return {
    id: pattern.id,
    color: pattern.color,
    speed: pattern.speed,
    patternWidth: pattern.patternWidth,
    chars,
  };
}

export default function AsciiParallax({
  rowCount = DEFAULT_ROW_COUNT,
  rowHeight = DEFAULT_ROW_HEIGHT,
  fontSize = DEFAULT_FONT_SIZE,
  className,
}: AsciiParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    targetIntensity: 0,
    intensity: 0,
  });
  const reducedMotionRef = useRef(false);
  const patternsRef = useRef<PatternRow[]>([]);
  const rowOffsetsRef = useRef<number[]>([]);
  const charRefsRef = useRef<Array<Array<HTMLSpanElement | null>>>([]);
  const [rows, setRows] = useState<RenderRow[]>([]);
  const bandHeight = rowCount * rowHeight;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    setReducedMotion();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", setReducedMotion);
      return () => {
        mediaQuery.removeEventListener("change", setReducedMotion);
      };
    }

    mediaQuery.addListener(setReducedMotion);
    return () => {
      mediaQuery.removeListener(setReducedMotion);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") {
      return;
    }

    const updateSize = () => {
      const width = container.clientWidth;
      if (width <= 0 || patternsRef.current.length === 0) {
        setRows([]);
        return;
      }
      setRows(
        patternsRef.current.map((pattern) => expandPattern(pattern, width)),
      );
    };

    const frameId = requestAnimationFrame(updateSize);

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", updateSize);
      };
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function prepareRows() {
      if (
        typeof window === "undefined" ||
        typeof Intl === "undefined" ||
        typeof Intl.Segmenter === "undefined"
      ) {
        return;
      }

      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore and continue with available font metrics.
        }
      }

      if (cancelled) {
        return;
      }

      const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      const nextPatterns: PatternRow[] = [];

      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const density = getRowDensity(rowIndex, rowCount);
        const tokenCount = Math.round(lerp(56, 118, density));
        const rowText = buildRowText(
          9001 + rowIndex * 97,
          tokenCount,
          density,
          rowIndex === 0 || rowIndex === rowCount - 1,
        );
        const measured = measurePattern(rowText, fontSize, segmenter);

        nextPatterns.push({
          id: `row-${rowIndex}`,
          color: ROW_COLOR,
          speed: getRowSpeed(rowIndex, rowCount),
          patternWidth: measured.width,
          patternChars: measured.chars,
        });
      }

      if (!cancelled) {
        patternsRef.current = nextPatterns;
        const viewportWidth = containerRef.current?.clientWidth ?? 0;
        if (viewportWidth > 0) {
          setRows(
            nextPatterns.map((pattern) =>
              expandPattern(pattern, viewportWidth),
            ),
          );
        } else {
          setRows([]);
        }
      }
    }

    void prepareRows();

    return () => {
      cancelled = true;
    };
  }, [fontSize, rowCount]);

  useEffect(() => {
    rowOffsetsRef.current = rows.map((row, rowIndex) => {
      const existingOffset = rowOffsetsRef.current[rowIndex];
      if (
        typeof existingOffset === "number" &&
        Number.isFinite(existingOffset)
      ) {
        return normalizeLoopOffset(existingOffset, row.patternWidth);
      }

      const seededOffset = -(row.patternWidth * (0.2 + rowIndex * 0.09));
      return normalizeLoopOffset(seededOffset, row.patternWidth);
    });

    charRefsRef.current = rows.map((row, rowIndex) => {
      const existingRefs = charRefsRef.current[rowIndex] ?? [];
      if (existingRefs.length > row.chars.length) {
        existingRefs.length = row.chars.length;
      }
      return existingRefs;
    });
  }, [rows]);

  useEffect(() => {
    if (rows.length === 0) {
      return;
    }

    let frameId = 0;
    let lastTimestamp: number | undefined;

    const animate = (timestamp: number) => {
      if (lastTimestamp === undefined) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      const pointer = pointerRef.current;
      const eased = 1 - Math.exp(-POINTER_INTENSITY_EASE * deltaSeconds);
      pointer.intensity +=
        (pointer.targetIntensity - pointer.intensity) * eased;
      const reducedMotion = reducedMotionRef.current;

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex]!;
        if (row.patternWidth <= 0) {
          continue;
        }

        const speed = reducedMotion ? row.speed * 0.5 : row.speed;
        const offset = normalizeLoopOffset(
          (rowOffsetsRef.current[rowIndex] ?? 0) + speed * deltaSeconds,
          row.patternWidth,
        );
        rowOffsetsRef.current[rowIndex] = offset;

        const yCenter = rowIndex * rowHeight + rowHeight / 2;
        const rowRefs = charRefsRef.current[rowIndex];
        if (!rowRefs) {
          continue;
        }

        for (let charIndex = 0; charIndex < row.chars.length; charIndex++) {
          const element = rowRefs[charIndex];
          if (!element) {
            continue;
          }

          const char = row.chars[charIndex]!;
          const baseX = char.baseX + offset;
          const charCenterX = baseX + char.width / 2;
          const dx = charCenterX - pointer.x;
          const dy = yCenter - pointer.y;
          const distance = Math.hypot(dx, dy);

          let rippleX = 0;
          let rippleY = 0;
          const baseScale = char.isStar ? STAR_BASE_SCALE : 1;
          let scale = baseScale;
          let opacity = char.isSpace ? 0 : BASE_CHAR_OPACITY;

          if (pointer.intensity > 0.001 && distance < REPEL_RADIUS) {
            const safeDistance = Math.max(distance, 0.001);
            const normalized = safeDistance / REPEL_SIGMA;
            const falloff =
              Math.exp(-(normalized * normalized)) * pointer.intensity;

            if (!reducedMotion) {
              rippleX = (dx / safeDistance) * REPEL_STRENGTH * falloff;
              rippleY = (dy / safeDistance) * REPEL_STRENGTH * falloff;
              scale = baseScale * (1 + 0.4 * falloff);
            }

            if (!char.isSpace) {
              opacity = Math.min(
                1,
                BASE_CHAR_OPACITY + (reducedMotion ? 0.5 : 0.65) * falloff,
              );
            }
          }

          element.style.transform = `translate3d(${baseX + rippleX}px, ${rippleY}px, 0) scale(${scale})`;
          element.style.opacity = `${opacity}`;
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [rowHeight, rows]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - rect.left;
    pointerRef.current.y = event.clientY - rect.top;
    pointerRef.current.targetIntensity = 1;
  }

  function handlePointerLeave() {
    pointerRef.current.targetIntensity = 0;
  }

  return (
    <div
      className={["relative w-full", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        style={{ height: `${bandHeight}px` }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            className="relative w-full"
            style={{ height: `${rowHeight}px` }}
          >
            {row.chars.map((char, charIndex) => (
              <span
                key={char.key}
                ref={(node) => {
                  if (!charRefsRef.current[rowIndex]) {
                    charRefsRef.current[rowIndex] = [];
                  }
                  charRefsRef.current[rowIndex]![charIndex] = node;
                }}
                className="pointer-events-none absolute top-0 left-0 whitespace-pre"
                style={{
                  color: row.color,
                  fontFamily: FONT_FAMILY,
                  fontSize: `${fontSize}px`,
                  lineHeight: `${rowHeight}px`,
                  transform: `translate3d(${char.baseX}px, 0, 0) scale(${char.isStar ? STAR_BASE_SCALE : 1})`,
                  opacity: char.isSpace ? 0 : BASE_CHAR_OPACITY,
                  willChange: "transform, opacity",
                  fontWeight: "800",
                }}
              >
                {char.glyph}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
