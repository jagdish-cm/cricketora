
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { MatchProvider } from '@/context/MatchContext';
import Index from './pages/Index';
import NewMatch from './components/NewMatch';
import MatchSetup from './components/MatchSetup';
import ScoringInterface from './components/ScoringInterface';
import WatchLive from './components/WatchLive';
import NotFound from './pages/NotFound';
import AppTopBar from './components/AppTopBar';
import './App.css';

function App() {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <MatchProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <AppTopBar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-match" element={<NewMatch />} />
            <Route path="/setup" element={<MatchSetup />} />
            <Route path="/scoring" element={<ScoringInterface />} />
            <Route path="/watch/:matchId" element={<WatchLive />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </MatchProvider>
  );
}

export default App;
