import {
  SnapshotBanner,
  SnapshotCarousel,
  SnapshotHeader,
  SnapshotLayout,
  SnapshotSection,
  type SnapshotCarouselSlide,
  type SnapshotStat,
} from "../components/snapshot";

const projectStats: SnapshotStat[] = [
  { label: "Role", value: "Engineer + Designer" },
  { label: "Timeline", value: "3 weeks" },
  { label: "Built with", value: "React + TypeScript" },
  { label: "Designed with", value: "Prototype in code" },
];

const productScreens: SnapshotCarouselSlide[] = [
  {
    src: "/work/trace-inspection/screen-1.png",
    alt: "Trace details page with nested spans and timings",
  },
  {
    src: "/work/trace-inspection/screen-2.png",
    alt: "Session trace inspection UI with timeline and response details",
  },
  {
    src: "/work/trace-inspection/screen-3.png",
    alt: "Placeholder screen",
  },
  {
    src: "/work/trace-inspection/screen-4.png",
    alt: "Placeholder screen",
  },
];

export default function SessionTraceSnapshotPage() {
  return (
    <SnapshotLayout>
      <SnapshotBanner
        color="#6659d2"
        minHeightClassName="min-h-[18rem] md:min-h-[36rem]"
      >
        <img
          src="/work/trace-inspection/banner.png"
          alt="Trace details view with span tree, timeline, and input and output panels"
          className="max-h-[min(12rem,calc(100vh-12rem))] w-auto max-w-full object-contain md:max-h-[min(30rem,calc(100vh-14rem))]"
          loading="eager"
          decoding="async"
        />
      </SnapshotBanner>
      <div className="flex w-full flex-col gap-16 py-10 md:py-12">
        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotHeader
            title="Session and Trace Inspection"
            stats={projectStats}
            description="Designed and built at Distributional, an analytics platform for AI applications. This snapshot is a high-level look at how the inspection surface helps users move between sessions, traces, and spans without losing context."
          />
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-problem"
            title="The Problem"
            subtitle="Three levels of data"
          >
            <p>
              Distributional&apos;s users work with traces from LLM applications
              and sessions containing many tool calls and generations. The
              analysis workflow spans three levels: session metadata, trace
              context, and span-level details.
            </p>
            <p>
              Jumping between these levels was slow and mentally expensive.
              Users needed to stitch together context across multiple views,
              which made debugging harder than it should be.
            </p>
          </SnapshotSection>
        </div>

        <div className="mx-auto w-full max-w-[48rem]">
          <SnapshotSection
            id="the-solution"
            title="The Solution"
            subtitle="Navigating between Session and Trace"
          >
            <p>
              The new drawer introduced a direct path from session-level context
              to trace-level details. Opening a highlighted drawer shows the
              currently selected trace while keeping adjacent metadata within
              reach.
            </p>
            <p>
              A persistent &ldquo;View Session&rdquo; entry point keeps the
              relationship between session and trace obvious, so users can move
              between levels with less context switching.
            </p>
            <div className="w-full overflow-hidden rounded-[3px] bg-neutral-200 ring-1 ring-black/5">
              <video
                src="/work/trace-inspection/traceinspection.mp4"
                className="block h-auto w-full max-w-full"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Screen recording of navigating trace inspection"
              />
            </div>
          </SnapshotSection>
        </div>

        <SnapshotSection
          id="product-screens"
          title="Product Screens"
          subtitle="A closer look"
          headerClassName="mx-auto w-full max-w-[48rem]"
        >
          <SnapshotCarousel
            slides={productScreens}
            background="linear-gradient(90deg, #6659d2 0%, #5b52ce 100%)"
          />
        </SnapshotSection>
      </div>
    </SnapshotLayout>
  );
}
