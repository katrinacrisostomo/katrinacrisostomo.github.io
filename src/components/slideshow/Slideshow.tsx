import { type CSSProperties, type ReactNode } from "react";
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

const toOffsetValue = (topOffset?: number | string): string =>
  typeof topOffset === "number" ? `${topOffset}px` : (topOffset ?? "0px");

export default function Slideshow({
  name,
  backHref,
  backLabel,
  children,
  topOffset,
  desktopQuery = DEFAULT_DESKTOP_QUERY,
}: SlideshowProps) {
  const isDesktop = useMediaQuery(desktopQuery);

  const style = {
    "--slideshow-top": toOffsetValue(topOffset),
  } as CSSProperties;

  return (
    <section className="relative flex flex-1 flex-col bg-white" style={style}>
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
