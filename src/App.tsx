const experience = [
  {
    year: "2024",
    company: "Distributional",
    role: "Staff Product Engineer & Lead Designer",
  },
  {
    year: "2022",
    company: "Here.fm",
    role: "Staff Product Engineer",
  },
  {
    year: "2021",
    company: "Lilia",
    role: "Founding Engineer",
  },
  {
    year: "2019",
    company: "Uplift",
    role: "Senior Software Engineer",
  },
] as const;

const projectPlaceholderGradientA =
  "linear-gradient(125deg, #a8c8e0 0%, #b4aad8 42%, #c070c8 72%, #e0c0d0 100%)";
const projectPlaceholderGradientB =
  "linear-gradient(118deg, #9ec0dc 0%, #c4c0e0 38%, #b060c0 68%, #e0a8b4 100%)";

function ProjectPlaceholder({ gradient }: { gradient?: string }) {
  return (
    <div
      className="aspect-[16/10] w-full rounded-sm shadow-sm ring-1 ring-black/5"
      style={{ background: gradient ?? projectPlaceholderGradientA }}
      aria-hidden
    />
  );
}

function App() {
  return (
    <div className="flex min-h-screen flex-col text-black">
      <header className="shrink-0 border-b border-neutral-200">
        <div className="mx-auto flex max-w-8xl flex-col gap-6 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-baseline sm:gap-5">
            <span className="font-mono text-sm font-medium uppercase">
              Katrina Crisostomo
            </span>
            <span className="text-sm font-mono uppercase text-neutral-400 sm:text-sm">
              Product Engineer & Designer
            </span>
          </div>
          <nav
            className="flex gap-8 font-mono text-sm uppercase sm:text-sm"
            aria-label="Primary"
          >
            <a className="font-medium text-black px-6" href="#work">
              Work
            </a>
            <a
              className="font-normal text-neutral-400 hover:text-black px-6"
              // href="#about"
            >
              About
            </a>
            <a
              className="font-normal text-neutral-400 hover:text-black px-6"
              // href="/resume.pdf"
            >
              Resume
            </a>
          </nav>
        </div>
      </header>

      <main
        id="work"
        className="mx-auto flex w-full max-w-8xl flex-1 flex-col px-6 pb-16 pt-56 md:pb-24 md:pt-64"
      >
        <div className="w-full">
          <div className="grid w-full grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2 lg:items-end lg:gap-x-20 xl:gap-x-24">
            <p className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium leading-[1.15] tracking-[0.01em] text-black">
              I&apos;m Katrina, a product engineer who also designs.
            </p>

            <div className="min-w-0 font-sans text-sm">
              <ul className="flex flex-col gap-8 lg:grid lg:w-full lg:grid-cols-[minmax(4.25rem,0.38fr)_minmax(0,0.46fr)_minmax(0,1.2fr)] lg:gap-x-8 lg:gap-y-3">
                {experience.map((row) => (
                  <li
                    key={`${row.year}-${row.company}`}
                    className="flex flex-col gap-1 border-b border-neutral-100 pb-8 last:border-0 last:pb-0 lg:contents lg:border-0 lg:pb-0"
                  >
                    <span className="text-neutral-400 tabular-nums">
                      {row.year}
                    </span>
                    <span className="text-black">{row.company}</span>
                    <span className="text-neutral-400">{row.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section
          className="mt-6 grid w-full grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-8"
          aria-label="Work samples"
        >
          <ProjectPlaceholder />
          <ProjectPlaceholder gradient={projectPlaceholderGradientB} />
          <ProjectPlaceholder />
          <ProjectPlaceholder gradient={projectPlaceholderGradientB} />
          <ProjectPlaceholder />
          <ProjectPlaceholder gradient={projectPlaceholderGradientB} />
          <ProjectPlaceholder />
          <ProjectPlaceholder gradient={projectPlaceholderGradientB} />
        </section>
      </main>
    </div>
  );
}

export default App;
