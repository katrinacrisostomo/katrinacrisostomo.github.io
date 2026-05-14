import { type CSSProperties, type ReactNode } from "react";
import useMediaQuery from "./hooks/useMediaQuery";

type SlideProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
};

export default function Slide({
  children,
  className,
  maxWidth = "64rem",
  maxHeight = "70vh",
}: SlideProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const contentClassName = className
    ? `w-full md:mb-25 ${className}`
    : "w-full md:mb-25";
  const style: CSSProperties = isDesktop
    ? { maxWidth, maxHeight }
    : { maxWidth };

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className={contentClassName} style={style}>
        {children}
      </div>
    </div>
  );
}
