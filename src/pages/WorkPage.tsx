import AsciiParallax from "../components/AsciiParallax";
import ProjectItem from "../components/ProjectItem";

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

export default function WorkPage() {
  return (
    <main
      id="work"
      className="mx-auto flex w-full max-w-8xl flex-1 flex-col px-6 pt-10 pb-16 md:pt-0"
    >
      <div className="w-full">
        <div className="relative left-1/2 -translate-x-1/2 hidden w-screen py-15 md:block">
          <AsciiParallax />
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:items-end">
          <p className="pt-28 font-serif text-[clamp(1.85rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[0.01em] text-black md:hidden">
            I&apos;m <span className="italic">Katrina</span>,
            <br />
            a product engineer
            <br />+ designer.
          </p>
          <p className="hidden font-serif text-[clamp(1.85rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[0.01em] text-black md:block md:pt-0">
            I&apos;m <span className="italic">Katrina</span>, a product
            <br />
            engineer + designer.
          </p>
          <div className="relative left-1/2 block -translate-x-1/2 w-screen md:hidden pb-10">
            <AsciiParallax fontSize={14} />
          </div>
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
        className="mt-6 grid w-full grid-cols-1 gap-6 pt-13 md:mt-8 md:grid-cols-2 md:gap-8 md:pt-0"
        aria-label="Work samples"
      >
        <ProjectItem
          type="case-study"
          title="Agent Path Visualization"
          description="Designing and building an interactive visualization to help users understand the paths their agent took in their LLM applications."
          href="/sankey-agent-paths"
          imageSrc="/work/agent-path-sankey-4.png"
          imageAlt="Agent path Sankey chart screenshot"
          isComingSoon={false}
        />
        <ProjectItem
          type="snapshot"
          title="Session and Trace Inspection"
          description="An inspection surface for LLM traces — allows users to debug their LLM apps by easily navigating between sessions, traces, and spans."
          imageSrc="/work/session-trace-inspection-2.png"
          imageAlt="Session and trace inspection screenshot"
          href="/session-trace-inspection"
          isComingSoon={false}
        />
        <ProjectItem
          type="blog-article"
          title="Beyond Summary Metrics"
          description="Designing and building a distribution comparison workflow that helps teams see how agent behavior changes across experiments, errors, models, and user cohorts."
          imageSrc="/work/distribution-comparison.png"
          imageAlt="Distribution comparison screenshot"
          href="https://www.distributional.com/blog/beyond-averages-how-dbnls-distribution-comparison-reveals-what-summary-metrics-hide"
          isComingSoon={false}
        />
        <ProjectItem
          type="blog-article"
          title="Query Builder"
          description="Designing the filter primitive used across the product — a column, operator, and value row that adapts its inputs to whatever data type you're filtering, so users learn it once and recognize it everywhere."
          imageSrc="/work/query-builder.png"
          imageAlt="Query builder filters screenshot"
          href="/query-builder"
          isComingSoon={false}
        />
        <ProjectItem
          type="snapshot"
          title="A Shared System for Data Exploration"
          description="Designing and building foundational visualization components that gave the platform a consistent way to present trends, comparisons, distributions, and user journeys."
        />
        <ProjectItem
          type="snapshot"
          title="LLM-as-a-Judge Eval Creation"
          description="Designing the interface for authoring LLM-powered evaluation metrics — a form that's fast when picking a template and forgiving when writing a custom prompt from scratch."
        />
      </section>
    </main>
  );
}
