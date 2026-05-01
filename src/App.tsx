import AsciiParallax from "./components/AsciiParallax";
import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import ProjectItem, { projectItemGradientB } from "./components/ProjectItem";

const experience = [
  {
    year: "2024",
    company: "Distributional",
    role: "Staff Product Engineer + Lead Designer",
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
      <CustomCursor />
      <Header />

      <main
        id="work"
        className="mx-auto flex w-full max-w-8xl flex-1 flex-col px-6 pb-16"
      >
        <div className="w-full">
          <div className="relative left-1/2 -translate-x-1/2 hidden w-screen py-15 md:block">
            <AsciiParallax />
          </div>
          <div className="grid w-full grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:items-end">
            <p className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[0.01em] text-black">
              I&apos;m <span className="italic">Katrina</span>, a product
              <br />
              engineer who also designs.
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
          <ProjectItem
            type="case-study"
            title="LLM-as-a-Judge Eval Creation"
            description="Designing the interface for authoring LLM-powered evaluation metrics — a form that's fast when picking a template and forgiving when writing a custom prompt from scratch."
          />
          <ProjectItem
            gradient={projectItemGradientB}
            type="snapshot"
            title="Trace Inspection"
            description="In recent months, we decided to revisit our page designs and apply our design rules to them more consistently."
          />
          <ProjectItem
            type="snapshot"
            title="Custom Dashboards"
            description="In recent months, we decided to revisit our page designs and apply our design rules to them more consistently."
          />
          <ProjectItem
            gradient={projectItemGradientB}
            type="case-study"
            title="Query Builder"
            description="Designing the filter primitive used across the product — a column, operator, and value row that adapts its inputs to whatever data type you're filtering, so users learn it once and recognize it everywhere."
          />
          <ProjectItem
            type="concept"
            title="Anki Flashcards Redesign"
            description="A study of how Anki could feel calmer and easier to come back to every day, reimagined around my own practice of learning Chinese."
          />
        </section>
      </main>
    </div>
  );
}

export default App;
