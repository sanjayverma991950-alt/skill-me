import { FC } from 'react';
import { GitBranch, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                SM
              </div>
              <span className="font-bold text-slate-900 text-base">SkillMe Platform</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              Week 1 Deliverable: Enterprise Full-Stack Web Development Architecture, zero technical debt, centralized error handling, and robust schema validation.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Layered Security
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-600" /> TypeScript Strict Mode
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" /> Monorepo Structure
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Architecture Pillars
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>• Controller-Service-Repository Pattern</li>
              <li>• Zod Strict Schema Validation</li>
              <li>• Centralized Operational Error Handler</li>
              <li>• Automated Vitest Test Suite</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Developer Deliverable
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 mb-1">
                <Terminal className="w-3.5 h-3.5 text-slate-600" /> Run locally:
              </div>
              <code className="text-sky-700 bg-white px-2 py-1 rounded border border-slate-200 block font-mono text-[11px]">
                npm run dev
              </code>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>SkillMe Full-Stack Engineering • Week 1: Architecture & Foundation</div>
          <div>Built with React 18, Vite, Express, TypeScript, and Tailwind CSS</div>
        </div>
      </div>
    </footer>
  );
};
