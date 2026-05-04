const projectItemGradientA =
  "linear-gradient(125deg, #a8c8e0 0%, #b4aad8 42%, #c070c8 72%, #e0c0d0 100%)";

export const projectItemGradientB =
  "linear-gradient(118deg, #9ec0dc 0%, #c4c0e0 38%, #b060c0 68%, #e0a8b4 100%)";

export type ProjectItemType = "case-study" | "snapshot" | "concept";

const TYPE_LABEL: Record<ProjectItemType, string> = {
  "case-study": "Case Study",
  snapshot: "Snapshot",
  concept: "Concept",
};

const TYPE_CHIP_CLASS: Record<ProjectItemType, string> = {
  "case-study": "bg-primary text-white",
  snapshot: "bg-secondary text-black",
  concept: "bg-tertiary text-black",
};

/** Shown on chip hover for quick context */
const TYPE_TITLE: Record<ProjectItemType, string> = {
  "case-study":
    "Case Study: deep dive of something designed and built at work.",
  snapshot:
    "Snapshot: a lighter, higher-level look at a design — the gist, not the full story.",
  concept:
    "Concept: a redesign for fun, a side project, or something not built or shipped.",
};

type ProjectItemProps = {
  gradient?: string;
  type: ProjectItemType;
  title: string;
  description: string;
};

export default function ProjectItem({
  gradient,
  type,
  title,
  description,
}: ProjectItemProps) {
  return (
    <article className="mb-6 flex flex-col gap-6 md:mb-0 md:gap-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm shadow-sm ring-1 ring-black/5">
        <div
          className="absolute inset-0"
          style={{ background: gradient ?? projectItemGradientA }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
          <span className="rounded-full border-white/60 bg-white/45 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-neutral-800 shadow-sm backdrop-blur-sm">
            Coming Soon
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <p
            className={`inline-flex shrink-0 rounded-sm px-2 py-1 font-mono text-xs font-normal ${TYPE_CHIP_CLASS[type]}`}
            title={TYPE_TITLE[type]}
          >
            {TYPE_LABEL[type]}
          </p>
          <h3 className="min-w-0 flex-1 font-serif text-xl font-medium leading-[1.05] tracking-[-0.02em] text-black">
            {title}
          </h3>
        </div>
        <p className="font-sans text-sm font-normal leading-[1.45] text-neutral-400">
          {description}
        </p>
      </div>
    </article>
  );
}
