import { useCallback, useEffect, useRef, useState } from "react";

type UseScrollSpyOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  targetOffset?: number;
};

const DEFAULT_ROOT_MARGIN = "-30% 0px -60% 0px";
const DEFAULT_THRESHOLD = [0, 0.25, 0.5, 0.75, 1];
const DEFAULT_TARGET_OFFSET = 0.3;

export type ScrollSpyObserve = (id: string, node: HTMLElement | null) => void;

export default function useScrollSpy({
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = DEFAULT_THRESHOLD,
  targetOffset = DEFAULT_TARGET_OFFSET,
}: UseScrollSpyOptions = {}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const computeActiveId = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nodes = [...nodesRef.current.entries()];

    if (nodes.length === 0) {
      setActiveId(null);
      return;
    }

    const targetY = window.innerHeight * targetOffset;
    let closestAbove: { id: string; top: number } | null = null;
    let closestBelow: { id: string; top: number } | null = null;

    for (const [id, node] of nodes) {
      const { top } = node.getBoundingClientRect();

      if (top <= targetY) {
        if (!closestAbove || top > closestAbove.top) {
          closestAbove = { id, top };
        }
      } else if (!closestBelow || top < closestBelow.top) {
        closestBelow = { id, top };
      }
    }

    const nextActiveId = closestAbove?.id ?? closestBelow?.id ?? null;
    setActiveId((currentId) =>
      currentId === nextActiveId ? currentId : nextActiveId,
    );
  }, [targetOffset]);

  const scheduleCompute = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      computeActiveId();
    });
  }, [computeActiveId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      () => {
        scheduleCompute();
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    for (const node of nodesRef.current.values()) {
      observerRef.current.observe(node);
    }

    scheduleCompute();
    window.addEventListener("scroll", scheduleCompute, { passive: true });
    window.addEventListener("resize", scheduleCompute);

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }

      observerRef.current?.disconnect();
      observerRef.current = null;
      window.removeEventListener("scroll", scheduleCompute);
      window.removeEventListener("resize", scheduleCompute);
    };
  }, [rootMargin, scheduleCompute, threshold]);

  const observe = useCallback<ScrollSpyObserve>(
    (id, node) => {
      const observer = observerRef.current;
      const currentNode = nodesRef.current.get(id);

      if (currentNode && observer) {
        observer.unobserve(currentNode);
      }

      if (!node) {
        nodesRef.current.delete(id);
        scheduleCompute();
        return;
      }

      nodesRef.current.set(id, node);
      if (observer) {
        observer.observe(node);
      }
      scheduleCompute();
    },
    [scheduleCompute],
  );

  return { activeId, observe };
}
