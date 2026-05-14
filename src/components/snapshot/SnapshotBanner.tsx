import { type ReactNode } from "react";

type SnapshotBannerProps = {
  color?: string;
  gradient?: string;
  height?: number | string;
  /** When set, controls min-height via Tailwind (e.g. responsive). Overrides `height` for min-height. */
  minHeightClassName?: string;
  className?: string;
  children?: ReactNode;
};

const DEFAULT_COLOR = "#6e63d6";
const DEFAULT_HEIGHT = "22rem";

const toHeightValue = (height: number | string): string =>
  typeof height === "number" ? `${height}px` : height;

export default function SnapshotBanner({
  color,
  gradient,
  height = DEFAULT_HEIGHT,
  minHeightClassName,
  className,
  children,
}: SnapshotBannerProps) {
  const background = gradient ?? color ?? DEFAULT_COLOR;
  const resolvedHeight = toHeightValue(height);
  const composedClassName = [
    "relative w-full overflow-hidden flex min-h-0 flex-col",
    minHeightClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={composedClassName}
      style={{
        background,
        ...(minHeightClassName ? {} : { minHeight: resolvedHeight }),
      }}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[74rem] flex-1 flex-col items-center justify-end px-4 pt-8 pb-0 md:px-8 md:pt-10">
        {children}
      </div>
    </section>
  );
}
