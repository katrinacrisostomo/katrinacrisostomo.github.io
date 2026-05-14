import { useEffect, useState } from "react";

const supportsWindow = () => typeof window !== "undefined";

const getInitialMatch = (query: string) =>
  supportsWindow() ? window.matchMedia(query).matches : false;

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() => getInitialMatch(query));

  useEffect(() => {
    if (!supportsWindow()) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", onChange);

    return () => {
      mediaQueryList.removeEventListener("change", onChange);
    };
  }, [query]);

  return matches;
}
