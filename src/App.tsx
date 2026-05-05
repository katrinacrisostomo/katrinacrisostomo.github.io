import { Route, Routes } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import { CursorTooltipProvider } from "./components/CursorTooltip";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import WorkPage from "./pages/WorkPage";

function App() {
  return (
    <CursorTooltipProvider>
      <div className="flex min-h-screen flex-col text-black">
        <CustomCursor />
        <Header />
        <Routes>
          <Route path="/" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </CursorTooltipProvider>
  );
}

export default App;
