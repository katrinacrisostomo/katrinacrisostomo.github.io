import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Support GitHub Pages deep links via `public/404.html`.
const pendingRedirect = sessionStorage.getItem("spa:redirect");
if (pendingRedirect) {
  sessionStorage.removeItem("spa:redirect");
  window.history.replaceState(null, "", pendingRedirect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
