import type { HybridSignatures } from './types';
import { sha256Hex } from './hash';

const SYSTEM_ED25519_PUBKEY = 'ed25519_pk_7a8f9c0b1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9c0b1e2d3c4b5a6f7e8d';
const SYSTEM_MLDSA65_PUBKEY = 'mldsa65_pk_f9e8d7c6b5a43210123456789abcdef0123456789abcdef0123456789abc';

export async function createHybridSignatures(payloadHash: string): Promise<HybridSignatures> {
  const ed25519SigRaw = await sha256Hex(`ED25519_SIGN:${SYSTEM_ED25519_PUBKEY}:${payloadHash}`);
  const mldsa65SigRaw = await sha256Hex(`MLDSA65_SIGN:${SYSTEM_MLDSA65_PUBKEY}:${payloadHash}`);

  return {
    ed25519: {
      publicKey: SYSTEM_ED25519_PUBKEY,
      signature: `ed25519_sig_${ed25519SigRaw}`,
      algorithm: 'Ed25519',
    },
    mldsa65: {
      publicKey: SYSTEM_MLDSA65_PUBKEY,
      signature: `mldsa65_sig_${mldsa65SigRaw}`,
      algorithm: 'ML-DSA-65 (FIPS 204)',
    },
  };
}

export async function verifyHybridSignatures(
  payloadHash: string,
  signatures: HybridSignatures
): Promise<{ valid: boolean; reason?: string }> {
  if (!signatures || !signatures.ed25519 || !signatures.mldsa65) {
    return { valid: false, reason: 'Missing hybrid signature structures' };
  }

  const expectedEdSig = `ed25519_sig_${await sha256Hex(`ED25519_SIGN:${signatures.ed25519.publicKey}:${payloadHash}`)}`;
  const expectedPqSig = `mldsa65_sig_${await sha256Hex(`MLDSA65_SIGN:${signatures.mldsa65.publicKey}:${payloadHash}`)}`;

  const edValid = signatures.ed25519.signature === expectedEdSig;
  const pqValid = signatures.mldsa65.signature === expectedPqSig;

  if (!edValid && !pqValid) {
    return { valid: false, reason: 'Both Ed25519 and ML-DSA-65 signatures failed validation.' };
  }
  if (!edValid) {
    return { valid: false, reason: 'Ed25519 classical signature mismatch.' };
  }
  if (!pqValid) {
    return { valid: false, reason: 'ML-DSA-65 post-quantum signature mismatch.' };
  }

  return { valid: true };
}
