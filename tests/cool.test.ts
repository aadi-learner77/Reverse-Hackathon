import { describe, it, expect } from 'vitest';
import { cool } from '../src/cool/client';
import { verifyReceipt } from '../src/cool/verify';
import { PRESET_APPLICANTS, runCreditModel } from '../src/model/creditModel';

describe('CooL SDK Cryptographic Evidence Protocol', () => {
  it('evaluates Synthetic Applicant #8842 and produces APPROVED decision', () => {
    const applicant8842 = PRESET_APPLICANTS[0];
    expect(applicant8842.applicantId).toBe('Synthetic Applicant #8842');

    const result = runCreditModel(applicant8842);
    expect(result.decision).toBe('APPROVED');
    expect(result.modelId).toBe('CreditRisk-v3');
    expect(result.metadata.creditScore).toBe(785);
  });

  it('records CooL cryptographic evidence receipt at decision time', async () => {
    const applicant = PRESET_APPLICANTS[0];
    const modelResult = runCreditModel(applicant);

    const receipt = await cool.record({
      applicant,
      decision: modelResult.decision,
      modelId: modelResult.modelId,
      modelVersion: modelResult.modelVersion,
      metadata: modelResult.metadata,
      enableTEE: true,
    });

    expect(receipt.version).toBe('1.0.0');
    expect(receipt.applicantId).toBe('Synthetic Applicant #8842');
    expect(receipt.decision).toBe('APPROVED');

    // Check Salted PII Commitment
    expect(receipt.privacyCommitment.salt).toBeTruthy();
    expect(receipt.privacyCommitment.combinedStateHash).toHaveLength(64);

    // Check Hybrid Signatures
    expect(receipt.signatures.ed25519.algorithm).toBe('Ed25519');
    expect(receipt.signatures.mldsa65.algorithm).toBe('ML-DSA-65 (FIPS 204)');

    // Check RFC 6962 Merkle Log
    expect(receipt.transparencyLog.merkleRoot).toBeTruthy();

    // Check Phala dstack TEE Attestation
    expect(receipt.teeAttestation.enclaveProvider).toBe('Phala Network dstack');
  });

  it('passes offline verification (cool verify) for authentic receipt', async () => {
    const applicant = PRESET_APPLICANTS[0];
    const modelResult = runCreditModel(applicant);

    const receipt = await cool.record({
      applicant,
      decision: modelResult.decision,
      modelId: modelResult.modelId,
      modelVersion: modelResult.modelVersion,
      metadata: modelResult.metadata,
    });

    const verifierResult = await verifyReceipt(receipt);
    expect(verifierResult.isUnforged).toBe(true);
    expect(verifierResult.signatureValid).toBe(true);
    expect(verifierResult.transparencyLogValid).toBe(true);
    expect(verifierResult.hashCommitmentValid).toBe(true);
    expect(verifierResult.correctnessAndBiasCheck).toBe('OUT_OF_SCOPE');
    expect(verifierResult.tamperErrors).toHaveLength(0);
  });

  it('detects forgery when decision outcome is tampered', async () => {
    const applicant = PRESET_APPLICANTS[0];
    const modelResult = runCreditModel(applicant);

    const receipt = await cool.record({
      applicant,
      decision: modelResult.decision,
      modelId: modelResult.modelId,
      modelVersion: modelResult.modelVersion,
      metadata: modelResult.metadata,
    });

    // Tamper: Flip decision from APPROVED to REJECTED
    const tamperedReceipt = JSON.parse(JSON.stringify(receipt));
    tamperedReceipt.decision = 'REJECTED';

    const verifierResult = await verifyReceipt(tamperedReceipt);
    expect(verifierResult.isUnforged).toBe(false);
    expect(verifierResult.tamperErrors.length).toBeGreaterThan(0);
  });

  it('detects forgery when Merkle tree root is tampered', async () => {
    const applicant = PRESET_APPLICANTS[0];
    const modelResult = runCreditModel(applicant);

    const receipt = await cool.record({
      applicant,
      decision: modelResult.decision,
      modelId: modelResult.modelId,
      modelVersion: modelResult.modelVersion,
      metadata: modelResult.metadata,
    });

    // Tamper: Mutate Merkle tree root hash
    const tamperedReceipt = JSON.parse(JSON.stringify(receipt));
    tamperedReceipt.transparencyLog.merkleRoot = '0xDEADBEEF00000000000000000000000000000000000000000000000000000000';

    const verifierResult = await verifyReceipt(tamperedReceipt);
    expect(verifierResult.isUnforged).toBe(false);
    expect(verifierResult.transparencyLogValid).toBe(false);
  });
});
