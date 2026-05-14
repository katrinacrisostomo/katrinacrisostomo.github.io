import { type ReactNode } from "react";

type SlideTitleProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName =
  "mb-10 font-sans text-[clamp(1.65rem,3vw,2.15rem)] leading-[1.15] tracking-[-0.01em] text-neutral-700";

export default function SlideTitle({ children, className }: SlideTitleProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <h2 className={composedClassName}>{children}</h2>;
}
