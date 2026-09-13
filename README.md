# CooL AI Decision Evidence & Audit Platform

> **Reverse Hackathon Round 2 Submission**  
> *Cryptographically Verifiable AI Decision Evidence for High-Consequence Workflows*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-green.svg)](https://vitest.dev/)

---

## 📌 Executive Summary

When an autonomous AI model makes a high-consequence decision (such as approving or denying credit at a financial institution), traditional application logs are vulnerable: they can be backdated, edited by database administrators, or disputed in regulatory audits. Furthermore, raw applicant data stored in logs violates privacy laws.

The **CooL AI Decision Evidence & Audit Platform** provides a drop-in cryptographic evidence layer that wraps consequential AI decisions at the call site.

---

## ⚡ Core Value: Without CooL vs. With CooL

| Feature | Without CooL (Standard Database Logs) | With CooL Decision Ledger |
|---|---|---|
| **Data Integrity** | Plain-text database logs can be retroactively altered or deleted. | Cryptographically sealed salted hash commitments locked at decision time. |
| **Privacy Protection** | Storing customer financial data raw violates GDPR & DPDP regulations. | Salted SHA-256 commitments ensure raw PII never leaves local memory. |
| **Log Immutability** | Log lines can be deleted without detection. | RFC 6962 append-only Merkle tree guarantees unbroken inclusion proofs. |
| **Verification** | Requires internal company API (trust vendor, subject to downtime). | 100% offline verifier (`cool verify`) requiring **0 API calls**. |
| **Hardware Proof** | Software logs can be self-edited by cloud operators. | Phala Network `dstack` TEE enclave quotes provide hardware-rooted proof. |

---

## 🛠️ CooL SDK Component Architecture (Exhibit 04 Specification)

1. **`cool.record()` (`src/cool/client.ts`)**: Call-site wrapper integrating directly inside consequential AI execution flows.
2. **`hash()` (`src/cool/hash.ts`)**: Salted-hash commitment ensuring raw PII is sealed securely offline.
3. **`sign()` (`src/cool/sign.ts`)**: Hybrid classical Ed25519 & post-quantum ML-DSA-65 (Dilithium FIPS 204) signatures.
4. **`attest()` (`src/cool/phala/dstack.ts`)**: Phala Network `dstack` TEE hardware enclave quote generation and verification.
5. **`append()` (`src/cool/phala/log.ts`)**: RFC 6962 append-only Merkle transparency log & inclusion proofs.
6. **`cool verify` (`src/cool/verify.ts`)**: Offline CLI & library verifier returning fail-closed per-domain verdicts.

---

## 🚀 Quickstart & Installation

```bash
# 1. Clone the repository
git clone https://github.com/tejas-coder28/Reverse-Hackthon-.git
cd Reverse-Hackthon-

# 2. Install dependencies
npm install

# 3. Run automated cryptographic test suite
npm test

# 4. Build production bundle
npm run build

# 5. Launch local development app
npm run dev
```

---

## 🧪 Interactive Tamper Laboratory Flow

1. Open `http://127.0.0.1:5173/` in your browser.
2. Navigate to **Credit AI Simulator** and execute decision on **Synthetic Applicant #8842 (Sarah Chen)** -> Outputs **APPROVED** with CooL receipt `DEC-SyntheticApplicant#8842-...`.
3. Open **Tamper & Verification Lab**:
   - Click **"1. Flip Decision Outcome"** (changes outcome from APPROVED to REJECTED).
   - Click **"Run Offline Verifier (cool verify receipt.json)"**.
   - Observe the offline verifier detect the forgery: **`VERDICT: TAMPER DETECTED`** with signature violation stack trace.
   - Click **"Reset to Authentic Original Receipt"** → Returns to **`VERDICT: UNFORGED`**.

---

## ⚖️ Disclaimer

CooL-based cryptographic verification proves **evidence integrity & non-repudiation provenance** (unforged decision logs). It does **NOT** prove AI model correctness, fairness, absence of bias, or statutory legal compliance.
