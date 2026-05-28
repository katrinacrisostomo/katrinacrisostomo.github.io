import { type ReactNode } from "react";
import { SnapshotProvider } from "./SnapshotContext";
import SnapshotTableOfContents from "./SnapshotTableOfContents";

type SnapshotLayoutProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName =
  "mx-auto grid w-full max-w-8xl flex-1 grid-cols-1 gap-8 px-6 pt-10 md:grid-cols-[12rem_minmax(0,1fr)] md:px-0 md:pt-0 md:gap-10";

export default function SnapshotLayout({
  children,
  className,
}: SnapshotLayoutProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <SnapshotProvider>
      <main className={composedClassName}>
        <SnapshotTableOfContents />
        <article className="min-w-0 pb-20 md:border-l md:border-neutral-200">
          {children}
        </article>
      </main>
    </SnapshotProvider>
  );
}
