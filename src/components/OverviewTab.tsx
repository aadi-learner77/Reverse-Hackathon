import React from 'react';
import { ShieldCheck, Cpu, ArrowRight, Lock, CheckCircle2, XCircle, FileCode2, Terminal, Key, ShieldAlert, Database } from 'lucide-react';
import type { TabType } from './Header';

interface OverviewTabProps {
  onStartDemo: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onStartDemo, setActiveTab }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 via-slate-900/80 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-950/80 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 border border-cyan-700/50">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CASE FILE NO. 001 · NBFC & FINANCIAL CREDIT AUDIT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI made the call.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Who can prove what it did?
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            When an autonomous AI credit model approves or rejects a loan applicant, traditional logs can be edited, deleted, or disputed.
            <strong className="text-white font-semibold"> CooL</strong> creates cryptographically verifiable evidence at decision time using salted PII commitments, hybrid post-quantum signatures, TEE enclave quotes, and RFC 6962 transparency logs.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onStartDemo}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40"
            >
              <Cpu className="h-5 w-5" />
              <span>Evaluate Synthetic Applicant #8842</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setActiveTab('tamper')}
              className="flex items-center space-x-2 rounded-xl border border-rose-500/40 bg-rose-950/30 px-6 py-3 font-semibold text-rose-300 transition-all hover:bg-rose-900/50 hover:border-rose-400"
            >
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <span>Open Tamper Laboratory</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-1 bg-cyan-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">The Core Value: Decision Non-Repudiation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <XCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">Without CooL (Standard App Logs)</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Plain-text logs are editable:</strong> Database administrators or bad actors can alter decision history retroactively.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Raw PII Exposure:</strong> Storing customer financial records raw in logs violates GDPR, EU AI Act, and DPDP regulations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Vendor Lock-in Verification:</strong> Regulators cannot independently verify records offline without trusting the company's internal API.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Legal Exposure under EU AI Act Art. 12 & CA AB 316:</strong> Penalties up to €35M or 7% global revenue for unverified AI decisions.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-6 space-y-4 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center space-x-3 text-emerald-400">
              <CheckCircle2 className="h-6 w-6 shrink-0" />
              <h3 className="text-lg font-bold text-white">With CooL Ledger Integration</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Cryptographically Unforged:</strong> Salted state commitments locked by dual Ed25519 & ML-DSA-65 signatures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Privacy by Design:</strong> Salted SHA-256 commitments prove decision content without exposing raw customer PII.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>RFC 6962 Transparency Log:</strong> Append-only Merkle tree prevents deletion or inserted records without breaking tree roots.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>100% Offline Verifier (<code className="font-mono text-cyan-300">cool verify</code>):</strong> Independent auditors verify receipts years later with 0 API calls.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-1 bg-blue-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">CooL SDK Component Architecture (Exhibit 04)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
              <FileCode2 className="h-4 w-4" />
              <span>cool.record()</span>
            </div>
            <p className="text-xs text-slate-400">Call-site wrapper integrating directly inside consequential AI execution flows.</p>
            <div className="text-[11px] font-mono text-slate-500">src/cool/client.ts</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
              <Lock className="h-4 w-4" />
              <span>hash()</span>
            </div>
            <p className="text-xs text-slate-400">Salted-hash commitment ensuring raw PII is sealed securely offline.</p>
            <div className="text-[11px] font-mono text-slate-500">src/cool/hash.ts</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
              <Key className="h-4 w-4" />
              <span>sign()</span>
            </div>
            <p className="text-xs text-slate-400">Hybrid classical Ed25519 & post-quantum ML-DSA-65 signatures.</p>
            <div className="text-[11px] font-mono text-slate-500">src/cool/sign.ts</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>attest()</span>
            </div>
            <p className="text-xs text-slate-400">Phala Network dstack TEE hardware quote attestation.</p>
            <div className="text-[11px] font-mono text-slate-500">src/cool/phala/dstack.ts</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
              <Database className="h-4 w-4" />
              <span>append()</span>
            </div>
            <p className="text-xs text-slate-400">RFC 6962 append-only Merkle transparency log & inclusion proofs.</p>
            <div className="text-[11px] font-mono text-slate-500">src/cool/phala/log.ts</div>
          </div>

          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-300 font-mono text-sm font-semibold">
              <Terminal className="h-4 w-4" />
              <span>cool verify</span>
            </div>
            <p className="text-xs text-slate-300">Offline CLI & library verifier returning fail-closed per-domain verdicts.</p>
            <div className="text-[11px] font-mono text-cyan-400">src/cool/verify.ts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
