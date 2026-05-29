import { useCallback, useState } from "react";
import {
  SnapshotBanner,
  SnapshotCarousel,
  SnapshotHeader,
  SnapshotLayout,
  SnapshotSection,
  type SnapshotCarouselSlide,
  type SnapshotStat,
} from "../components/snapshot";
import SnapshotCarouselModal from "../components/snapshot/SnapshotCarouselModal";

const brainstormSlide: SnapshotCarouselSlide = {
  src: "/work/trace-inspection/brainstorm.png",
  alt: "Brainstorm mapping out session details and trace and span details, including when users navigate to each view, what they expect to see, and entry points",
};

const projectStats: SnapshotStat[] = [
  { label: "Role", value: "Frontend Engineer + Designer" },
  { label: "Project length", value: "3 weeks from\nideation → ship" },
  { label: "Built with", value: "Typescript, React in Next.js app" },
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
  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
  const openBrainstorm = useCallback(() => setIsBrainstormOpen(true), []);
  const closeBrainstorm = useCallback(() => setIsBrainstormOpen(false), []);

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
            <figure className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={openBrainstorm}
                aria-label="Expand brainstorm image"
                className="group relative block w-full"
              >
                <img
                  src={brainstormSlide.src}
                  alt={brainstormSlide.alt}
                  className="block h-auto w-full max-w-full rounded-sm border border-neutral-200 bg-neutral-50"
                  loading="lazy"
                  decoding="async"
                />
                <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white">
                  Expand
                </span>
              </button>
              <figcaption className="font-sans text-[0.8125rem] leading-[1.5] text-neutral-400">
                Early brainstorm mapping out which pages should exist, what
                belongs on each one, and how users would flow between them.
              </figcaption>
            </figure>
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
      <SnapshotCarouselModal
        slides={[brainstormSlide]}
        activeIndex={isBrainstormOpen ? 0 : null}
        onClose={closeBrainstorm}
        onPrev={closeBrainstorm}
        onNext={closeBrainstorm}
      />
    </SnapshotLayout>
  );
}
