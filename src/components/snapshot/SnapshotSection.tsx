import { type ReactNode, useCallback, useEffect } from "react";
import SnapshotSubtitle from "./SnapshotSubtitle";
import SnapshotTitle from "./SnapshotTitle";
import { useSnapshotContext } from "./SnapshotContext";

type SnapshotSectionProps = {
  id: string;
  title: string;
  subtitle: string;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
};

const baseClassName = "scroll-mt-28";

export default function SnapshotSection({
  id,
  title,
  subtitle,
  className,
  headerClassName,
  children,
}: SnapshotSectionProps) {
  const { register, unregister, observeSection } = useSnapshotContext();

  useEffect(() => {
    register(id, title);
    return () => unregister(id);
  }, [id, register, title, unregister]);

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
      <div className={headerClassName}>
        <SnapshotTitle>{title}</SnapshotTitle>
        <SnapshotSubtitle>{subtitle}</SnapshotSubtitle>
      </div>
      <div className="mt-6 flex flex-col gap-6 font-sans text-[0.875rem] leading-[1.6] text-neutral-500">
        {children}
      </div>
    </section>
  );
}
