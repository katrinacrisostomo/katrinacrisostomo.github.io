import { ChevronLeft, ChevronRight } from "lucide-react";

type SlideshowControlsProps = {
  index: number;
  total: number;
  backHref: string;
  backLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

const baseButtonClassName =
  "inline-flex h-10 w-10 items-center justify-center rounded-sm border border-neutral-300 bg-white text-black transition-colors hover:border-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300";

export default function SlideshowControls({
  index,
  total,
  backHref,
  backLabel,
  onPrev,
  onNext,
}: SlideshowControlsProps) {
  if (total === 0) {
    return null;
  }

  const isLast = index >= total - 1;

  return (
    <div className="fixed right-6 bottom-6 z-30 flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        className={baseButtonClassName}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {isLast ? (
        <a
          href={backHref}
          className="inline-flex h-10 items-center gap-3 rounded-sm border border-black bg-black px-4 font-mono text-xs tracking-[0.08em] text-white uppercase transition-colors hover:bg-neutral-800"
        >
          {backLabel}
          <ChevronRight className="h-4 w-4" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className={baseButtonClassName}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
