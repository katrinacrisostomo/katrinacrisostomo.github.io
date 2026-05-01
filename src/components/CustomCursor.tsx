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

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      dot.style.opacity = "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
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
