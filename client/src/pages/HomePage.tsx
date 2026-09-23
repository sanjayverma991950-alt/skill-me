import { FC } from 'react';
import { SystemHealth } from '../types';
import { Badge } from '../components/common/Badge';
import {
  Layers,
  ShieldAlert,
  Server,
  Code2,
  CheckCircle2,
  ArrowRight,
  Database,
  Activity,
} from 'lucide-react';

interface HomePageProps {
  health: SystemHealth | null;
  isBackendHealthy?: boolean | null;
  onNavigate: (tab: string) => void;
}

export const HomePage: FC<HomePageProps> = ({ health, isBackendHealthy, onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold uppercase tracking-wider mb-6">
            <Layers className="w-3.5 h-3.5" /> Week 1 Deliverable: Architecture & Foundation
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            SkillMe <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">Engineering Platform</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            A production-ready Full-Stack Web Application foundation built on decoupled Client-Server architecture, 
            enterprise-grade operational error handling, Zod schema contracts, and zero technical debt.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('architecture')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/30"
            >
              Inspect Architecture
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              Explore Skills Catalog
            </button>
          </div>
        </div>

        {/* Decorative Grid BG */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
      </section>

      {/* Live System Health & Telemetry Metrics */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Live Backend Health & Telemetry</h3>
              <p className="text-xs text-slate-500">Real-time status reported via REST API (/api/v1/health)</p>
            </div>
          </div>
          <Badge variant={health ? 'success' : 'warning'}>
            {health ? 'API Healthy (200 OK)' : 'Connecting to API...'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <span className="text-xs text-slate-500 block mb-1">Service & Environment</span>
            <span className="font-semibold text-slate-800 text-sm">{health?.service || 'SkillMe API'}</span>
            <div className="text-[11px] text-slate-400 mt-0.5">{health?.environment || 'development'} mode</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <span className="text-xs text-slate-500 block mb-1">Runtime Engine</span>
            <span className="font-semibold text-slate-800 text-sm">{health?.system?.nodeVersion || 'Node.js'}</span>
            <div className="text-[11px] text-slate-400 mt-0.5">{health?.system?.platform || 'Windows'} OS</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <span className="text-xs text-slate-500 block mb-1">Memory (Heap Used)</span>
            <span className="font-semibold text-slate-800 text-sm">
              {health?.system ? `${health.system.memoryHeapUsedMb} MB` : 'N/A'}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              RSS: {health?.system ? `${health.system.memoryRssMb} MB` : 'N/A'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
            <span className="text-xs text-slate-500 block mb-1">Server Uptime</span>
            <span className="font-semibold text-slate-800 text-sm">
              {health ? `${health.uptimeSeconds} seconds` : 'N/A'}
            </span>
            <div className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Continuous Watch
            </div>
          </div>
        </div>
        {isBackendHealthy === false && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-800">Backend Server is Currently Offline</p>
                <p className="text-amber-700 leading-relaxed">
                  • <strong>Local Development:</strong> Start both servers together with <code className="px-1.5 py-0.5 bg-amber-100/80 rounded font-mono text-xs">npm run dev</code> from the root folder, or <code className="px-1.5 py-0.5 bg-amber-100/80 rounded font-mono text-xs">npm run dev:server</code> in a terminal.
                </p>
                <p className="text-amber-700 leading-relaxed">
                  • <strong>Cloud / Render Deployment:</strong> Free-tier instances spin down after inactivity and take 30–50 seconds on cold boot. The app will auto-reconnect once the instance wakes up.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Architecture Foundations Highlights */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Core Foundations Implemented</h2>
          <p className="text-sm text-slate-500">Industry-standard patterns established for Week 1</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Layered Separation</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Controllers manage HTTP contracts, Services execute isolated business rules, and Repositories handle data persistence with zero tight coupling.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Controller-Service-Repository</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dependency-friendly interfaces</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Centralized Error Handling</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Custom operational error hierarchy (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">AppError</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">ValidationError</code>, <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">NotFoundError</code>) delivers predictable JSON responses.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Standardized JSON format</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> UI React Error Boundaries</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Zod Schema Validation</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Strict runtime input validation for request bodies, URL params, and query strings, paired with fail-fast environment validation.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Type-safe DTO inference</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sanitized error issues array</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Week 2 Ready Scaffolding */}
      <section className="bg-sky-50/70 border border-sky-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-600 text-white rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Prisma ORM & SQLite Scaffolding Ready</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Database schema models (<code className="text-xs font-mono">User</code>, <code className="text-xs font-mono">Skill</code>, <code className="text-xs font-mono">Session</code>) are pre-configured in <code className="text-xs font-mono">server/prisma/schema.prisma</code> ready for Week 2 database migrations.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('architecture')}
          className="whitespace-nowrap px-4 py-2 bg-white text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold hover:bg-sky-100 transition-colors"
        >
          View System Specs
        </button>
      </section>
    </div>
  );
};
