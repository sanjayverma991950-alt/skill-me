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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const performHealthCheck = async () => {
      try {
        const data = await HealthService.getHealth();
        if (isMounted) {
          setHealth(data);
          setIsBackendHealthy(true);
        }
        // When healthy, poll every 20 seconds
        timer = setTimeout(performHealthCheck, 20000);
      } catch (err) {
        console.warn('Backend health check error:', err);
        if (isMounted) {
          setIsBackendHealthy(false);
        }
        // When offline, poll more frequently (every 5 seconds) to catch startup quickly
        timer = setTimeout(performHealthCheck, 5000);
      }
    };

    performHealthCheck();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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
            <HomePage
              health={health}
              isBackendHealthy={isBackendHealthy}
              onNavigate={setCurrentTab}
            />
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
