import { FC, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SkillsPage } from './pages/SkillsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { HealthService } from './services/apiClient';
import { SystemHealth } from './types';

export const App: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  const checkHealth = async () => {
    try {
      const data = await HealthService.getHealth();
      setHealth(data);
      setIsBackendHealthy(true);
    } catch (err) {
      console.warn('Backend health check error:', err);
      setIsBackendHealthy(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isBackendHealthy={isBackendHealthy}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {currentTab === 'home' && (
            <HomePage health={health} onNavigate={setCurrentTab} />
          )}
          {currentTab === 'skills' && <SkillsPage />}
          {currentTab === 'architecture' && <ArchitecturePage />}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
