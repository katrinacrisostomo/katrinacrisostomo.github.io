import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SnapshotCarouselModal, {
  type SnapshotCarouselSlide,
} from "./SnapshotCarouselModal";

type SnapshotCarouselProps = {
  slides: SnapshotCarouselSlide[];
  speed?: number;
  background?: string;
  className?: string;
};

const DEFAULT_SPEED = 0.65;

export default function SnapshotCarousel({
  slides,
  speed = DEFAULT_SPEED,
  background,
  className,
}: SnapshotCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pauseRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const duplicatedSlides = useMemo(() => [...slides, ...slides], [slides]);
  const isModalOpen = activeIndex !== null;

  useEffect(() => {
    pauseRef.current = isHovered || isModalOpen;
  }, [isHovered, isModalOpen]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || slides.length <= 1) {
      return;
    }

    const step = () => {
      if (!pauseRef.current) {
        viewport.scrollLeft += speed;
        const midpoint = viewport.scrollWidth / 2;

        if (viewport.scrollLeft >= midpoint) {
          viewport.scrollLeft -= midpoint;
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    animationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [slides.length, speed]);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const openModal = useCallback(
    (index: number) => {
      if (slides.length === 0) {
        return;
      }
      setActiveIndex(index % slides.length);
    },
    [slides.length],
  );

  const showPrevious = useCallback(() => {
    if (slides.length <= 1) {
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return 0;
      }

      return (currentIndex - 1 + slides.length) % slides.length;
    });
  }, [slides.length]);

  const showNext = useCallback(() => {
    if (slides.length <= 1) {
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return 0;
      }

      return (currentIndex + 1) % slides.length;
    });
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const rootClassName = className
    ? `relative w-full overflow-hidden ${className}`
    : "relative w-full overflow-hidden";

  return (
    <>
      <div className={rootClassName}>
        {background ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background }}
          />
        ) : null}
        <div
          ref={viewportRef}
          className="relative w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex w-max items-center gap-6 px-6 py-12 md:px-10 md:py-16">
            {duplicatedSlides.map((slide, index) => (
              <button
                key={`${slide.src}-${index}`}
                type="button"
                className="group relative h-[22rem] shrink-0 md:h-[28rem]"
                onClick={() => openModal(index)}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="block h-full w-auto rounded-[3px] ring-1 ring-black/5"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white">
                  Expand
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <SnapshotCarouselModal
        slides={slides}
        activeIndex={activeIndex}
        onClose={closeModal}
        onPrev={showPrevious}
        onNext={showNext}
      />
    </>
  );
}
