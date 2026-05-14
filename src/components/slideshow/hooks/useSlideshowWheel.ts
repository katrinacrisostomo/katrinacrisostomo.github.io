import { type RefObject, useEffect } from "react";

type UseSlideshowWheelOptions = {
  containerRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  threshold?: number;
  cooldownMs?: number;
};

export default function useSlideshowWheel({
  containerRef,
  enabled,
  onPrev,
  onNext,
  threshold = 50,
  cooldownMs = 350,
}: UseSlideshowWheelOptions) {
  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || !container) {
      return;
    }

    let wheelDelta = 0;
    let isCoolingDown = false;
    let cooldownTimeoutId: number | null = null;

    const startCooldown = () => {
      isCoolingDown = true;

      if (cooldownTimeoutId !== null) {
        window.clearTimeout(cooldownTimeoutId);
      }

      cooldownTimeoutId = window.setTimeout(() => {
        isCoolingDown = false;
        wheelDelta = 0;
        cooldownTimeoutId = null;
      }, cooldownMs);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (isCoolingDown) {
        return;
      }

      wheelDelta += event.deltaY;

      if (Math.abs(wheelDelta) < threshold) {
        return;
      }

      if (wheelDelta > 0) {
        onNext();
      } else {
        onPrev();
      }

      wheelDelta = 0;
      startCooldown();
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
      if (cooldownTimeoutId !== null) {
        window.clearTimeout(cooldownTimeoutId);
      }
    };
  }, [containerRef, cooldownMs, enabled, onNext, onPrev, threshold]);
}
