import { cool } from '../cool/client';
import type { CooLReceipt, VerificationCheckResult } from '../cool/types';
import { verifyReceipt } from '../cool/verify';
import { PRESET_APPLICANTS, runCreditModel } from '../model/creditModel';

const STORAGE_KEY = 'cool_evidence_ledger_v1';

class EvidenceService {
  private receipts: CooLReceipt[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.receipts = JSON.parse(stored);
      }
    } catch {
      this.receipts = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.receipts));
    } catch {
      // Memory fallback
    }
  }

  async seedDemoIfEmpty(): Promise<CooLReceipt> {
    if (this.receipts.length > 0) {
      return this.receipts[0];
    }

    const applicant8842 = PRESET_APPLICANTS[0];
    const modelResult = runCreditModel(applicant8842);
    
    const receipt = await cool.record({
      applicant: applicant8842,
      decision: modelResult.decision,
      modelId: modelResult.modelId,
      modelVersion: modelResult.modelVersion,
      metadata: modelResult.metadata,
      enableTEE: true,
    });

    this.receipts.unshift(receipt);
    this.saveToStorage();

    const app8843 = PRESET_APPLICANTS[1];
    const res8843 = runCreditModel(app8843);
    const receipt8843 = await cool.record({
      applicant: app8843,
      decision: res8843.decision,
      modelId: res8843.modelId,
      modelVersion: res8843.modelVersion,
      metadata: res8843.metadata,
      enableTEE: true,
    });
    this.receipts.push(receipt8843);

    const app8844 = PRESET_APPLICANTS[2];
    const res8844 = runCreditModel(app8844);
    const receipt8844 = await cool.record({
      applicant: app8844,
      decision: res8844.decision,
      modelId: res8844.modelId,
      modelVersion: res8844.modelVersion,
      metadata: res8844.metadata,
      enableTEE: true,
    });
    this.receipts.push(receipt8844);

    this.saveToStorage();
    return receipt;
  }

  async evaluateAndRecord(applicantInput: typeof PRESET_APPLICANTS[0]): Promise<{
    decisionResult: ReturnType<typeof runCreditModel>;
    receipt: CooLReceipt;
  }> {
    const decisionResult = runCreditModel(applicantInput);
    
    const receipt = await cool.record({
      applicant: applicantInput,
      decision: decisionResult.decision,
      modelId: decisionResult.modelId,
      modelVersion: decisionResult.modelVersion,
      metadata: decisionResult.metadata,
      enableTEE: true,
    });

    this.receipts.unshift(receipt);
    this.saveToStorage();

    return { decisionResult, receipt };
  }

  getAllReceipts(): CooLReceipt[] {
    return [...this.receipts];
  }

  getReceiptById(id: string): CooLReceipt | undefined {
    return this.receipts.find(r => r.decisionId === id);
  }

  async verifyOffline(receipt: CooLReceipt, applicantInput?: any): Promise<VerificationCheckResult> {
    return await verifyReceipt(receipt, applicantInput);
  }

  clearLedger() {
    this.receipts = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const evidenceService = new EvidenceService();
