import { ArrowBigLeft } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useSnapshotContext } from "./SnapshotContext";

export default function SnapshotTableOfContents() {
  const { items, activeId } = useSnapshotContext();

  const scrollToSection = useCallback((id: string) => {
    if (typeof document === "undefined") {
      return;
    }

    const targetSection = document.getElementById(id);
    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <aside className="hidden md:block px-6">
      <div className="sticky top-12 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <nav aria-label="Snapshot table of contents">
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-sm bg-neutral-100 px-2 py-1 text-[0.8125rem] font-normal font-mono text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black"
          >
            <ArrowBigLeft className="h-2.5 w-2.5 shrink-0" aria-hidden />
            Home
          </Link>
          <ul className="mt-10 flex flex-col gap-3">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const itemClassName = isActive
                ? "font-medium text-black"
                : "font-normal text-neutral-400 hover:text-black";

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`cursor-pointer text-xs font-mono text-left transition-colors ${itemClassName}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
