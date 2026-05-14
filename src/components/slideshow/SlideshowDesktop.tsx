import { AnimatePresence, motion } from "framer-motion";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { SlideshowLayoutProps } from "./Slideshow";
import SlideshowControls from "./SlideshowControls";
import SlideshowKeysHint from "./SlideshowKeysHint";
import SlideshowName from "./SlideshowName";
import SlideshowProgressBar from "./SlideshowProgressBar";
import useSlideshowKeyboard from "./hooks/useSlideshowKeyboard";
import useSlideshowWheel from "./hooks/useSlideshowWheel";

const TRANSITION_MS = 350;
const WHEEL_THRESHOLD = 110;
const WHEEL_COOLDOWN_MS = 700;

export default function SlideshowDesktop({
  name,
  backHref,
  backLabel,
  children,
}: SlideshowLayoutProps) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const transitionLockRef = useRef(false);
  const unlockTimeoutRef = useRef<number | null>(null);

  const releaseLock = useCallback(() => {
    if (unlockTimeoutRef.current !== null) {
      window.clearTimeout(unlockTimeoutRef.current);
    }

    unlockTimeoutRef.current = window.setTimeout(() => {
      transitionLockRef.current = false;
      unlockTimeoutRef.current = null;
    }, TRANSITION_MS);
  }, []);

  const moveBy = useCallback(
    (direction: -1 | 1) => {
      if (transitionLockRef.current || total <= 1) {
        return;
      }

      setIndex((currentIndex) => {
        const nextIndex = Math.min(
          total - 1,
          Math.max(0, currentIndex + direction),
        );

        if (nextIndex === currentIndex) {
          return currentIndex;
        }

        transitionLockRef.current = true;
        releaseLock();
        return nextIndex;
      });
    },
    [releaseLock, total],
  );

  const onPrev = useCallback(() => moveBy(-1), [moveBy]);
  const onNext = useCallback(() => moveBy(1), [moveBy]);

  useEffect(
    () => () => {
      if (unlockTimeoutRef.current !== null) {
        window.clearTimeout(unlockTimeoutRef.current);
      }
    },
    [],
  );

  useSlideshowKeyboard({ enabled: total > 1, onPrev, onNext });
  useSlideshowWheel({
    containerRef: slideshowRef,
    enabled: total > 1,
    onPrev,
    onNext,
    threshold: WHEEL_THRESHOLD,
    cooldownMs: WHEEL_COOLDOWN_MS,
  });

  const clampedIndex = total === 0 ? 0 : Math.min(index, total - 1);
  const activeSlide = slides[clampedIndex] ?? null;

  return (
    <div
      ref={slideshowRef}
      className="relative flex h-[calc(100vh-var(--slideshow-top,0px))] min-h-0 flex-col overflow-hidden bg-white"
    >
      <SlideshowProgressBar currentIndex={clampedIndex} total={total} />
      <SlideshowName name={name} />
      <div className="relative flex flex-1 overflow-hidden pb-24">
        <AnimatePresence mode="wait" initial={false}>
          {activeSlide ? (
            <motion.div
              key={clampedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: TRANSITION_MS / 1000, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center bg-white"
            >
              {activeSlide}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <SlideshowControls
        index={clampedIndex}
        total={total}
        backHref={backHref}
        backLabel={backLabel}
        onPrev={onPrev}
        onNext={onNext}
      />
      <SlideshowKeysHint />
    </div>
  );
}
