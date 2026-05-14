type SnapshotMediaProps = {
  aspect?: string;
  label?: string;
  className?: string;
};

const baseClassName =
  "relative w-full overflow-hidden rounded-[3px] bg-neutral-200 ring-1 ring-black/5";

export default function SnapshotMedia({
  aspect = "16 / 9",
  label = "Media placeholder",
  className,
}: SnapshotMediaProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <div className={composedClassName} style={{ aspectRatio: aspect }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-white/80 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-neutral-500">
          {label}
        </span>
      </div>
    </div>
  );
}
