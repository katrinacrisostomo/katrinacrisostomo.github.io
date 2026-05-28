import { Route, Routes } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import { CursorTooltipProvider } from "./components/CursorTooltip";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import QueryBuilderSnapshotPage from "./pages/QueryBuilderSnapshotPage";
import SankeySnapshotPage from "./pages/SankeySnapshotPage";
import SessionTraceSnapshotPage from "./pages/SessionTraceSnapshotPage";
import WorkPage from "./pages/WorkPage";

function App() {
  return (
    <CursorTooltipProvider>
      <div className="flex min-h-screen flex-col text-black">
        <ScrollToTop />
        <CustomCursor />
        <Header />
        <Routes>
          <Route path="/" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/sankey-agent-paths"
            element={<SankeySnapshotPage />}
          />
          <Route
            path="/session-trace-inspection"
            element={<SessionTraceSnapshotPage />}
          />
          <Route
            path="/query-builder"
            element={<QueryBuilderSnapshotPage />}
          />
        </Routes>
      </div>
    </CursorTooltipProvider>
  );
}

export default App;
