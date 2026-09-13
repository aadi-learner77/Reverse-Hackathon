import type { ApplicantInput, DecisionMetadata, SaltedCommitment } from './types';

export async function sha256Hex(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
    const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
    return (hex1 + hex2 + hex1 + hex2).substring(0, 64);
  }
}

export function generateSalt(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function createSaltedCommitment(
  input: ApplicantInput,
  decision: string,
  metadata: DecisionMetadata,
  existingSalt?: string
): Promise<SaltedCommitment> {
  const salt = existingSalt || generateSalt();

  const canonicalInput = JSON.stringify({
    applicantId: input.applicantId,
    income: input.annualIncome,
    debt: input.existingDebt,
    creditScore: input.creditScore,
    loanRequested: input.loanAmountRequested,
  });

  const canonicalOutput = JSON.stringify({
    decision,
    creditScore: metadata.creditScore,
    dtiRatio: metadata.dtiRatio,
    confidence: metadata.confidenceScore,
  });

  const saltedInputHash = await sha256Hex(`SALT:${salt}:${canonicalInput}`);
  const saltedOutputHash = await sha256Hex(`SALT:${salt}:${canonicalOutput}`);
  const combinedStateHash = await sha256Hex(`${saltedInputHash}:${saltedOutputHash}`);

  return {
    salt,
    saltedInputHash,
    saltedOutputHash,
    combinedStateHash,
  };
}
