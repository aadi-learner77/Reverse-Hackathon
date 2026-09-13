import React from 'react';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-amber-950/40 px-4 py-2.5 text-xs text-amber-200/90">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-3 sm:items-center">
        <div className="flex items-start gap-2.5 sm:items-center">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">Important Product & Regulatory Disclaimer:</strong>{' '}
            CooL cryptographic verification proves <span className="underline decoration-amber-400 decoration-dotted">evidence integrity & provenance</span> (unforged decision logs). It does{' '}
            <strong className="text-amber-100 uppercase font-mono">NOT</strong> prove AI correctness, fairness, absence of bias, or statutory compliance.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Integrity Proven
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <XCircle className="h-3.5 w-3.5 text-rose-400" /> Fairness Unclaimed
          </span>
        </div>
      </div>
    </div>
  );
};
