
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { MatchProvider } from '@/context/MatchContext';
import Index from './pages/Index';
import NewMatch from './components/NewMatch';
import EmailVerification from './components/EmailVerification';
import MatchSetup from './components/MatchSetup';
import ScoringInterface from './components/ScoringInterface';
import WatchLive from './components/WatchLive';
import ResumeMatch from './components/ResumeMatch';
import ViewMatch from './components/ViewMatch';
import NotFound from './pages/NotFound';
import AppTopBar from './components/AppTopBar';

function App() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  return (
    <MatchProvider>
      <div className={`min-h-screen flex flex-col ${isHomePage ? 'cricket-pattern-bg' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
        {!isHomePage && <AppTopBar />}
        <main className={`flex-1 ${isHomePage ? '' : 'container mx-auto px-4 py-6'}`}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-match" element={<NewMatch />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/setup" element={<MatchSetup />} />
            <Route path="/resume-match" element={<ResumeMatch />} />
            <Route path="/scoring" element={<ScoringInterface />} />
            <Route path="/watch/:matchId" element={<ViewMatch />} />
            <Route path="/watch-live" element={<WatchLive />} />
            <Route path="/view-match" element={<ViewMatch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </MatchProvider>
  );
}

export default App;
