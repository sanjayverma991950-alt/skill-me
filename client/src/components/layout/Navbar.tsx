import { FC } from 'react';
import { Layers, Compass, BookOpen, Activity } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isBackendHealthy: boolean | null;
}

export const Navbar: FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isBackendHealthy,
}) => {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Compass },
    { id: 'skills', label: 'Explore Skills', icon: BookOpen },
    { id: 'architecture', label: 'Architecture & Foundation', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                SkillMe
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded">
                  v1.0
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Full-Stack Architecture</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Live System Health Pill */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isBackendHealthy === true
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isBackendHealthy === false
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Activity
                className={`w-3.5 h-3.5 ${
                  isBackendHealthy === true ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
                }`}
              />
              <span className="hidden md:inline">Backend API:</span>
              <span className="font-semibold">
                {isBackendHealthy === true
                  ? 'Operational (200 OK)'
                  : isBackendHealthy === false
                  ? 'Offline'
                  : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
