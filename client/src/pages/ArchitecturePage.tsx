import { FC, useState } from 'react';
import { api } from '../services/apiClient';
import {
  Layers,
  Terminal,
  FolderTree,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ArchitecturePage: FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [shouldCrashUI, setShouldCrashUI] = useState<boolean>(false);

  if (shouldCrashUI) {
    throw new Error('Simulated React Rendering Error: ErrorBoundary successfully caught this exception!');
  }

  const runTestCall = async (action: string) => {
    setTestingEndpoint(action);
    setTestResult(null);

    try {
      if (action === 'health') {
        const res = await api.get('/health');
        setTestResult({ status: res.status, data: res.data });
      } else if (action === 'skills-valid') {
        const res = await api.get('/skills');
        setTestResult({ status: res.status, data: res.data });
      } else if (action === 'error-404') {
        await api.get('/non-existent-endpoint-test');
      } else if (action === 'error-validation') {
        // Send invalid payload to /skills (missing title & description)
        await api.post('/skills', { level: 'Advanced' });
      } else if (action === 'error-conflict') {
        // Post existing skill title to trigger 409
        await api.post('/skills', {
          title: 'Full-Stack TypeScript & React Architecture',
          description: 'Testing duplicate detection logic in business service layer',
          category: 'Web Development',
        });
      }
    } catch (err: any) {
      setTestResult({
        status: err.status || 'ERROR',
        code: err.code,
        message: err.message,
        details: err.details,
      });
    } finally {
      setTestingEndpoint(null);
    }
  };

  const modules = [
    {
      module: 'Config & Environment',
      path: 'server/src/config/env.ts',
      pattern: 'Fail-fast Zod Schema Validation',
      desc: 'Validates PORT, NODE_ENV, and CORS_ORIGIN during startup. Terminates if invalid.',
    },
    {
      module: 'Centralized Error Handler',
      path: 'server/src/middlewares/errorHandler.ts',
      pattern: 'Operational AppError Hierarchy',
      desc: 'Converts AppError, ZodError, and uncaught exceptions into predictable JSON contracts.',
    },
    {
      module: 'Request Validation Middleware',
      path: 'server/src/middlewares/validateRequest.ts',
      pattern: 'Higher-Order Middleware Factory',
      desc: 'Validates req.body, req.query, and req.params using Zod before touching controllers.',
    },
    {
      module: 'Skills Feature Module',
      path: 'server/src/modules/skills/*',
      pattern: 'Controller-Service-Repository (Clean Layering)',
      desc: 'Decoupled domain routing, business logic, and data abstraction with seed data.',
    },
    {
      module: 'Users Feature Module',
      path: 'server/src/modules/users/*',
      pattern: 'Layered Domain Architecture',
      desc: 'User schemas, mentor profile directory, and role-based entity management.',
    },
    {
      module: 'UI Error Boundary',
      path: 'client/src/components/common/ErrorBoundary.tsx',
      pattern: 'React Component Lifecycle Fallback',
      desc: 'Catches rendering faults, preventing blank-screen crashes with recovery buttons.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" /> Technical Specification
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">
          Architecture & Foundation Phase
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl">
          Detailed overview of the established modules, data contracts, centralized error handling, and live API test simulator.
        </p>
      </div>

      {/* Interactive Live Error-Handling Simulator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Interactive Error & Contract Simulator</h2>
              <p className="text-xs text-slate-500">Test how the backend operational error handlers and client interceptors respond</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Trigger Server Scenario
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => runTestCall('health')}
                disabled={testingEndpoint !== null}
                className="text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all text-xs font-medium flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">1. Health Check (200 OK)</div>
                  <div className="text-slate-500 text-[11px]">GET /api/v1/health</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">Success</span>
              </button>

              <button
                onClick={() => runTestCall('error-validation')}
                disabled={testingEndpoint !== null}
                className="text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-xs font-medium flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">2. Trigger Zod Validation Error (400 Bad Request)</div>
                  <div className="text-slate-500 text-[11px]">POST /api/v1/skills (Empty payload)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px]">Validation</span>
              </button>

              <button
                onClick={() => runTestCall('error-conflict')}
                disabled={testingEndpoint !== null}
                className="text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-xs font-medium flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">3. Trigger Duplicate Conflict (409 Conflict)</div>
                  <div className="text-slate-500 text-[11px]">POST /api/v1/skills (Duplicate title)</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-mono text-[10px]">Conflict</span>
              </button>

              <button
                onClick={() => runTestCall('error-404')}
                disabled={testingEndpoint !== null}
                className="text-left px-4 py-3 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition-all text-xs font-medium flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">4. Trigger Route Not Found (404 Not Found)</div>
                  <div className="text-slate-500 text-[11px]">GET /api/v1/unknown-path</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[10px]">Not Found</span>
              </button>

              <button
                onClick={() => setShouldCrashUI(true)}
                className="text-left px-4 py-3 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-100/50 transition-all text-xs font-medium flex items-center justify-between text-red-900"
              >
                <div>
                  <div className="font-semibold">5. Test React Error Boundary (Frontend)</div>
                  <div className="text-red-600 text-[11px]">Throws intentional rendering error</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 font-mono text-[10px]">Client Error</span>
              </button>
            </div>
          </div>

          {/* Response Inspector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Live HTTP Response Inspector
              </h4>
              {testResult && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    testResult.status >= 400 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  HTTP {testResult.status}
                </span>
              )}
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto min-h-[280px] flex flex-col justify-between border border-slate-800 shadow-inner">
              <pre className="overflow-x-auto">
                {testResult
                  ? JSON.stringify(testResult, null, 2)
                  : '// Click any test button on the left to fire a live API request and inspect the response payload'}
              </pre>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Standard ApiResponse Contract</span>
                <span>Content-Type: application/json</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules & Patterns Matrix */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Established Architectural Modules
          </h2>
          <p className="text-xs text-slate-500">Every module adheres to single responsibility and strict separation of concerns</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Module Name</th>
                <th className="pb-3 pr-4">File Location</th>
                <th className="pb-3 pr-4">Pattern / Standard</th>
                <th className="pb-3">Responsibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((m) => (
                <tr key={m.module} className="hover:bg-slate-50/80">
                  <td className="py-3 pr-4 font-semibold text-slate-800">{m.module}</td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-sky-700">{m.path}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px]">
                      {m.pattern}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 leading-relaxed">{m.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Repository Folder Structure */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="mb-4">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-600" /> Monorepo Directory Layout
          </h2>
          <p className="text-xs text-slate-500">Structured for zero technical debt, modular expansion, and decoupled deployment</p>
        </div>

        <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`skill-me/
├── package.json               # Root monorepo workspaces configuration
├── .gitignore                 # Dependencies, build output & environment ignores
├── README.md                  # Complete architectural documentation & showcase guide
│
├── server/                    # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/            # Validated environment schemas (env.ts)
│   │   ├── errors/            # Operational AppError hierarchy
│   │   ├── middlewares/       # Centralized error handler, Zod validator, request logger
│   │   ├── modules/
│   │   │   ├── health/        # Health check controller & routes
│   │   │   ├── skills/        # Clean architecture (schema, types, repo, service, controller)
│   │   │   └── users/         # User & mentor profile module
│   │   ├── types/             # Standard ApiResponse format contracts
│   │   ├── routes.ts          # Unified /api/v1 router
│   │   ├── app.ts             # Express App Factory
│   │   └── server.ts          # Listener & Graceful Shutdown
│   ├── prisma/
│   │   └── schema.prisma      # SQLite & PostgreSQL relational data models
│   ├── tests/                 # Vitest automated integration test suite
│   ├── tsconfig.json          # NodeNext strict TypeScript configuration
│   └── package.json
│
└── client/                    # Frontend SPA (React 18 + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/
    │   │   ├── common/        # ErrorBoundary, Badge components
    │   │   └── layout/        # Navbar with live health indicator, Footer
    │   ├── pages/             # HomePage, SkillsPage, ArchitecturePage
    │   ├── services/          # Axios client with interceptors
    │   ├── types/             # Frontend TypeScript domain interfaces
    │   ├── App.tsx            # Root shell with tab navigation
    │   └── main.tsx           # React DOM bootstrap
    ├── vite.config.ts         # Vite bundler with reverse proxy
    ├── tailwind.config.js     # Tailwind design system tokens
    └── package.json`}
        </pre>
      </section>
    </div>
  );
};
