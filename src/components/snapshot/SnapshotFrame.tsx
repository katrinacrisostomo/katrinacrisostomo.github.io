import { type ReactNode } from "react";

type SnapshotFrameProps = {
  /** Content to render inside the framed box (e.g. an animation or image). */
  children: ReactNode;
  /** Optional caption rendered below the frame, in small muted text. */
  caption?: ReactNode;
  /** Additional classes on the outer `<figure>` (controls spacing, width, etc.). */
  className?: string;
  /** Additional classes on the inner box (controls padding, background, etc.). */
  innerClassName?: string;
  /** Override the rendered element id for anchor links. */
  id?: string;
};

const baseInnerClassName =
  "flex w-full items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 p-6 md:p-10";

const baseWrapperClassName = "flex w-full flex-col gap-3";

export default function SnapshotFrame({
  children,
  caption,
  className,
  innerClassName,
  id,
}: SnapshotFrameProps) {
  const composedWrapperClassName = className
    ? `${baseWrapperClassName} ${className}`
    : baseWrapperClassName;

  const composedInnerClassName = innerClassName
    ? `${baseInnerClassName} ${innerClassName}`
    : baseInnerClassName;

  return (
    <figure id={id} className={composedWrapperClassName}>
      <div className={composedInnerClassName}>{children}</div>
      {caption ? (
        <figcaption className="font-sans text-[0.8125rem] leading-[1.5] text-neutral-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
