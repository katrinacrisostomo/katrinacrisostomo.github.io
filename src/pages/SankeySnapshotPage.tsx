import Highlighter from "../components/Highlighter";
import {
  Slide,
  SlideImageCaption,
  SlideText,
  SlideTitle,
  Slideshow,
} from "../components/slideshow";

const userQuestions = [
  "What are the most common paths?",
  "Where do errors cluster?",
  "Which paths cost the most?",
  "Which paths run the slowest?",
];

const titleStats = [
  { label: "My role", value: "Frontend Engineer\n+ Designer" },
  { label: "Built with", value: "Typescript, React in Next.js app" },
  { label: "Designed with", value: "Prototype in code" },
];

function TitleSlide() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.88fr)] md:gap-14">
      <div className="text-left">
        <h1 className="font-serif text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.04] tracking-[-0.02em] text-black">
          Agent Path
          <br />
          Visualization
        </h1>
        <p className="mt-6 font-sans text-sm font-normal leading-[normal] tracking-normal text-black/30 italic">
          May 12th, 2026
        </p>
        <p className="mt-12 max-w-[22rem] font-sans text-[1.0625rem] font-normal leading-[1.5] tracking-normal text-black/80">
          Designed and built at Distributional, an analytics platform for AI
          applications.
        </p>
        <div className="mt-12 grid max-w-[22rem] grid-cols-3 gap-x-5 gap-y-6">
          {titleStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <p className="font-mono text-[0.68rem] uppercase text-neutral-400">
                {stat.label}
              </p>
              <p className="font-sans text-[0.975rem] leading-[1.35] whitespace-pre-line text-black">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <img
        src="/work/agent-path-sankey-3.png"
        alt="Agent path Sankey chart screenshot"
        className="w-full rounded-[3px] object-cover ring-1 ring-black/5"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function AgentsDontRunInStraightLines() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Agents don&apos;t run in straight lines.</SlideTitle>
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-16">
        <SlideText className="min-w-0">
          <p>
            Our users build LLM applications &mdash; PMs and engineers shipping
            multi-step agent pipelines into production. Their agents branch,
            retry, call tools, and sometimes terminate in surprising places.
            Looking at flat trace logs tells you nothing about the shape of all
            that.
          </p>
          <p>
            <Highlighter color="pink" animate="visible">
              You need to see the flow in order to understand how your agent is
              behaving.
            </Highlighter>
          </p>
        </SlideText>
        <div className="flex min-w-0 w-full flex-col items-center gap-6">
          <img
            src="/work/sankey-slides/agents-no-straight-lines-2.png"
            alt="Agent trace tree branching from ChatAgent into retriever, calculator, and code_executor"
            className="w-full object-contain"
            loading="lazy"
            decoding="async"
          />
          <SlideImageCaption>
            One trace is a path. Production is a tree of paths.
          </SlideImageCaption>
        </div>
      </div>
    </div>
  );
}

function BorrowWhatUsersKnow() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Borrow what users already know.</SlideTitle>
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-16">
        <SlideText>
          <p>
            Traditional product analytics tools like Mixpanel and Amplitude have
            spent years training people to read Sankey-style user journeys. It
            has become the standard way in analytics to get a view into what
            your users are doing.
          </p>
          <p>
            An agent&apos;s path through tool calls and LLM invocations is the
            same shape of question, so we landed on using the same chart to
            display what is essentially the agent&apos;s journey.
          </p>
          <p>
            <Highlighter color="pink" animate="visible">
              Same visual vocabulary, new domain. Less of a learning curve for
              the user.
            </Highlighter>
          </p>
        </SlideText>
        <div className="flex flex-col items-center gap-4">
          <img
            src="/work/sankey-slides/borrow-what-users-know.png"
            alt="User journey Sankey chart in Mixpanel showing checkout and sign-up flows"
            className="w-full max-w-[32rem] object-contain"
            loading="lazy"
            decoding="async"
          />
          <SlideImageCaption>
            User Journey Sankey Chart in Mixpanel
          </SlideImageCaption>
        </div>
      </div>
    </div>
  );
}

function AgentJourneysArentUserJourneys() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>But agent journeys aren&apos;t user journeys.</SlideTitle>
      <SlideText>
        <p>
          User journeys are bounded &mdash; sign up, onboard, convert. Agent
          call trees are much larger and more complex: 10+ levels deep, dozens
          of branches at each level, no guarantee any two traces look alike.
        </p>
        <p>
          Rendering the whole thing at once produced a wall of unreadable nodes.
          If we couldn&apos;t display the full tree, I realized{" "}
          <Highlighter color="pink" animate="visible">
            I needed to prototype while designing
          </Highlighter>
          &mdash; to play around with what &quot;navigating the tree&quot;
          should feel like.
        </p>
      </SlideText>
      <img
        src="/work/sankey-slides/agent-journeys-arent-user-journeys.png"
        alt="User journey Sankey with sign up, onboard, dashboard, drop, and bounce nodes alongside a dense agent call tree branching from ChatAgent"
        className="mt-10 w-full object-contain"
        loading="lazy"
        decoding="async"
      />
      <div className="mt-4 grid grid-cols-1 gap-2 text-center md:grid-cols-2 md:gap-10">
        <SlideImageCaption>
          User Journey &mdash; Easy to visually parse.
        </SlideImageCaption>
        <SlideImageCaption>
          Agent Journey &mdash; Difficult to visually parse the full tree.
        </SlideImageCaption>
      </div>
    </div>
  );
}

function FirstInstinctJustAddDepth() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>First instinct: just add depth.</SlideTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:gap-10">
        <SlideText className="md:col-span-1">
          <p>
            The earliest prototype I built added a &quot;show one more
            level&quot; control &mdash; render 3 levels by default, click to add
            a 4th, then a 5th.
          </p>
          <p>
            Navigating the depth was easy. Breadth was the actual problem. At
            each level, dozens of sibling nodes competed for vertical space and
            the chart turned into a tangle of crossing links.
          </p>
        </SlideText>
        <div className="flex flex-col gap-2 md:col-span-2">
          <video
            src="/work/sankey-slides/AddDepthSankey.mp4"
            className="w-full max-w-full object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <SlideImageCaption>
            Early prototype with simple depth control. Even just a few levels
            in, the sibling nodes overwhelmed the vertical space and the chart
            became unreadable.
          </SlideImageCaption>
        </div>
      </div>
    </div>
  );
}

function UserQuestionsSlide() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>What were users actually trying to understand?</SlideTitle>
      <SlideText>
        <p>
          I had to take a step back. Before trying more controls, we needed to
          think about what questions the user would want the chart to answer
          about the agent journey within their app.
        </p>
      </SlideText>
      <div className="mt-10 grid grid-cols-2 auto-rows-fr gap-4 md:grid-cols-4 md:gap-6">
        {userQuestions.map((question, index) => (
          <div
            key={question}
            className="flex h-full flex-col items-center rounded-sm border border-neutral-200 bg-neutral-50 p-4 text-center md:aspect-square md:h-auto md:p-6"
          >
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-neutral-400 uppercase">
              Question {index + 1}
            </p>
            <div className="flex flex-1 items-center">
              <p className="font-sans text-[1rem] leading-[1.4] text-neutral-700">
                &ldquo;{question}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreadthBeforeDepth() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Breadth before depth.</SlideTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:gap-10">
        <SlideText className="md:col-span-1">
          <p>
            The questions weren&apos;t really about seeing everything. They were
            about seeing the top 5 or bottom 5 of something &mdash; most errors,
            slowest paths, lowest feedback.
          </p>
          <p>
            So breadth became a control: &quot;Show top/bottom N.&quot;
            Everything else collapses into an &quot;Other&quot; node so the
            proportions stay honest. The user picks the slice; the chart stays
            readable.
          </p>
        </SlideText>
        <video
          src="/work/sankey-slides/SankeyBreadthNavigation.mp4"
          className="w-full max-w-full object-contain md:col-span-2"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}

function DepthOneNodeAtATime() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Depth, one node at a time.</SlideTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:gap-10">
        <SlideText className="md:col-span-1">
          <p>
            Once breadth was solved, depth became simple. Each node gets a{" "}
            <code className="font-mono text-[0.9em] text-neutral-700">+</code>{" "}
            button on hover. Click it, the chart fetches that node&apos;s
            children and grows one column to the right.
          </p>
          <p>
            Only the active path expands. Siblings stay visible (so you
            don&apos;t lose context) but their children don&apos;t render until
            you focus on them. You&apos;re following a path, not exploding the
            whole tree.
          </p>
        </SlideText>
        <video
          src="/work/sankey-slides/DepthOneNode.mp4"
          className="w-full max-w-full object-contain md:col-span-2"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      </div>
    </div>
  );
}

function LazyByDesign() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Lazy by design.</SlideTitle>
      <SlideText>
        <p>
          Because the chart only ever renders the active path, its performance
          is bounded by what&apos;s visible &mdash; not by the size of the
          underlying tree. A user with a 100-node trace and a user with a
          100,000-node trace get the same fast initial paint.
        </p>
        <p>
          The backend works the same way. Instead of computing the full tree
          upfront, it returns the first 4 levels and only computes deeper layers
          when the user expands into them. Smaller payloads, faster paints, no
          degradation as the underlying data scales.
        </p>
      </SlideText>
      <img
        src="/work/sankey-slides/lazy-by-design.png"
        alt="Side-by-side comparison of the full unbounded agent call tree versus the trimmed initial render with only the first few levels"
        className="mt-10 w-full object-contain"
        loading="lazy"
        decoding="async"
      />
      <div className="mt-4 grid grid-cols-1 gap-2 text-center md:grid-cols-2 md:gap-10">
        <SlideImageCaption>
          What exists in the data, technically unbounded tree that would greatly
          affect performance upon render
        </SlideImageCaption>
        <SlideImageCaption>
          The data displayed on initial render, much faster initial paint
        </SlideImageCaption>
      </div>
    </div>
  );
}

function ClientSideTreeStateManagement() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Client-side tree state management.</SlideTitle>
      <SlideText>
        <p>
          The chart&apos;s expansion state lives entirely on the client. Each
          node tracks whether it&apos;s expanded, whether it&apos;s on the
          active path, and whether its children have been fetched &mdash; all of
          it reactive to whatever filters or parameters the user changes.
        </p>
        <p>
          Only one node per depth could be expanded at a time, so when the user
          expanded a different node on the same level, I had to traverse the
          tree, prune the previous active node&apos;s children, and graft the
          newly fetched ones in their place &mdash; otherwise the chart would
          carry stale branches from a path the user had moved off of.
        </p>
      </SlideText>
      <img
        src="/work/sankey-slides/client-side-management-2.png"
        alt="Diagram showing base query and expansion cache feeding tree traversal that produces the final graph nodes and links"
        className="mt-10 w-full max-w-[36rem] self-center object-contain"
        loading="lazy"
        decoding="async"
      />
      <div className="mt-10">
        <SlideText>
          <p>
            I split the data layer in two: a base query that loads the first 4
            levels, and an expansion cache that incrementally fetches deeper
            levels on demand. Change a filter, the whole expansion state resets
            cleanly.
          </p>
        </SlideText>
      </div>
    </div>
  );
}

function SomeFixesBelongInLibrary() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle>Some fixes belong in the library.</SlideTitle>
      <SlideText>
        <p>
          At one point I hit a limit in the chart library&apos;s Sankey
          component &mdash; it couldn&apos;t lay nodes out the way the
          interaction model required. I could have worked around it on the
          client, but the cleaner fix was to push the missing capability into
          the library itself.
        </p>
        <p>
          <a
            href="https://github.com/recharts/recharts/pull/6576"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-400 underline-offset-2 hover:text-neutral-900"
          >
            The PR was reviewed and merged upstream into Recharts
          </a>
          , so every Recharts user inherits the same capability now.
        </p>
      </SlideText>
      <div className="mt-10 overflow-hidden rounded-[3px] border border-neutral-200 pr-6 md:pr-10">
        <img
          src="/work/sankey-slides/belong-in-library-2.png"
          alt="GitHub pull request titled Add verticalAlign prop for Sankey #6576 merged into recharts:main"
          className="w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

const projectSummaryDetails = [
  { label: "My role", value: "Frontend Engineer\n+ Designer" },
  { label: "Built with", value: "Typescript, React in Next.js app" },
  { label: "Designed with", value: "Prototype in code" },
  { label: "Open source contributions", value: "Recharts Sankey Component" },
];

function ProjectSummary() {
  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col">
      <SlideTitle className="mb-4!">Project summary.</SlideTitle>
      <SlideText>
        <p>
          The goal was to create a chart that would help users understand how
          their agents actually behave in production. I designed and built an
          interactive Sankey chart that would allow users to see the full path
          of an agent's execution, from start to finish.
        </p>
      </SlideText>
      <img
        src="/work/sankey-slides/project-summary.png"
        alt="Agent Path Sankey chart shipped in production"
        className="mt-5 hidden h-[22rem] w-full object-cover object-top md:block"
        loading="lazy"
        decoding="async"
      />
      <div className="mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-7 md:flex md:justify-between md:gap-x-8">
        {projectSummaryDetails.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-col gap-1 md:max-w-[11.5rem] md:flex-none"
          >
            <p className="font-mono text-[0.68rem] uppercase text-neutral-400">
              {detail.label}
            </p>
            <p className="font-sans text-[1rem] leading-[1.35] whitespace-pre-line text-black">
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SankeySnapshotPage() {
  return (
    <main className="mx-auto flex w-full max-w-8xl flex-1 flex-col md:min-h-0 md:overflow-hidden">
      <Slideshow
        name="Snapshot: A Sankey Chart for Agent Path Visualization"
        backHref="/"
        backLabel="Go back to work page"
      >
        <Slide>
          <TitleSlide />
        </Slide>
        <Slide>
          <AgentsDontRunInStraightLines />
        </Slide>
        <Slide>
          <BorrowWhatUsersKnow />
        </Slide>
        <Slide>
          <AgentJourneysArentUserJourneys />
        </Slide>
        <Slide>
          <FirstInstinctJustAddDepth />
        </Slide>
        <Slide>
          <UserQuestionsSlide />
        </Slide>
        <Slide>
          <BreadthBeforeDepth />
        </Slide>
        <Slide>
          <DepthOneNodeAtATime />
        </Slide>
        <Slide>
          <LazyByDesign />
        </Slide>
        <Slide>
          <ClientSideTreeStateManagement />
        </Slide>
        <Slide>
          <SomeFixesBelongInLibrary />
        </Slide>
        <Slide>
          <ProjectSummary />
        </Slide>
      </Slideshow>
    </main>
  );
}
