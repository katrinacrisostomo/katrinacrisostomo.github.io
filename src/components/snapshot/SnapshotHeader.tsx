import { type ReactNode, useCallback, useEffect } from "react";
import { useSnapshotContext } from "./SnapshotContext";

export type SnapshotStat = {
  label: string;
  value: string;
};

type SnapshotHeaderProps = {
  id?: string;
  tocLabel?: string;
  title: string;
  stats: SnapshotStat[];
  description?: string;
  className?: string;
  children?: ReactNode;
};

const DEFAULT_ID = "overview";
const DEFAULT_TOC_LABEL = "Overview";
const baseClassName = "scroll-mt-28";

export default function SnapshotHeader({
  id = DEFAULT_ID,
  tocLabel = DEFAULT_TOC_LABEL,
  title,
  stats,
  description,
  className,
  children,
}: SnapshotHeaderProps) {
  const { register, unregister, observeSection } = useSnapshotContext();

  useEffect(() => {
    register(id, tocLabel);
    return () => unregister(id);
  }, [id, register, tocLabel, unregister]);

  const setSectionRef = useCallback(
    (node: HTMLElement | null) => {
      observeSection(id, node);
    },
    [id, observeSection],
  );

  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <section id={id} ref={setSectionRef} className={composedClassName}>
      <h1 className="font-serif text-[clamp(2rem,3vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-black">
        {title}
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <p className="font-mono text-[0.68rem] uppercase text-neutral-400">
              {stat.label}
            </p>
            <p className="font-sans text-[1rem] leading-[1.35] whitespace-pre-line text-black">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      {description ? (
        <p className="mt-8 max-w-[42rem] font-sans text-[0.9rem] leading-[1.6] text-neutral-500">
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}
