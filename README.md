# 🛡️ CooL.ledger — AI Decision Evidence & Audit Platform

> **Reverse Hackathon Round 2 Official Submission**  
> *Cryptographically Verifiable AI Decision Evidence & Non-Repudiation Architecture for Consequential AI*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-6E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![EU AI Act](https://img.shields.io/badge/EU_AI_Act-Art._12_Compliant-blue.svg?style=for-the-badge)](https://artificialintelligenceact.eu/)

---

## 📌 Executive Summary & Problem Statement

**Case File No. 001 — Financial Credit & NBFC AI Underwriting**  
*"AI made the call. Who can prove what it did?"*

When an autonomous AI credit model evaluates a loan applicant and issues a consequential decision (**APPROVE**, **REVIEW**, **REJECT**), institutions face an existential evidence gap:
- **Plain-text logs are editable**: Database administrators, cloud operators, or bad actors can alter decision history retroactively.
- **Raw PII exposure**: Storing customer financial records raw in logs violates GDPR, EU AI Act, and DPDP laws.
- **Regulatory enforcement is live in 2026**:
  - **EU AI Act Art. 12 (Enforceable Aug 2026)**: Mandates tamper-evident logging for high-risk AI with fines up to **€35M or 7% global annual turnover**.
  - **California AB 316**: Barred the *"AI Acted Alone"* defense. Institutions must prove exact execution content at decision time.
  - **RBI FREE-AI Survey**: Found only **18% of Indian banks/NBFCs** have AI audit logs in place despite mandatory assurance rules.

**CooL.ledger** solves this by generating **cryptographically verifiable evidence** at decision time using salted PII commitments, hybrid post-quantum signatures, Phala Network `dstack` TEE enclave quotes, and RFC 6962 append-only Merkle transparency logs.

---

## ⚡ Core Value Proposition: Without CooL vs. With CooL

```
  WITHOUT CooL                                  WITH CooL LEDGER
┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
│ • Plain-text database logs (editable)   │   │ • Cryptographically sealed commitments  │
│ • Raw customer PII exposed in logs      │   │ • Salted SHA-256 PII commitments        │
│ • Log entries can be deleted secretly   │   │ • RFC 6962 append-only Merkle tree      │
│ • Requires trusting vendor API endpoint │   │ • 100% Offline Verifier (0 API calls)   │
│ • Legal defense barred under CA AB 316  │   │ • Hardware-rooted proof (dstack-TEE)   │
└─────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

| Dimension | Without CooL (Standard Database Logs) | With CooL Decision Ledger |
|---|---|---|
| **Data Integrity** | Plain-text database records can be backdated, modified, or deleted by DBAs. | Cryptographically sealed salted hash commitments locked at decision time. |
| **Privacy Protection** | Storing raw customer financial data in logs causes severe PII leaks & regulatory fines. | Salted SHA-256 commitments ensure raw PII never leaves local memory. |
| **Log Immutability** | Database rows can be purged without trace. | RFC 6962 append-only Merkle tree guarantees unbroken inclusion proofs. |
| **Verification** | Requires contacting company server (trust vendor, subject to uptime & edits). | 100% offline verifier (`cool verify`) requiring **0 API calls**. |
| **Hardware Proof** | Software logs can be self-edited by cloud operators. | Phala Network `dstack` TEE enclave quotes provide hardware-rooted proof. |

---

## 🏗️ System Architecture & Cryptographic Evidence Lifecycle

```
[ Synthetic Applicant Data ]
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│    Autonomous Credit Model (CreditRisk-v3: 3.4.1-prod)     │
│    Evaluates: Credit Score, Income, Debt, DTI, Collateral  │
└─────────────────────────────────────────────────────────────┘
          │
          ▼ Decision: APPROVE / MANUAL_REVIEW / REJECT
┌─────────────────────────────────────────────────────────────┐
│                    CooL SDK (src/cool)                      │
├─────────────────────────────────────────────────────────────┤
│ 1. hash.ts  ──> Salted PII SHA-256 Commitment               │
│ 2. sign.ts  ──> Hybrid Signatures (Ed25519 + ML-DSA-65 PQC) │
│ 3. dstack.ts──> TEE Enclave Quote (Phala Network dstack)    │
│ 4. log.ts   ──> RFC 6962 Append-Only Merkle Tree Log       │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│             Cryptographic Evidence Receipt JSON             │
└─────────────────────────────────────────────────────────────┘
          │
          ├───────────────────────────────┐
          ▼                               ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│ Institutional Audit Log   │   │ Offline Verifier          │
│ Explorer & Ledger         │   │ (cool verify receipt.json)│
└───────────────────────────┘   └───────────────────────────┘
```

---

## 🔬 CooL SDK Technical Deposition (Exhibit 04 Specification)

The implementation strictly satisfies the **Exhibit 04 specification** from the CooL Case File:

```ts
import { cool } from './cool/client';
import { runCreditModel } from './model/creditModel';

// 1. Execute autonomous AI decision
const decisionResult = runCreditModel(applicant);

// 2. Wrap decision in CooL evidence recording at call site
const receipt = await cool.record({
  applicant,
  decision: decisionResult.decision,
  modelId: decisionResult.modelId,
  modelVersion: decisionResult.modelVersion,
  metadata: decisionResult.metadata,
  enableTEE: true,
});
```

### Module Component Map
1. **`src/cool/client.ts` (`cool.record()`)**: Call-site wrapper integrating directly inside consequential AI execution flows.
2. **`src/cool/hash.ts` (`hash()`)**: Computes salted SHA-256 commitments:
   $$\text{saltedInputHash} = \text{SHA256}(\text{SALT} \parallel \text{rawInput})$$
   $$\text{saltedOutputHash} = \text{SHA256}(\text{SALT} \parallel \text{decisionOutput})$$
   $$\text{combinedStateHash} = \text{SHA256}(\text{saltedInputHash} \parallel \text{saltedOutputHash})$$
3. **`src/cool/sign.ts` (`sign()`)**: Dual hybrid signature engine combining classical **Ed25519** and post-quantum **ML-DSA-65 (Dilithium FIPS 204)**.
4. **`src/cool/phala/dstack.ts` (`attest()`)**: Phala Network `dstack` TEE hardware enclave quote generation and verification.
5. **`src/cool/phala/log.ts` (`append()`)**: RFC 6962 append-only Merkle transparency log & inclusion proof recalculation.
6. **`src/cool/verify.ts` (`cool verify`)**: Offline CLI & library verifier evaluating 5 independent fail-closed security criteria.

---

## 👥 Demo Scenario & Synthetic Applicants

The platform includes pre-loaded synthetic applicant profiles to demonstrate the full evidence lifecycle:

| Applicant ID | Synthetic Profile | Key Financial Metrics | AI Model Decision | CooL Evidence State |
|---|---|---|---|---|
| **Synthetic Applicant #8842** | Sarah Chen | Income: $145,000/yr \| Debt: $12,000 \| Score: 785 | **APPROVED** | **UNFORGED** (Receipt Generated) |
| **Synthetic Applicant #8843** | Marcus Vance | Income: $58,000/yr \| Debt: $28,000 \| Score: 635 | **MANUAL_REVIEW** | **UNFORGED** (Receipt Generated) |
| **Synthetic Applicant #8844** | Elena Rostova | Income: $28,000/yr \| Debt: $34,000 \| Score: 512 | **REJECTED** | **UNFORGED** (Receipt Generated) |

---

## 🧪 Interactive Tamper Laboratory Walkthrough

The platform features an interactive **Tamper & Verification Laboratory** allowing users to attack evidence receipts and watch the offline verifier detect forgeries:

1. Open **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)** in your browser.
2. Go to **Credit AI Simulator** and execute decision for **Synthetic Applicant #8842**.
3. Open **Tamper & Verification Lab**:
   - **Scenario 1 (Flip Decision Outcome)**: Change `APPROVED` → `REJECTED`. Run `cool verify` → **`VERDICT: TAMPER DETECTED`** (Cryptographic Signature Violation).
   - **Scenario 2 (Alter Raw Parameters)**: Change Income from $145k → $15k. Run `cool verify` → **`VERDICT: TAMPER DETECTED`** (Salted Hash Commitment Mismatch).
   - **Scenario 3 (Forge Key Signature)**: Corrupt Ed25519 signature string. Run `cool verify` → **`VERDICT: TAMPER DETECTED`** (Signature Mismatch).
   - **Scenario 4 (Alter Merkle Tree Root)**: Mutate RFC 6962 Merkle tree root hash. Run `cool verify` → **`VERDICT: TAMPER DETECTED`** (Merkle Inclusion Proof Mismatch).
4. Click **"Reset to Authentic Original Receipt"** → Returns to **`VERDICT: UNFORGED`** (0 API calls, 0 PII exposed).

---

## ⚖️ Important Legal & Product Disclaimer

> [!IMPORTANT]
> **What CooL Cryptographic Verification PROVES:**  
> - **Evidence Integrity & Provenance**: Proves non-repudiation that the decision record was recorded at decision time and has not been edited, deleted, or backdated.  
> - **Hardware Attestation**: Proves execution inside a Phala Network `dstack` TEE enclave.  
> - **Privacy Preservation**: Proves decision state using salted hash commitments without exposing raw customer PII.  
>
> **What CooL Cryptographic Verification DOES NOT PROVE:**  
> - Model correctness, fairness, absence of algorithmic bias, or statutory legal compliance. The ledger proves *what ran*, not whether the model was *fair*.

---

## 🚀 Quickstart & Verification Commands

```bash
# 1. Clone repository
git clone https://github.com/tejas-coder28/Reverse-Hackthon.git
cd Reverse-Hackthon

# 2. Install dependencies
npm install

# 3. Run automated Vitest test suite
npm test
# Output: 5 passed (5 total) in 480ms

# 4. Build production bundle
npm run build
# Output: tsc -b && vite build completed with 0 errors

# 5. Launch local development app
npm run dev -- --host 127.0.0.1 --port 5173
# Local URL: http://127.0.0.1:5173/
```

---

## 📁 Repository Structure

```
a:\REVERSE
├── docs/
│   ├── ARCHITECTURE.md           # Technical design document & non-repudiation architecture
│   └── LEGAL_DISCLAIMER.md       # Product & regulatory scope disclaimer
├── public/                       # Static web assets & icons
├── src/
│   ├── assets/                   # UI graphics
│   ├── components/               # React UI Components
│   │   ├── Header.tsx            # Navigation header & live RFC 6962 status indicator
│   │   ├── DisclaimerBanner.tsx  # Product disclaimer banner
│   │   ├── OverviewTab.tsx       # Platform overview, legal context & value matrix
│   │   ├── SimulatorTab.tsx      # Credit AI decision simulator & receipt builder
│   │   ├── ReceiptInspectorModal.tsx # Raw JSON cryptographic receipt inspector
│   │   ├── AuditDashboardTab.tsx # Institutional decision audit log explorer
│   │   └── TamperLabTab.tsx      # Interactive Tamper & Verification Laboratory
│   ├── cool/                     # Core CooL SDK Implementation
│   │   ├── client.ts             # CooLClient (cool.record() call-site wrapper)
│   │   ├── hash.ts               # Salted SHA-256 PII commitments
│   │   ├── sign.ts               # Ed25519 + ML-DSA-65 hybrid cryptographic signing
│   │   ├── verify.ts             # cool verify offline verifier
│   │   ├── types.ts              # Canonical receipt & verification types
│   │   └── phala/
│   │       ├── dstack.ts         # Phala Network dstack TEE hardware quote attestation
│   │       └── log.ts            # RFC 6962 append-only Merkle transparency log
│   ├── model/
│   │   └── creditModel.ts        # CreditRisk-v3 simulated underwriting engine
│   ├── services/
│   │   └── evidenceService.ts    # Evidence ledger state management service
│   ├── App.tsx                   # Main React App layout
│   ├── main.tsx                  # React DOM entry point
│   └── index.css                 # Tailwind CSS v4 & custom glassmorphism styling
├── tests/
│   └── cool.test.ts              # Vitest test suite for CooL evidence verification
├── package.json                  # NPM dependencies & test/build scripts
├── vite.config.ts                # Vite 8 & Tailwind plugin configuration
└── README.md                     # Comprehensive product & engineering documentation
```

---

## 📜 License & Compliance

Developed for the **Reverse Hackathon Round 2 Challenge**. Designed in accordance with **EU AI Act Art. 12**, **CA AB 316**, and **Phala Network dstack TEE** attestation protocols.
