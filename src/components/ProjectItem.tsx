import { CursorTooltip } from "./CursorTooltip";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const projectItemGradientA =
  "linear-gradient(125deg, #a8c8e0 0%, #b4aad8 42%, #c070c8 72%, #e0c0d0 100%)";

export const projectItemGradientB =
  "linear-gradient(118deg, #9ec0dc 0%, #c4c0e0 38%, #b060c0 68%, #e0a8b4 100%)";

const comingSoonPlaceholderSrc = "/work/gradient-placeholder.png";

export type ProjectTag = {
  label: string;
  /**
   * Tailwind classes used for the chip's colors (background, text, border, etc.).
   * Example: "bg-primary text-white" or "bg-secondary text-black".
   * Defaults to a neutral chip if omitted.
   */
  className?: string;
  /** Optional native tooltip shown on hover for quick context. */
  title?: string;
};

type ProjectItemProps = {
  gradient?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
  tags?: ProjectTag[];
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
  tags,
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

  const isExternalHref = !!href && /^(https?:)?\/\//i.test(href);

  const previewMedia = effectiveImageSrc ? (
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
  );

  const previewInner = href ? (
    isExternalHref ? (
      <a
        href={href}
        className="block h-full w-full"
        aria-label={title}
        target="_blank"
        rel="noopener noreferrer"
      >
        {previewMedia}
      </a>
    ) : (
      <Link to={href} className="block h-full w-full" aria-label={title}>
        {previewMedia}
      </Link>
    )
  ) : (
    <>
      {previewMedia}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <span className="rounded-full border-white/60 bg-white/45 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-neutral-800 shadow-sm backdrop-blur-sm">
          {chipLabel}
        </span>
      </div>
    </>
  );

  return (
    <article className="mb-6 flex flex-col gap-6 md:mb-0 md:gap-4">
      <motion.div
        className={previewShellClassName}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        {isComingSoon ? (
          <CursorTooltip
            label="Coming Soon"
            variant="primary"
            className="h-full w-full"
          >
            {previewInner}
          </CursorTooltip>
        ) : (
          previewInner
        )}
      </motion.div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {tags && tags.length > 0 && (
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {tags.map((tag, index) => (
                <p
                  key={`${tag.label}-${index}`}
                  className={`inline-flex shrink-0 rounded-sm px-2 py-1 font-mono text-xs font-normal ${
                    tag.className ?? "bg-neutral-100 text-neutral-700"
                  }`}
                  title={tag.title}
                >
                  {tag.label}
                </p>
              ))}
            </div>
          )}
          <h3 className="min-w-0 flex-1 font-serif text-xl leading-[1.05] tracking-[-0.02em] text-black">
            {title}
          </h3>
        </div>
        <p className="font-sans text-[0.875rem] font-normal text-neutral-400">
          {description}
        </p>
      </div>
    </article>
  );
}
