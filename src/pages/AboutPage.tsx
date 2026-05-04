import AsciiParallax from "../components/AsciiParallax";

export default function AboutPage() {
  return (
    <main
      id="about"
      className="mx-auto flex w-full max-w-8xl flex-1 flex-col px-6 pt-10 pb-16 md:pt-0"
    >
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 pt-10 md:grid-cols-[1fr_2fr] md:gap-12 md:pt-35">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-200 md:self-start">
          <img
            src="/about/portrait.svg"
            alt="Katrina holding a green smoothie, surrounded by tropical plants"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 md:h-full md:justify-end pb-0 md:pb-5">
          <h1 className="font-serif text-[clamp(1.85rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[-0.01em] text-black">
            Hi <span aria-hidden>👋</span> I&apos;m Katrina
          </h1>
          <p className="font-sans text-lg leading-[1.55] text-neutral-400">
            I design and build B2B tools for technical power-users. I currently
            lead frontend engineering and design for an AI analytics platform.
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
          <li className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
            <img
              src="/about/enjoy-running.svg"
              alt="Group of friends in race medals after a half marathon"
              className="h-full w-full object-cover"
            />
          </li>
          <li className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
            <img
              src="/about/enjoy-food.svg"
              alt="Overhead view of a shared meal with several dishes spread across a wood table"
              className="h-full w-full object-cover"
            />
          </li>
          <li className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
            <img
              src="/about/enjoy-plants.svg"
              alt="Tray of seedlings in small pots on a patio"
              className="h-full w-full object-cover"
            />
          </li>
          <li className="aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
            <img
              src="/about/enjoy-hiking.svg"
              alt="Three pairs of hiking shoes resting at the edge of an alpine lake with the Matterhorn in the background"
              className="h-full w-full object-cover"
            />
          </li>
        </ul>
      </section>
    </main>
  );
}
