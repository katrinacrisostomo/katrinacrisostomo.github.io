import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    if (!dot) {
      root.classList.remove("custom-cursor-active");
      return;
    }

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;
    let isVisible = false;

    const flushPosition = () => {
      rafId = 0;
      dot.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;

      if (!isVisible) {
        dot.style.opacity = "1";
        isVisible = true;
      }
    };

    const onMove = (e: MouseEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;

      if (!rafId) {
        rafId = window.requestAnimationFrame(flushPosition);
      }
    };

    const onLeave = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      if (isVisible) {
        dot.style.opacity = "0";
        isVisible = false;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-3.5 w-3.5 rounded-full bg-primary opacity-0 will-change-transform"
      aria-hidden
    />
  );
}
