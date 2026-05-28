import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets window scroll when the route changes (SPA navigation keeps scroll by default). */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
