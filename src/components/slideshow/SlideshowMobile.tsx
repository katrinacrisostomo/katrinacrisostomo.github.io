import { Children, Fragment, useEffect, useRef, useState } from "react";
import type { SlideshowLayoutProps } from "./Slideshow";
import SlideshowName from "./SlideshowName";
import SlideshowProgressBar from "./SlideshowProgressBar";

const observerThresholds = [0, 0.2, 0.35, 0.5, 0.7, 0.85, 1];

export default function SlideshowMobile({
  name,
  backHref,
  backLabel,
  children,
}: SlideshowLayoutProps) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const visibilityRatioMapRef = useRef<Map<number, number>>(new Map());
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (total === 0) {
      setIndex(0);
      return;
    }

    visibilityRatioMapRef.current = new Map(
      Array.from({ length: total }, (_, slideIndex) => [slideIndex, 0]),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slideIndex = Number(
            (entry.target as HTMLElement).dataset.slideIndex,
          );

          if (Number.isNaN(slideIndex)) {
            continue;
          }

          visibilityRatioMapRef.current.set(
            slideIndex,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let nextIndex = indexRef.current;
        let largestRatio = -1;

        for (const [slideIndex, ratio] of visibilityRatioMapRef.current) {
          if (ratio > largestRatio) {
            largestRatio = ratio;
            nextIndex = slideIndex;
          }
        }

        if (nextIndex !== indexRef.current) {
          indexRef.current = nextIndex;
          setIndex(nextIndex);
        }
      },
      {
        threshold: observerThresholds,
        rootMargin: "-10% 0px -30% 0px",
      },
    );

    for (const section of sectionRefs.current) {
      if (section) {
        observer.observe(section);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [total]);

  sectionRefs.current = sectionRefs.current.slice(0, total);

  return (
    <div className="flex min-h-[calc(100vh-var(--slideshow-top,0px))] flex-col bg-white">
      <SlideshowProgressBar currentIndex={index} total={total} />
      <SlideshowName name={name} />
      <div className="flex flex-col">
        {slides.map((slide, slideIndex) => (
          <Fragment key={slideIndex}>
            <section
              ref={(element) => {
                sectionRefs.current[slideIndex] = element;
              }}
              data-slide-index={slideIndex}
              className="min-h-[80vh] scroll-mt-12 flex items-center justify-center px-6 mb-10"
            >
              {slide}
            </section>
            {slideIndex < total - 1 ? (
              <hr className="mx-6 mb-15 border-t border-gray-200" />
            ) : null}
          </Fragment>
        ))}
      </div>
      <div className="px-6 py-10">
        <a
          href={backHref}
          className="inline-flex items-center gap-1 rounded-sm border border-primary px-3 py-2 font-mono text-xs tracking-[0.08em] text-primary uppercase"
        >
          {backLabel}
          <span aria-hidden>›</span>
        </a>
      </div>
    </div>
  );
}
