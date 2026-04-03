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

function App() {
  return (
    <div className="flex min-h-screen flex-col text-black">
      <header className="shrink-0 border-b border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <div className="hidden flex-col gap-2 sm:flex sm:flex-row sm:items-baseline sm:gap-5">
            <span className="font-mono text-sm font-bold uppercase">
              Katrina Crisostomo
            </span>
            <span className="text-xs font-mono uppercase text-neutral-400 sm:text-sm">
              Product Engineer & Designer
            </span>
          </div>
          <nav
            className="flex gap-8 font-mono text-xs uppercase sm:text-sm"
            aria-label="Primary"
          >
            <a className="font-medium text-black" href="#work">
              Work
            </a>
            <a
              className="font-normal text-neutral-400 hover:text-black"
              // href="#about"
            >
              About
            </a>
            <a
              className="font-normal text-neutral-400 hover:text-black"
              // href="/resume.pdf"
            >
              Resume
            </a>
          </nav>
        </div>
      </header>

      <main
        id="work"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-16 pt-24 md:pb-24 md:pt-32"
      >
        <div className="grid w-full grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2 lg:items-end lg:gap-x-12">
          <p className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-black">
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
      </main>
    </div>
  );
}

export default App;
