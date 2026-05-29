import { type ReactNode } from "react";

type SnapshotTitleProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName = "flex items-center gap-4";
const textClassName =
  "font-mono text-[0.75rem] uppercase text-neutral-400 whitespace-nowrap";
const lineClassName = "h-px flex-1 bg-neutral-200";

export default function SnapshotTitle({
  children,
  className,
}: SnapshotTitleProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div className={composedClassName}>
      <span className={textClassName}>{children}</span>
      <span aria-hidden="true" className={lineClassName} />
    </div>
  );
}
