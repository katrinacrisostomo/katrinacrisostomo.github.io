import AsciiParallax from "../components/AsciiParallax";
import {
  CursorTooltip,
  type CursorTooltipVariant,
} from "../components/CursorTooltip";
import {
  Ham,
  Mountain,
  type LucideIcon,
  SportShoe,
  Sprout,
} from "lucide-react";
import { useState } from "react";

type EnjoyItem = {
  src: string;
  alt: string;
  Icon: LucideIcon;
  label: string;
  variant: CursorTooltipVariant;
};

const enjoyItems: EnjoyItem[] = [
  {
    src: "/about/enjoy-running.jpg",
    alt: "Group of friends in race medals after a half marathon",
    Icon: SportShoe,
    label: "Running (half) marathons",
    variant: "tertiary",
  },
  {
    src: "/about/enjoy-food.jpg",
    alt: "Overhead view of a shared meal with several dishes spread across a wood table",
    Icon: Ham,
    label: "Food with friends",
    variant: "secondary",
  },
  {
    src: "/about/enjoy-plants.jpg",
    alt: "Tray of seedlings in small pots on a patio",
    Icon: Sprout,
    label: "Gardening",
    variant: "primary",
  },
  {
    src: "/about/enjoy-hiking.jpg",
    alt: "Three pairs of hiking shoes resting at the edge of an alpine lake with the Matterhorn in the background",
    Icon: Mountain,
    label: "Gorpcore the way it was intended",
    variant: "tertiary",
  },
];

export default function AboutPage() {
  const [isPortraitLoaded, setIsPortraitLoaded] = useState(false);

  return (
    <main
      id="about"
      className="mx-auto flex w-full max-w-8xl flex-1 flex-col px-6 pt-10 pb-16 md:pt-0"
    >
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 pt-10 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-35">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-white md:self-start">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-500 ease-out ${
              isPortraitLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src="/about/portrait.png"
            alt="Katrina holding a green smoothie, surrounded by tropical plants"
            width={1792}
            height={2390}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setIsPortraitLoaded(true)}
            onError={() => setIsPortraitLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-500 ease-out ${
              isPortraitLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="flex flex-col gap-5 md:h-full md:justify-end pb-0 md:pb-5">
          <h1 className="font-serif text-[clamp(1.85rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[-0.01em] text-black">
            Hi <span aria-hidden>👋</span> I&apos;m Katrina
          </h1>
          <p className="font-sans text-md leading-[1.55] text-neutral-400 max-w-[87%]">
            I love turning complex technical problems into products that feel
            simple to use. I currently lead frontend engineering + design for an
            AI analytics platform.
          </p>
        </div>
      </section>

      <div className="relative left-1/2 -translate-x-1/2 hidden w-screen py-35 md:block">
        <AsciiParallax rowCount={2} />
      </div>
      <div className="relative left-1/2 block -translate-x-1/2 w-screen md:hidden py-20">
        <AsciiParallax fontSize={14} rowCount={2} />
      </div>

      <section
        aria-labelledby="enjoy-heading"
        className="mx-auto w-full max-w-5xl pb-35"
      >
        <h2
          id="enjoy-heading"
          className="text-center font-serif text-2xl font-medium text-black"
        >
          Some things I enjoy
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-3 lg:grid-cols-4">
          {enjoyItems.map((item) => (
            <li
              key={item.src}
              className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200"
            >
              <CursorTooltip
                label={item.label}
                variant={item.variant}
                icon={<item.Icon className="h-5 w-5" aria-hidden />}
                className="h-full w-full"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </CursorTooltip>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
