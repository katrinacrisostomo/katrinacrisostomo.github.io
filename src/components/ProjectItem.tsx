const projectItemGradientA =
  "linear-gradient(125deg, #a8c8e0 0%, #b4aad8 42%, #c070c8 72%, #e0c0d0 100%)";

export const projectItemGradientB =
  "linear-gradient(118deg, #9ec0dc 0%, #c4c0e0 38%, #b060c0 68%, #e0a8b4 100%)";

type ProjectItemProps = {
  gradient?: string;
  label: string;
  title: string;
  description: string;
};

export default function ProjectItem({
  gradient,
  label,
  title,
  description,
}: ProjectItemProps) {
  return (
    <article className="flex flex-col gap-4">
      <div
        className="aspect-[16/10] w-full rounded-sm shadow-sm ring-1 ring-black/5"
        style={{ background: gradient ?? projectItemGradientA }}
        aria-hidden
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="inline-flex shrink-0 rounded-sm bg-primary px-2 py-1 font-mono text-xs font-normal text-white">
            {label}
          </p>
          <h3 className="min-w-0 flex-1 font-serif text-xl font-medium leading-[1.05] tracking-[-0.02em] text-black">
            {title}
          </h3>
        </div>
        <p className="font-sans text-sm font-normal leading-[1.25] text-neutral-400">
          {description}
        </p>
      </div>
    </article>
  );
}
