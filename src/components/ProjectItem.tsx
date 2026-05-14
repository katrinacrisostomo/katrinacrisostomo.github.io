import { CursorTooltip } from "./CursorTooltip";
import { Link } from "react-router-dom";

const projectItemGradientA =
  "linear-gradient(125deg, #a8c8e0 0%, #b4aad8 42%, #c070c8 72%, #e0c0d0 100%)";

export const projectItemGradientB =
  "linear-gradient(118deg, #9ec0dc 0%, #c4c0e0 38%, #b060c0 68%, #e0a8b4 100%)";

const comingSoonPlaceholderSrc = "/work/gradient-placeholder.png";

export type ProjectItemType = "case-study" | "snapshot" | "blog-article";

const TYPE_LABEL: Record<ProjectItemType, string> = {
  "case-study": "Case Study",
  snapshot: "Snapshot",
  "blog-article": "Blog",
};

const TYPE_CHIP_CLASS: Record<ProjectItemType, string> = {
  "case-study": "bg-tertiary text-black",
  snapshot: "bg-secondary text-black",
  "blog-article": "bg-primary text-white",
};

/** Shown on chip hover for quick context */
const TYPE_TITLE: Record<ProjectItemType, string> = {
  "case-study":
    "Case Study: deep dive of something designed and built at work.",
  snapshot:
    "Snapshot: a lighter, higher-level look at a design — the gist, not the full story.",
  "blog-article":
    "Blog Article: a written piece exploring ideas, observations, or lessons learned.",
};

type ProjectItemProps = {
  gradient?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  type: ProjectItemType;
  title: string;
  description: string;
  href?: string;
  isComingSoon?: boolean;
};

export default function ProjectItem({
  gradient,
  imageSrc,
  imageAlt,
  imageClassName,
  type,
  title,
  description,
  href,
  isComingSoon = true,
}: ProjectItemProps) {
  const chipLabel = isComingSoon ? "Coming Soon" : "View Snapshot";
  const effectiveImageSrc = isComingSoon ? comingSoonPlaceholderSrc : imageSrc;
  const effectiveImageAlt = isComingSoon ? "" : (imageAlt ?? "");
  const previewImageBaseClassName =
    "absolute inset-0 h-full w-full object-cover transform-gpu transition-all duration-700 ease-out will-change-transform group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:opacity-90";
  const previewImageClassName = imageClassName
    ? `${previewImageBaseClassName} ${imageClassName}`
    : previewImageBaseClassName;

  const previewShellClassName =
    "group relative aspect-[16/10] w-full overflow-hidden rounded-[3px] ring-1 ring-black/5";

  const previewInner = href ? (
    <Link to={href} className="block h-full w-full" aria-label={title}>
      {effectiveImageSrc ? (
        <img
          src={effectiveImageSrc}
          alt={effectiveImageAlt}
          className={previewImageClassName}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: gradient ?? projectItemGradientA }}
          aria-hidden
        />
      )}
    </Link>
  ) : (
    <>
      {effectiveImageSrc ? (
        <img
          src={effectiveImageSrc}
          alt={effectiveImageAlt}
          className={previewImageClassName}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: gradient ?? projectItemGradientA }}
          aria-hidden
        />
      )}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <span className="rounded-full border-white/60 bg-white/45 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-neutral-800 shadow-sm backdrop-blur-sm">
          {chipLabel}
        </span>
      </div>
    </>
  );

  return (
    <article className="mb-6 flex flex-col gap-6 md:mb-0 md:gap-4">
      {isComingSoon ? (
        <CursorTooltip
          label="Coming Soon"
          variant="primary"
          className={previewShellClassName}
        >
          {previewInner}
        </CursorTooltip>
      ) : (
        <div className={previewShellClassName}>{previewInner}</div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <p
            className={`inline-flex shrink-0 rounded-sm px-2 py-1 font-mono text-xs font-normal ${TYPE_CHIP_CLASS[type]}`}
            title={TYPE_TITLE[type]}
          >
            {TYPE_LABEL[type]}
          </p>
          <h3 className="min-w-0 flex-1 font-serif text-xl leading-[1.05] tracking-[-0.02em] text-black">
            {title}
          </h3>
        </div>
        <p className="font-sans text-[0.8125rem] font-normal text-neutral-400">
          {description}
        </p>
      </div>
    </article>
  );
}
