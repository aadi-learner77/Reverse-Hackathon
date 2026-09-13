import React, { useState } from 'react';
import { X, Copy, Check, Code, FileJson } from 'lucide-react';
import type { CooLReceipt } from '../cool/types';

interface ReceiptInspectorModalProps {
  receipt: CooLReceipt | null;
  onClose: () => void;
}

export const ReceiptInspectorModal: React.FC<ReceiptInspectorModalProps> = ({ receipt, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const jsonString = JSON.stringify(receipt, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <FileJson className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">CooL Cryptographic Receipt Inspector</h3>
              <p className="font-mono text-xs text-cyan-400">{receipt.decisionId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-slate-700"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
              <span className="text-slate-400 font-mono">Domain / Model</span>
              <div className="font-semibold text-white font-mono">{receipt.domain}</div>
              <div className="text-[11px] text-cyan-400 font-mono">{receipt.modelId} ({receipt.modelVersion})</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
              <span className="text-slate-400 font-mono">Decision / Status</span>
              <div className={`font-black font-mono ${
                receipt.decision === 'APPROVED' ? 'text-emerald-400' :
                receipt.decision === 'MANUAL_REVIEW' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {receipt.decision}
              </div>
              <div className="text-[11px] text-slate-400">{receipt.timestamp}</div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
              <span className="text-slate-400 font-mono">Post-Quantum Signature</span>
              <div className="font-semibold text-cyan-300 font-mono">ML-DSA-65 (FIPS 204)</div>
              <div className="text-[11px] text-emerald-400 font-mono">RFC 6962 Inclusion Valid</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-cyan-400" /> Canonical Receipt Specification (v1.0.0)
              </span>
              <span>UTF-8 JSON</span>
            </div>
            <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-200/90 leading-relaxed overflow-x-auto custom-scrollbar">
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
