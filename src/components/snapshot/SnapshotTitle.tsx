import { type ReactNode } from "react";

type SnapshotTitleProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName = "font-mono text-[0.75rem] uppercase text-neutral-400";

export default function SnapshotTitle({
  children,
  className,
}: SnapshotTitleProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <p className={composedClassName}>{children}</p>;
}
