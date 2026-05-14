type SlideshowNameProps = {
  name: string;
};

export default function SlideshowName({ name }: SlideshowNameProps) {
  return (
    <div className="pt-6 text-center font-mono text-xs text-neutral-400 uppercase">
      {name}
    </div>
  );
}
