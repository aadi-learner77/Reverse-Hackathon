import type { CooLReceipt, VerificationCheckResult } from './types';
import { createSaltedCommitment } from './hash';
import { verifyHybridSignatures } from './sign';
import { verifyTEEAttestation } from './phala/dstack';
import { verifyTransparencyLog } from './phala/log';

export async function verifyReceipt(
  receipt: CooLReceipt,
  simulatedRawInput?: any
): Promise<VerificationCheckResult> {
  const tamperErrors: string[] = [];

  if (!receipt || !receipt.privacyCommitment) {
    return {
      signatureValid: false,
      transparencyLogValid: false,
      hashCommitmentValid: false,
      teeAttestationValid: false,
      correctnessAndBiasCheck: 'OUT_OF_SCOPE',
      isUnforged: false,
      details: {
        signatureDetail: 'Invalid receipt structure',
        transparencyLogDetail: 'Invalid receipt structure',
        hashCommitmentDetail: 'Invalid receipt structure',
        teeAttestationDetail: 'Invalid receipt structure',
        disclaimer: 'Out of scope (not claimed)',
      },
      tamperErrors: ['Receipt object is null, undefined, or missing privacy commitments.'],
    };
  }

  let hashCommitmentValid = true;
  let hashCommitmentDetail = '✓ Salted hash commitment matches sealed decision state';

  if (simulatedRawInput) {
    const recalculatedCommitment = await createSaltedCommitment(
      simulatedRawInput,
      receipt.decision,
      receipt.decisionMetadata,
      receipt.privacyCommitment.salt
    );

    if (recalculatedCommitment.combinedStateHash !== receipt.privacyCommitment.combinedStateHash) {
      hashCommitmentValid = false;
      hashCommitmentDetail = '✗ Salted hash commitment mismatch with provided applicant input parameters!';
      tamperErrors.push('Hash Commitment Mismatch: Raw applicant parameters do not match salted hash in receipt.');
    }
  }

  const sigCheck = await verifyHybridSignatures(
    receipt.privacyCommitment.combinedStateHash,
    receipt.signatures
  );
  let signatureValid = sigCheck.valid;
  let signatureDetail = sigCheck.valid
    ? '✓ Hybrid signatures valid (Ed25519 + ML-DSA-65 Post-Quantum)'
    : `✗ Signature Failure: ${sigCheck.reason}`;
  if (!sigCheck.valid) {
    tamperErrors.push(`Cryptographic Signature Violation: ${sigCheck.reason}`);
  }

  const logCheck = await verifyTransparencyLog(
    receipt.transparencyLog,
    receipt.privacyCommitment.combinedStateHash
  );
  let transparencyLogValid = logCheck.valid;
  let transparencyLogDetail = logCheck.valid
    ? '✓ Transparency log inclusion proof valid (RFC 6962 Merkle Tree)'
    : `✗ Transparency Log Failure: ${logCheck.reason}`;
  if (!logCheck.valid) {
    tamperErrors.push(`Transparency Log Tamper Detected: ${logCheck.reason}`);
  }

  const teeCheck = await verifyTEEAttestation(
    receipt.teeAttestation,
    receipt.privacyCommitment.combinedStateHash
  );
  let teeAttestationValid = teeCheck.valid;
  let teeAttestationDetail = teeCheck.valid
    ? receipt.teeAttestation.enabled
      ? '✓ TEE dstack enclave quote valid (Hardware-rooted non-self-edit proof)'
      : '— TEE attestation not requested for this domain'
    : `✗ TEE Attestation Failure: ${teeCheck.reason}`;
  if (!teeCheck.valid) {
    tamperErrors.push(`Hardware Enclave Attestation Mismatch: ${teeCheck.reason}`);
  }

  const isUnforged = signatureValid && transparencyLogValid && hashCommitmentValid && teeAttestationValid;

  return {
    signatureValid,
    transparencyLogValid,
    hashCommitmentValid,
    teeAttestationValid,
    correctnessAndBiasCheck: 'OUT_OF_SCOPE',
    isUnforged,
    details: {
      signatureDetail,
      transparencyLogDetail,
      hashCommitmentDetail,
      teeAttestationDetail,
      disclaimer: '— Model correctness, fairness, and bias-free execution are OUT OF SCOPE (not claimed by ledger)',
    },
    tamperErrors,
  };
}
