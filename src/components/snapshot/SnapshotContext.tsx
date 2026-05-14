import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import useScrollSpy, { type ScrollSpyObserve } from "./hooks/useScrollSpy";

export type SnapshotTocItem = {
  id: string;
  label: string;
};

type SnapshotContextValue = {
  items: SnapshotTocItem[];
  activeId: string | null;
  register: (id: string, label: string) => void;
  unregister: (id: string) => void;
  observeSection: ScrollSpyObserve;
};

const SnapshotContext = createContext<SnapshotContextValue | null>(null);

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SnapshotTocItem[]>([]);
  const { activeId, observe } = useScrollSpy();

  const register = useCallback((id: string, label: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === id);

      if (!existingItem) {
        return [...currentItems, { id, label }];
      }

      if (existingItem.label === label) {
        return currentItems;
      }

      return currentItems.map((item) =>
        item.id === id ? { ...item, label } : item,
      );
    });
  }, []);

  const unregister = useCallback(
    (id: string) => {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      observe(id, null);
    },
    [observe],
  );

  const value = useMemo(
    () => ({
      items,
      activeId,
      register,
      unregister,
      observeSection: observe,
    }),
    [activeId, items, observe, register, unregister],
  );

  return (
    <SnapshotContext.Provider value={value}>{children}</SnapshotContext.Provider>
  );
}

export function useSnapshotContext() {
  const context = useContext(SnapshotContext);

  if (!context) {
    throw new Error("useSnapshotContext must be used within SnapshotProvider");
  }

  return context;
}
