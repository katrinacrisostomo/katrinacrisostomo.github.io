import { type ReactNode } from "react";

type SlideImageCaptionProps = {
  children: ReactNode;
  className?: string;
};

const baseClassName = "font-sans text-sm italic text-neutral-400";

export default function SlideImageCaption({
  children,
  className,
}: SlideImageCaptionProps) {
  const composedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return <p className={composedClassName}>{children}</p>;
}
