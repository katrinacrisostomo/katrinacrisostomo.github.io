type SlideshowProgressBarProps = {
  currentIndex: number;
  total: number;
};

export default function SlideshowProgressBar({
  currentIndex,
  total,
}: SlideshowProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const progress = ((currentIndex + 1) / safeTotal) * 100;
  const width = `${Math.min(Math.max(progress, 0), 100)}%`;

  return (
    <div
      className="sticky z-20 h-[2px] w-full bg-gray-200"
      style={{ top: "var(--slideshow-top, 0px)" }}
      aria-hidden
    >
      <div
        className="h-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width }}
      />
    </div>
  );
}
