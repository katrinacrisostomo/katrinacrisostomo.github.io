import { useEffect } from "react";

export type SnapshotCarouselSlide = {
  src: string;
  alt: string;
};

type SnapshotCarouselModalProps = {
  slides: SnapshotCarouselSlide[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function SnapshotCarouselModal({
  slides,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: SnapshotCarouselModalProps) {
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onClose, onNext, onPrev]);

  if (activeIndex === null) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  if (!activeSlide) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded product screen"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-6xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-white hover:bg-black/80"
          onClick={onClose}
        >
          Close
        </button>
        {slides.length > 1 ? (
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-2xl text-white hover:bg-black/75 md:left-4"
            onClick={onPrev}
          >
            ‹
          </button>
        ) : null}
        <img
          src={activeSlide.src}
          alt={activeSlide.alt}
          className="max-h-[85vh] w-full rounded-[3px] object-contain"
          loading="eager"
          decoding="async"
        />
        {slides.length > 1 ? (
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-2xl text-white hover:bg-black/75 md:right-4"
            onClick={onNext}
          >
            ›
          </button>
        ) : null}
      </div>
    </div>
  );
}
