import CanonicalSchemaDiagram from "../components/CanonicalSchemaDiagram";
import FilterTyping from "../components/FilterTyping";
import QueryBuilderDiagram from "../components/QueryBuilderDiagram";
import QueryStructureComparison from "../components/QueryStructureComparison";
import {
  SnapshotBanner,
  SnapshotFrame,
  SnapshotHeader,
  SnapshotLayout,
  SnapshotSection,
  type SnapshotStat,
} from "../components/snapshot";

const projectStats: SnapshotStat[] = [
  { label: "Role", value: "Frontend Engineer + Designer" },
  { label: "Timeline", value: "3 weeks" },
  { label: "Built with", value: "React + TypeScript" },
  { label: "Designed with", value: "Prototype in code" },
];

const bannerGradient =
  "linear-gradient(135deg, #a3c4e3 0%, #b6a4dc 48%, #c479ae 100%)";

export default function QueryBuilderSnapshotPage() {
  return (
    <SnapshotLayout>
      <SnapshotBanner
        gradient={bannerGradient}
        minHeightClassName="min-h-[18rem] md:min-h-[36rem]"
      >
        <img
          src="/work/query-builder/banner.png"
          alt="Query builder filter modal showing two structured rows for tool_call_count and output_relevancy with an Apply Filters button"
          className="my-auto max-h-[min(7rem,calc(100vh-14rem))] w-auto max-w-[min(100%,28rem)] object-contain md:max-h-[min(15rem,calc(100vh-18rem))] md:max-w-[min(100%,38rem)]"
          loading="eager"
          decoding="async"
        />
      </SnapshotBanner>
      <div className="flex w-full flex-col gap-16 py-10 md:py-12">
        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotHeader
            title="Query Builder"
            stats={projectStats}
            description="Designing a reusable querying interface for AI observability workflows. This snapshot walks through the product bets, tradeoffs, and interaction details behind the structured query builder we shipped at Distributional."
          />
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-brief"
            title="The Brief"
            subtitle="A query pattern that needed to scale beyond logs"
          >
            <p>
              We wanted users to be able to query their logs without needing to
              learn a custom query language first.
            </p>
            <p>
              At the time, the immediate need was log filtering. Users needed to
              answer questions like:
            </p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>Show me logs with errors</li>
              <li>Show me logs from Experiment A</li>
              <li>Show me requests where latency was high</li>
              <li>
                Show me traces from a specific model, prompt version, or
                customer
              </li>
            </ul>
            <p>
              But I knew this interaction would likely become more important
              than a one-off logs feature.
            </p>
            <p>
              Across the product, we were starting to need the same kind of
              filtering behavior in multiple places: filtering logs, narrowing
              dashboard graphs, creating eval datasets, and defining reusable
              groups of data. We called these reusable filters <em>segments</em>
              : a query that could be created once, saved, and used across
              different product surfaces.
            </p>
            <p>
              So the real design problem was not simply — How do we let users
              write a log query?
            </p>
            <p className="font-medium text-neutral-700">
              The design challenge was — How do we create a query UI that is
              easy enough for most users, flexible enough for power users, and
              structured enough to be reused across the product?
            </p>
            <SnapshotFrame caption="One Query Builder, reused across Logs, Dashboards, Evals, and Segments.">
              <QueryBuilderDiagram replayOnReenter />
            </SnapshotFrame>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-starting-point"
            title="Starting Point"
            subtitle="A powerful query language with too much user friction"
          >
            <p>We already had an internal query language within DBNL.</p>
            <p>
              The simplest implementation path was obvious: expose a textarea,
              let users write queries directly, and send the query to the
              backend.
            </p>
            <p>
              From an engineering perspective, that was attractive. It was
              flexible, fast to ship, and already aligned with how the backend
              understood queries. A user could technically express anything the
              query language supported.
            </p>
            <p>
              But from a product perspective, it pushed too much complexity onto
              the user.
            </p>
            <p>
              Most of our users were PMs and engineers working with LLM logs.
              Some were technical, some were not. Even for technical users,
              asking them to learn a new product-specific query language just to
              answer basic questions felt like a high-friction starting point.
            </p>
            <SnapshotFrame caption="Raw filter syntax — each new clause forces a re-wrap and re-indent.">
              <FilterTyping replayOnReenter />
            </SnapshotFrame>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-product-bet"
            title="Product Bet"
            subtitle="Most queries were simpler than the system allowed"
          >
            <p>
              My bet was that most queries users wanted to make were simple.
            </p>
            <p>
              They were not usually trying to write deeply nested expressions on
              day one. They were trying to narrow a dataset to a meaningful
              slice so they could inspect what happened.
            </p>
            <p>That changed how I thought about the interface.</p>
            <p>
              Instead of optimizing first for maximum expressiveness, I wanted
              to optimize for the most common query-building path: choose a
              field, choose an operator, choose a value.
            </p>
            <p>That structure gave us a few important things:</p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>It matched the way people already think about filters.</li>
              <li>It reduced the need to learn DBNL syntax.</li>
              <li>
                It created a structured representation we could save and
                re-render later.
              </li>
            </ul>
            <p>
              That third point mattered a lot. If a query was going to become a
              saved segment, the UI needed to be able to reconstruct the same
              inputs later. A raw string would have been flexible, but it would
              not preserve the user&apos;s original intent in a way that was
              easy to edit visually.
            </p>
            <SnapshotFrame caption="String input vs. structured query — one outcome vs. four.">
              <QueryStructureComparison replayOnReenter />
            </SnapshotFrame>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-alternative"
            title="The Alternative"
            subtitle="Presets broke without a canonical schema"
          >
            <p>
              One alternative I considered was a hybrid approach: keep the
              textarea, but add easy preset buttons for common queries like
              &ldquo;View logs with errors&rdquo;.
            </p>
            <p>
              This initially seemed promising. It would give new users a quick
              starting point while preserving the full flexibility of the query
              language.
            </p>
            <p>
              But there was a problem: our users could upload and define very
              different kinds of data.
            </p>
            <p className="font-medium text-neutral-700">
              There was no canonical schema.
            </p>
            <p>
              One team might have a field called <code>status</code>. Another
              might use <code>error_type</code>, <code>level</code>,{" "}
              <code>is_error</code>, or something completely custom. Even
              something as simple as &ldquo;show me errors&rdquo; depended on
              knowing how that user&apos;s data was shaped.
            </p>
            <p>
              Presets would either be too generic to be useful or too
              opinionated to work reliably.
            </p>
            <p>
              The interface needed to adapt to the user&apos;s actual columns,
              not assume a fixed schema.
            </p>
            <SnapshotFrame caption="Without a canonical schema, a single &ldquo;errors&rdquo; preset can't reliably map to every dataset.">
              <CanonicalSchemaDiagram replayOnReenter />
            </SnapshotFrame>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-solution"
            title="The Solution"
            subtitle="A structured row-based query builder"
          >
            <p>The final direction was a row-based query builder.</p>
            <p>Each row represented one condition:</p>
            <p className="font-mono text-[0.8125rem] text-neutral-700">
              Column → Operator → Value
            </p>
            <p>
              All rows were ANDed together. That matched the most common mental
              model for incrementally narrowing data: add one condition, then
              another, then another.
            </p>
            <p>For example:</p>
            <ul className="space-y-1.5 list-none font-mono text-[0.8125rem] text-neutral-700 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>output_relevancy is irrelevant</li>
              <li>total_cost is greater than 1.25</li>
              <li>tool_call_count is greater than or equal to 4</li>
            </ul>
            <p>
              This was not the most expressive possible query builder. That was
              intentional.
            </p>
            <p>
              The goal was to make the common path obvious, fast, and hard to
              get wrong &mdash; while still leaving room for more advanced logic
              later.
            </p>
            <div className="w-full overflow-hidden rounded-[3px] ring-1 ring-black/5">
              <img
                src="/work/query-builder/rows-without-buttons.png"
                alt="Final query builder UI with stacked structured rows over a soft blue-to-pink gradient background"
                className="block h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-system"
            title="The System"
            subtitle="Designing around column types, operators, and values"
          >
            <p>
              The next layer of complexity was that the operator and value input
              depended on the column&apos;s data type.
            </p>
            <p>
              A boolean field should not have the same controls as a string
              field. A numeric field needed comparison operators. A categorical
              field could support selection. A timestamp field might eventually
              need date-specific affordances.
            </p>
            <p>
              To move quickly, I designed support around the most common data
              types first, while making sure the underlying structure could grow
              over time.
            </p>
            <p>That meant defining a clear relationship between:</p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>Column type</li>
              <li>Available operators</li>
              <li>Expected value input</li>
              <li>Serialized query representation</li>
            </ul>
            <p>
              For the first version, the goal was not to support every possible
              DBNL expression through the UI. The goal was to create a
              foundation where new data types and operators could be added
              without redesigning the entire interaction.
            </p>
            <SnapshotFrame>
              <img
                src="/work/query-builder/row-types.png"
                alt="Three query builder rows illustrating different value input types: a string contains match, a numeric greater-than comparison, and a multi-select 'any of' picker."
                className="block h-auto w-full max-w-[36rem] object-contain"
                loading="lazy"
                decoding="async"
              />
            </SnapshotFrame>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-tradeoff"
            title="The Tradeoff"
            subtitle="Keeping the common path simple without closing off advanced use"
          >
            <p>
              The row-based UI made query building much easier, but it
              introduced a real tradeoff: users were now limited to what the
              interface supported.
            </p>
            <p>
              That was fine for the common path, but not enough for every use
              case.
            </p>
            <p>
              There would always be edge cases where a user wanted to express
              something more advanced than the structured rows could handle. We
              could keep layering on UI affordances, but eventually the
              interface would either become too complex or still fail to cover
              some advanced DBNL expression.
            </p>
            <p>
              So we added an escape hatch: an <em>advanced expression row</em>.
            </p>
            <p>
              Users could build as much of their query as possible with the
              structured UI, then add a freeform DBNL expression when they
              needed more control. The advanced expression was ANDed with the
              rest of the rows, and users could also use it on its own if they
              preferred.
            </p>
            <p>This gave us a more balanced interface:</p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>Simple things stayed simple.</li>
              <li>Advanced things remained possible.</li>
              <li>
                We did not need to expose the full query language as the default
                experience.
              </li>
            </ul>
            <video
              src="/work/query-builder/advancedexpression.mp4"
              className="block h-auto w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50"
              autoPlay
              loop
              muted
              playsInline
            />
            <figcaption className="font-sans text-[0.8125rem] leading-[1.5] text-neutral-400">
              Progressive disclosure of the advanced expression feature.
            </figcaption>
          </SnapshotSection>
        </div>

        {/* <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-interaction-detail"
            title="Interaction Detail"
            subtitle="Making query application feel intentional"
          >
            <p>
              One detail that mattered more than it first appeared was when the
              query should actually apply.
            </p>
            <p>There were a few options:</p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>Apply on every input change</li>
              <li>Apply when a row changes</li>
              <li>Apply when the modal closes</li>
              <li>Apply only after an explicit Apply button click</li>
            </ul>
            <p>
              The first two options were too expensive. Many of these queries
              could be slow or costly, especially if the data had not been
              cached yet. We did not want to kick off a query while the user was
              still composing it.
            </p>
            <p>
              Initially, we applied the query when the modal closed. It saved a
              click and seemed reasonable: if the user closed the modal, they
              were probably done.
            </p>
            <p>
              But after shipping, we saw that users were confused. Some were not
              sure whether closing the modal would apply the query or discard
              it. The behavior was technically efficient, but the mental model
              was unclear.
            </p>
            <p>
              I made the decision to switch to an explicit{" "}
              <strong className="font-medium text-neutral-700">Apply</strong>{" "}
              button.
            </p>
            <p>
              It added one click, but it made the interaction feel safer. Users
              could compose a query, review it, and intentionally apply it when
              ready.
            </p>
          </SnapshotSection>
        </div> */}

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-outcome"
            title="Outcome"
            subtitle="One query contract across product surfaces"
          >
            <p>
              The most important outcome was that the query builder became a
              shared UI language across the product.
            </p>
            <p>
              A user could learn the pattern once, then encounter it again in
              different contexts:
            </p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>Filtering logs</li>
              <li>Creating a saved segment</li>
              <li>Filtering dashboard graphs</li>
              <li>Drilling from a data point into the logs behind it</li>
              <li>Defining the dataset for an eval</li>
            </ul>
            <p>
              That consistency mattered because the query itself became a kind
              of product contract. Product surfaces could pass the same
              structured query around and use it in different ways.
            </p>
            <p>
              A segment created from logs could later be used in a dashboard. A
              chart could use the same filter structure to generate a drilldown.
              An eval could use the segment as a starting dataset.
            </p>
            <p className="font-medium text-neutral-700">
              The query builder was no longer just a form. It became connective
              tissue.
            </p>
            <video
              src="/work/query-builder/drilldown[final]-nobg.mp4"
              className="block h-auto w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-50"
              autoPlay
              loop
              muted
              playsInline
            />
            <aside className="rounded-md border border-neutral-200 bg-neutral-50 p-5">
              <p className="font-mono text-[0.75rem] tracking-[0.12em] text-neutral-400 uppercase">
                In Practice
              </p>
              <p className="mt-3 font-sans text-[0.95rem] leading-[1.6] text-neutral-500">
                A PM investigating a CSAT drop builds one filter in Logs &mdash;{" "}
                <span className="font-mono text-[0.85em] text-neutral-500 mx-1">
                  topic = billing
                </span>{" "}
                and{" "}
                <span className="font-mono text-[0.85em] text-neutral-500 mx-1">
                  user frustration &ge; 0.6
                </span>{" "}
                &mdash; then follows it across Trends, Distribution, and
                drilldown views. Because the same filter travels with them, the
                PM can move from the aggregate CSAT spike to the 11 traces
                behind May 22 without rebuilding context at each step.
              </p>
            </aside>
          </SnapshotSection>
        </div>

        {/* <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-shipped-experience"
            title="Shipped Experience"
            subtitle="A reusable query UI with an advanced escape hatch"
          >
            <p>The shipped version included:</p>
            <ul className="space-y-1.5 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:content-['\2014'] [&>li]:before:text-neutral-400">
              <li>A row-based query builder for structured conditions</li>
              <li>Column-aware operators and value inputs</li>
              <li>
                An optional advanced expression row for DBNL escape hatches
              </li>
              <li>A reusable serialized query structure</li>
              <li>An explicit Apply interaction</li>
              <li>Support for saving queries as reusable segments</li>
              <li>Integration across logs and other product surfaces</li>
            </ul>
            <p>It was intentionally scoped.</p>
            <p>
              We did not try to make every advanced query visually constructible
              in the first version. Instead, we focused on the foundation: make
              the common path feel obvious, preserve enough structure for reuse,
              and keep a path open for power users.
            </p>
          </SnapshotSection>
        </div> */}

        {/* <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-next-layer"
            title="The Next Layer"
            subtitle="Prompting as a faster path to structured queries"
          >
            <p>
              One thing I would have loved to explore next is prompting as an
              input method.
            </p>
            <p>For example, a user could type:</p>
            <p className="border-l-2 border-neutral-200 pl-4 italic text-neutral-600">
              Show me failed requests from Experiment A with latency over one
              second.
            </p>
            <p>
              The system could translate that into a structured query, show the
              generated rows, and let the user edit the result before applying
              it.
            </p>
            <p>
              I would not want prompting to replace the query builder. I would
              want it to accelerate it.
            </p>
            <p>
              The structured UI would still matter because it gives users
              something inspectable, editable, and reusable. Prompting could
              become a faster way to get to that structure, especially for users
              who know what they want but do not know which columns, operators,
              or syntax to use.
            </p>
          </SnapshotSection>
        </div> */}

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-takeaway"
            title="Takeaways"
            subtitle="Lessons learned"
          >
            <p>
              This project reinforced how much leverage can come from designing
              the right abstraction early. The query builder started as a way to
              filter logs, but the more important work was creating a shared
              interaction pattern that could move with users across the product.
            </p>
            <div className="flex flex-col gap-10 mt-5">
              <blockquote className="border-l-2 border-neutral-200 pl-4 not-italic">
                <footer className="mb-3 font-mono text-[0.75rem] tracking-[0.12em] text-neutral-400 uppercase">
                  Lesson #1
                </footer>
                <p className="font-serif text-[1.05rem] leading-[1.6] text-neutral-700">
                  The right abstraction wasn&apos;t a logs filter. It was a
                  reusable querying system.
                </p>
              </blockquote>
              <blockquote className="border-l-2 border-neutral-200 pl-4 not-italic">
                <footer className="mb-3 font-mono text-[0.75rem] tracking-[0.12em] text-neutral-400 uppercase">
                  Lesson #2
                </footer>
                <p className="font-serif text-[1.05rem] leading-[1.6] text-neutral-700">
                  Constraining complexity early made the feature easier to
                  learn.
                </p>
              </blockquote>
              <blockquote className="border-l-2 border-neutral-200 pl-4 not-italic">
                <footer className="mb-3 font-mono text-[0.75rem] tracking-[0.12em] text-neutral-400 uppercase">
                  Lesson #3
                </footer>
                <p className="font-serif text-[1.05rem] leading-[1.6] text-neutral-700">
                  Progressive disclosure balanced usability with expert
                  flexibility.
                </p>
              </blockquote>
            </div>
          </SnapshotSection>
        </div>
      </div>
    </SnapshotLayout>
  );
}
