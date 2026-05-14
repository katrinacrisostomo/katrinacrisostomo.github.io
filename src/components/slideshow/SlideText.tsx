import { type ReactNode } from "react";

type SlideTextProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName =
  "flex flex-col gap-6 font-sans text-[0.95rem] leading-[1.55] text-neutral-500";

export default function SlideText({ children, className }: SlideTextProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <div className={composedClassName}>{children}</div>;
}
