import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import { RepoProvider } from "./context/RepoContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RepoProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/repositories"
            element={<PlaceholderPage title="Repositories" />}
          />
          <Route
            path="/history"
            element={<PlaceholderPage title="Analysis History" />}
          />
          <Route
            path="/reports"
            element={<PlaceholderPage title="Saved Reports" />}
          />
          <Route
            path="/settings"
            element={<PlaceholderPage title="Settings" />}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </RepoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
