import { type ReactNode } from "react";

type SnapshotSubtitleProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName =
  "mt-5 font-sans text-[1.0625rem] leading-[1.35] text-black sm:text-[1.125rem] md:text-[1.25rem]";

export default function SnapshotSubtitle({
  children,
  className,
}: SnapshotSubtitleProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <h2 className={composedClassName}>{children}</h2>;
}
