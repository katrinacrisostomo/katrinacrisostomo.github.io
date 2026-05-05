import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorTooltipVariant = "primary" | "secondary" | "tertiary";

export type CursorTooltipState = {
  label: string;
  icon?: ReactNode;
  variant: CursorTooltipVariant;
};

type CursorTooltipActions = {
  setTooltip: (tooltip: CursorTooltipState) => void;
  clearTooltip: () => void;
};

type CursorTooltipProps = {
  label: string;
  icon?: ReactNode;
  variant?: CursorTooltipVariant;
  className?: string;
  children: ReactNode;
};

const CursorTooltipStateContext = createContext<CursorTooltipState | null>(null);

const CursorTooltipActionsContext = createContext<CursorTooltipActions | null>(
  null,
);

export function CursorTooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltipState] = useState<CursorTooltipState | null>(null);

  const setTooltip = useCallback((nextTooltip: CursorTooltipState) => {
    setTooltipState(nextTooltip);
  }, []);

  const clearTooltip = useCallback(() => {
    setTooltipState(null);
  }, []);

  const actions = useMemo(
    () => ({ setTooltip, clearTooltip }),
    [setTooltip, clearTooltip],
  );

  return (
    <CursorTooltipActionsContext.Provider value={actions}>
      <CursorTooltipStateContext.Provider value={tooltip}>
        {children}
      </CursorTooltipStateContext.Provider>
    </CursorTooltipActionsContext.Provider>
  );
}

export function useCursorTooltipState() {
  return useContext(CursorTooltipStateContext);
}

export function useCursorTooltipActions() {
  const actions = useContext(CursorTooltipActionsContext);

  if (!actions) {
    throw new Error(
      "useCursorTooltipActions must be used within CursorTooltipProvider",
    );
  }

  return actions;
}

export function CursorTooltip({
  label,
  icon,
  variant = "primary",
  className,
  children,
}: CursorTooltipProps) {
  const { setTooltip, clearTooltip } = useCursorTooltipActions();

  const showTooltip = useCallback(() => {
    setTooltip({ label, icon, variant });
  }, [icon, label, setTooltip, variant]);

  return (
    <div
      className={className}
      onMouseEnter={showTooltip}
      onMouseLeave={clearTooltip}
      onMouseDown={clearTooltip}
    >
      {children}
    </div>
  );
}
