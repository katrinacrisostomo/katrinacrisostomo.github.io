import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import SlideshowDesktop from "./SlideshowDesktop";
import SlideshowMobile from "./SlideshowMobile";
import useMediaQuery from "./hooks/useMediaQuery";

export type SlideshowProps = {
  name: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
  topOffset?: number | string;
  desktopQuery?: string;
};

export type SlideshowLayoutProps = Pick<
  SlideshowProps,
  "name" | "backHref" | "backLabel" | "children"
>;

const DEFAULT_DESKTOP_QUERY = "(min-width: 768px)";
const HEADER_SELECTOR = "header";

const getHeaderOffset = (): string => {
  if (typeof document === "undefined") {
    return "0px";
  }

  const header = document.querySelector(HEADER_SELECTOR);

  if (!(header instanceof HTMLElement)) {
    return "0px";
  }

  return `${Math.ceil(header.getBoundingClientRect().height)}px`;
};

const toOffsetValue = (topOffset: number | string): string =>
  typeof topOffset === "number" ? `${topOffset}px` : topOffset;

export default function Slideshow({
  name,
  backHref,
  backLabel,
  children,
  topOffset,
  desktopQuery = DEFAULT_DESKTOP_QUERY,
}: SlideshowProps) {
  const isDesktop = useMediaQuery(desktopQuery);
  const [autoTopOffset, setAutoTopOffset] = useState(() => getHeaderOffset());

  useEffect(() => {
    if (topOffset !== undefined) {
      return;
    }

    const header = document.querySelector(HEADER_SELECTOR);

    if (!(header instanceof HTMLElement)) {
      return;
    }

    const setOffsetFromHeight = (height: number) => {
      const nextOffset = `${Math.ceil(height)}px`;
      setAutoTopOffset((currentOffset) =>
        currentOffset === nextOffset ? currentOffset : nextOffset,
      );
    };

    const updateOffset = () => {
      setOffsetFromHeight(header.getBoundingClientRect().height);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        setOffsetFromHeight(firstEntry.contentRect.height);
      }
    });
    resizeObserver.observe(header);
    window.addEventListener("resize", updateOffset);
    const initialOffsetRaf = window.requestAnimationFrame(updateOffset);

    return () => {
      window.cancelAnimationFrame(initialOffsetRaf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, [topOffset]);

  const resolvedTopOffset =
    topOffset === undefined ? autoTopOffset : toOffsetValue(topOffset);

  const style = {
    "--slideshow-top": resolvedTopOffset,
  } as CSSProperties;

  return (
    <section
      className="relative flex flex-1 flex-col bg-white md:min-h-0"
      style={style}
    >
      {isDesktop ? (
        <SlideshowDesktop name={name} backHref={backHref} backLabel={backLabel}>
          {children}
        </SlideshowDesktop>
      ) : (
        <SlideshowMobile name={name} backHref={backHref} backLabel={backLabel}>
          {children}
        </SlideshowMobile>
      )}
    </section>
  );
}
