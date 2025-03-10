
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MatchProvider } from "@/context/MatchContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NewMatch from "./components/NewMatch";
import EmailVerification from "./components/EmailVerification";
import ResumeMatch from "./components/ResumeMatch";
import WatchLive from "./components/WatchLive";
import MatchSetup from "./components/MatchSetup";
import ScoringInterface from "./components/ScoringInterface";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MatchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-match" element={<NewMatch />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/resume-match" element={<ResumeMatch />} />
            <Route path="/watch-live" element={<WatchLive />} />
            <Route path="/setup-match" element={<MatchSetup />} />
            <Route path="/scoring" element={<ScoringInterface />} />
            <Route path="/view-match" element={<ScoringInterface />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MatchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
