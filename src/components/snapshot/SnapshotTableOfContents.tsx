import { useCallback } from "react";
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
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <nav aria-label="Snapshot table of contents">
          <ul className="mt-6 flex flex-col gap-2">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const itemClassName = isActive
                ? "font-medium text-black"
                : "font-normal text-neutral-400 hover:text-black";

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`cursor-pointer font-mono text-xs uppercase transition-colors ${itemClassName}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    — {item.label}
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
