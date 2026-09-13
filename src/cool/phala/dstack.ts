import type { TEEAttestation } from '../types';
import { sha256Hex } from '../hash';

const MOCK_MRENCLAVE = 'mrenclave_0x98f7e6d5c4b3a291827364554433221100fdedcb';
const MOCK_MRSIGNER = 'mrsigner_0x11223344556677889900aabbccddeeff00112233';

export async function createTEEAttestation(combinedStateHash: string, enabled = true): Promise<TEEAttestation> {
  const timestamp = new Date().toISOString();
  if (!enabled) {
    return {
      enabled: false,
      enclaveProvider: 'Phala Network dstack',
      enclaveId: 'NONE',
      mrEnclave: 'NONE',
      mrSigner: 'NONE',
      quoteSignature: 'NONE',
      timestamp,
    };
  }

  const quoteData = `${MOCK_MRENCLAVE}:${MOCK_MRSIGNER}:${combinedStateHash}:${timestamp}`;
  const quoteSigRaw = await sha256Hex(`TEE_QUOTE_SIG:${quoteData}`);

  return {
    enabled: true,
    enclaveProvider: 'Phala Network dstack',
    enclaveId: 'dstack-sgx-node-asia-south1',
    mrEnclave: MOCK_MRENCLAVE,
    mrSigner: MOCK_MRSIGNER,
    quoteSignature: `dstack_quote_${quoteSigRaw}`,
    timestamp,
  };
}

export async function verifyTEEAttestation(
  attestation: TEEAttestation,
  combinedStateHash: string
): Promise<{ valid: boolean; reason?: string }> {
  if (!attestation.enabled) {
    return { valid: true, reason: 'TEE attestation was not requested for this domain' };
  }

  const quoteData = `${attestation.mrEnclave}:${attestation.mrSigner}:${combinedStateHash}:${attestation.timestamp}`;
  const expectedSig = `dstack_quote_${await sha256Hex(`TEE_QUOTE_SIG:${quoteData}`)}`;

  if (attestation.quoteSignature !== expectedSig) {
    return { valid: false, reason: 'TEE dstack hardware quote signature mismatch or altered payload.' };
  }

  return { valid: true };
}
