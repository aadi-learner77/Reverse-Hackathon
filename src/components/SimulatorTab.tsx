import React, { useState } from 'react';
import { Cpu, ShieldCheck, UserCheck, Play, FileText, CheckCircle2, AlertCircle, XCircle, Code, Lock, Key, Database } from 'lucide-react';
import type { ApplicantInput, CooLReceipt } from '../cool/types';
import { PRESET_APPLICANTS, runCreditModel } from '../model/creditModel';
import { evidenceService } from '../services/evidenceService';

interface SimulatorTabProps {
  onReceiptCreated: (receipt: CooLReceipt) => void;
  onInspectReceipt: (receipt: CooLReceipt) => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({ onReceiptCreated, onInspectReceipt }) => {
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantInput>(PRESET_APPLICANTS[0]);
  const [customApplicant, setCustomApplicant] = useState<ApplicantInput>({ ...PRESET_APPLICANTS[0] });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<CooLReceipt | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<ReturnType<typeof runCreditModel> | null>(null);

  const handleSelectPreset = (app: ApplicantInput) => {
    setSelectedApplicant(app);
    setCustomApplicant({ ...app });
    setCurrentReceipt(null);
    setEvaluationResult(null);
  };

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setCurrentReceipt(null);

    setTimeout(async () => {
      const { decisionResult, receipt } = await evidenceService.evaluateAndRecord(customApplicant);
      setEvaluationResult(decisionResult);
      setCurrentReceipt(receipt);
      setIsEvaluating(false);
      onReceiptCreated(receipt);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>AI Credit Underwriting Simulator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Model: <code className="font-mono text-cyan-300">CreditRisk-v3 (3.4.1-prod)</code> | Domain: <code className="font-mono text-slate-300">nbfc.credit_scoring</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Synthetic Applicant:</span>
          {PRESET_APPLICANTS.map((app) => (
            <button
              key={app.applicantId}
              onClick={() => handleSelectPreset(app)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedApplicant.applicantId === app.applicantId
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {app.applicantId}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <UserCheck className="h-4 w-4 text-cyan-400" />
              <span>Synthetic Applicant Data</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
              Privacy Salted Commit Active
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Applicant Identifier</label>
              <input
                type="text"
                value={customApplicant.applicantId}
                onChange={(e) => setCustomApplicant({ ...customApplicant, applicantId: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Annual Income ($)</label>
                <input
                  type="number"
                  value={customApplicant.annualIncome}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, annualIncome: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Existing Debt ($)</label>
                <input
                  type="number"
                  value={customApplicant.existingDebt}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, existingDebt: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Credit Score (300-850)</label>
                <input
                  type="number"
                  value={customApplicant.creditScore}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, creditScore: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Loan Requested ($)</label>
                <input
                  type="number"
                  value={customApplicant.loanAmountRequested}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, loanAmountRequested: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Collateral Value ($)</label>
                <input
                  type="number"
                  value={customApplicant.collateralValue}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, collateralValue: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Employment (Years)</label>
                <input
                  type="number"
                  step="0.1"
                  value={customApplicant.employmentYears}
                  onChange={(e) => setCustomApplicant({ ...customApplicant, employmentYears: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Running CreditRisk-v3 & CooL Recording...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Execute Credit Decision & Record CooL Evidence</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {evaluationResult && currentReceipt ? (
            <div className="space-y-6">
              <div className={`rounded-2xl border p-6 space-y-4 shadow-xl ${
                evaluationResult.decision === 'APPROVED'
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : evaluationResult.decision === 'MANUAL_REVIEW'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-rose-500/40 bg-rose-950/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {evaluationResult.decision === 'APPROVED' && <CheckCircle2 className="h-8 w-8 text-emerald-400" />}
                    {evaluationResult.decision === 'MANUAL_REVIEW' && <AlertCircle className="h-8 w-8 text-amber-400" />}
                    {evaluationResult.decision === 'REJECTED' && <XCircle className="h-8 w-8 text-rose-400" />}
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Autonomous AI Decision</div>
                      <div className={`text-2xl font-black font-mono ${
                        evaluationResult.decision === 'APPROVED' ? 'text-emerald-400' :
                        evaluationResult.decision === 'MANUAL_REVIEW' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {evaluationResult.decision}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Confidence Score</span>
                    <div className="text-lg font-bold font-mono text-cyan-300">
                      {(evaluationResult.metadata.confidenceScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <strong>Recommendation Reason:</strong> {evaluationResult.metadata.recommendationReason}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                    <h4 className="font-bold text-white text-sm">CooL Cryptographic Receipt Generated</h4>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-800/60">
                    {currentReceipt.decisionId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      <Lock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Salted PII Commitment</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 truncate">
                      {currentReceipt.privacyCommitment.combinedStateHash}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      <Key className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Hybrid Cryptography</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-300">
                      Ed25519 + ML-DSA-65 (FIPS 204)
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      <Database className="h-3.5 w-3.5 text-cyan-400" />
                      <span>RFC 6962 Merkle Root</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 truncate">
                      {currentReceipt.transparencyLog.merkleRoot}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>TEE dstack Attestation</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-400">
                      {currentReceipt.teeAttestation.enclaveId}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => onInspectReceipt(currentReceipt)}
                    className="flex items-center space-x-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-cyan-300 transition-all border border-cyan-800/40"
                  >
                    <Code className="h-4 w-4" />
                    <span>Inspect Raw Cryptographic Receipt JSON</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-3">
              <FileText className="h-12 w-12 text-slate-600" />
              <h4 className="text-base font-semibold text-slate-300">No Active Decision Generated</h4>
              <p className="text-xs text-slate-500 max-w-md">
                Click "Execute Credit Decision & Record CooL Evidence" to run the credit model on Synthetic Applicant #{customApplicant.applicantId} and record evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
