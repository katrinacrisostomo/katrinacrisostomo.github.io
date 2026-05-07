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
  centerX: number;
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

function findFirstCharIndex(
  chars: MeasuredGrapheme[],
  targetCenterX: number,
): number {
  let low = 0;
  let high = chars.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const midChar = chars[mid];
    if (!midChar) {
      break;
    }

    if (midChar.centerX < targetCenterX) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

function applyBaseCharStyle(element: HTMLSpanElement, char: MeasuredGrapheme) {
  element.style.transform = `translate3d(0px, 0px, 0) scale(${char.isStar ? STAR_BASE_SCALE : 1})`;
  element.style.opacity = char.isSpace ? "0" : `${BASE_CHAR_OPACITY}`;
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
        centerX: cursor + width / 2,
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
      centerX: fontSize / 2,
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
        centerX: patternChar.centerX + repeatIndex * pattern.patternWidth,
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
  const rowTrackRefsRef = useRef<Array<HTMLDivElement | null>>([]);
  const charRefsRef = useRef<Array<Array<HTMLSpanElement | null>>>([]);
  const activeRippleIndicesRef = useRef<Array<number[]>>([]);
  const [rows, setRows] = useState<RenderRow[]>([]);
  const [isInView, setIsInView] = useState(true);
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
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry?.isIntersecting ?? false);
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(container);
    return () => {
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

    rowTrackRefsRef.current = rows.map(
      (_, rowIndex) => rowTrackRefsRef.current[rowIndex] ?? null,
    );

    activeRippleIndicesRef.current = rows.map(
      (_, rowIndex) => activeRippleIndicesRef.current[rowIndex] ?? [],
    );
  }, [rows]);

  useEffect(() => {
    if (isInView) {
      return;
    }

    pointerRef.current.targetIntensity = 0;
    pointerRef.current.intensity = 0;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (!row) {
        continue;
      }

      const activeIndices = activeRippleIndicesRef.current[rowIndex] ?? [];
      const rowRefs = charRefsRef.current[rowIndex];
      if (!rowRefs || activeIndices.length === 0) {
        continue;
      }

      for (const charIndex of activeIndices) {
        const element = rowRefs[charIndex];
        const char = row.chars[charIndex];
        if (!element || !char) {
          continue;
        }
        applyBaseCharStyle(element, char);
      }

      activeRippleIndicesRef.current[rowIndex] = [];
    }
  }, [isInView, rows]);

  useEffect(() => {
    if (rows.length === 0 || !isInView) {
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
      const shouldRipple = pointer.intensity > 0.001 && !reducedMotion;
      const minX = pointer.x - REPEL_RADIUS;
      const maxX = pointer.x + REPEL_RADIUS;

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        if (!row || row.patternWidth <= 0) {
          continue;
        }

        const speed = reducedMotion ? row.speed * 0.5 : row.speed;
        const offset = normalizeLoopOffset(
          (rowOffsetsRef.current[rowIndex] ?? 0) + speed * deltaSeconds,
          row.patternWidth,
        );
        rowOffsetsRef.current[rowIndex] = offset;

        const rowTrack = rowTrackRefsRef.current[rowIndex];
        if (rowTrack) {
          rowTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
        }

        const rowRefs = charRefsRef.current[rowIndex];
        const prevActiveIndices = activeRippleIndicesRef.current[rowIndex] ?? [];

        if (!rowRefs) {
          activeRippleIndicesRef.current[rowIndex] = [];
          continue;
        }

        if (!shouldRipple) {
          if (prevActiveIndices.length > 0) {
            for (const charIndex of prevActiveIndices) {
              const element = rowRefs[charIndex];
              const char = row.chars[charIndex];
              if (!element || !char) {
                continue;
              }
              applyBaseCharStyle(element, char);
            }
            activeRippleIndicesRef.current[rowIndex] = [];
          }
          continue;
        }

        const yCenter = rowIndex * rowHeight + rowHeight / 2;
        const dy = yCenter - pointer.y;
        if (Math.abs(dy) >= REPEL_RADIUS) {
          if (prevActiveIndices.length > 0) {
            for (const charIndex of prevActiveIndices) {
              const element = rowRefs[charIndex];
              const char = row.chars[charIndex];
              if (!element || !char) {
                continue;
              }
              applyBaseCharStyle(element, char);
            }
            activeRippleIndicesRef.current[rowIndex] = [];
          }
          continue;
        }

        const startIndex = findFirstCharIndex(row.chars, minX - offset);
        const endIndex = findFirstCharIndex(row.chars, maxX - offset + 0.001);
        const nextActiveIndices: number[] = [];

        for (let charIndex = startIndex; charIndex < endIndex; charIndex++) {
          const element = rowRefs[charIndex];
          const char = row.chars[charIndex];
          if (!element || !char) {
            continue;
          }

          const charCenterX = char.centerX + offset;
          const dx = charCenterX - pointer.x;
          const distance = Math.hypot(dx, dy);
          if (distance >= REPEL_RADIUS) {
            continue;
          }

          const safeDistance = Math.max(distance, 0.001);
          const normalized = safeDistance / REPEL_SIGMA;
          const falloff =
            Math.exp(-(normalized * normalized)) * pointer.intensity;
          const rippleX = (dx / safeDistance) * REPEL_STRENGTH * falloff;
          const rippleY = (dy / safeDistance) * REPEL_STRENGTH * falloff;
          const baseScale = char.isStar ? STAR_BASE_SCALE : 1;
          const scale = baseScale * (1 + 0.4 * falloff);
          const opacity = char.isSpace
            ? 0
            : Math.min(1, BASE_CHAR_OPACITY + 0.65 * falloff);

          element.style.transform = `translate3d(${rippleX}px, ${rippleY}px, 0) scale(${scale})`;
          element.style.opacity = `${opacity}`;
          nextActiveIndices.push(charIndex);
        }

        if (prevActiveIndices.length > 0) {
          const activeSet = new Set(nextActiveIndices);
          for (const charIndex of prevActiveIndices) {
            if (activeSet.has(charIndex)) {
              continue;
            }

            const element = rowRefs[charIndex];
            const char = row.chars[charIndex];
            if (!element || !char) {
              continue;
            }
            applyBaseCharStyle(element, char);
          }
        }

        activeRippleIndicesRef.current[rowIndex] = nextActiveIndices;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isInView, rowHeight, rows]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType && event.pointerType !== "mouse") {
      return;
    }

    pointerRef.current.x = event.nativeEvent.offsetX;
    pointerRef.current.y = event.nativeEvent.offsetY;
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
            className="relative w-full overflow-visible pointer-events-none"
            style={{ height: `${rowHeight}px` }}
          >
            <div
              ref={(node) => {
                rowTrackRefsRef.current[rowIndex] = node;
              }}
              className="absolute inset-0 overflow-visible pointer-events-none will-change-transform"
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
                  className="pointer-events-none absolute top-0 whitespace-pre"
                  style={{
                    left: `${char.baseX}px`,
                    color: row.color,
                    fontFamily: FONT_FAMILY,
                    fontSize: `${fontSize}px`,
                    lineHeight: `${rowHeight}px`,
                    transform: `translate3d(0px, 0px, 0) scale(${char.isStar ? STAR_BASE_SCALE : 1})`,
                    opacity: char.isSpace ? 0 : BASE_CHAR_OPACITY,
                    fontWeight: "800",
                  }}
                >
                  {char.glyph}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
