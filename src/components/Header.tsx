import React from 'react';
import { ShieldCheck, Cpu, Database, AlertOctagon, Layers } from 'lucide-react';

export type TabType = 'overview' | 'simulator' | 'dashboard' | 'tamper';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalReceiptsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, totalReceiptsCount }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xl font-bold tracking-tight text-white">
                CooL<span className="text-cyan-400">.ledger</span>
              </span>
              <span className="rounded-full bg-cyan-950 px-2 py-0.5 font-mono text-xs font-semibold text-cyan-400 border border-cyan-800/50">
                v1.0.0 (dstack-TEE)
              </span>
            </div>
            <p className="text-xs text-slate-400">Cryptographic Evidence & Audit Platform for Consequential AI</p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>Credit AI Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Audit Ledger</span>
            {totalReceiptsCount > 0 && (
              <span className="ml-1 rounded-full bg-cyan-950 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-700/60">
                {totalReceiptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tamper')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'tamper'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                : 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/40'
            }`}
          >
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <span>Tamper & Verification Lab</span>
          </button>
        </nav>

        <div className="hidden md:flex items-center space-x-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 font-medium">RFC 6962 LOG ACTIVE</span>
        </div>
      </div>
    </header>
  );
};
