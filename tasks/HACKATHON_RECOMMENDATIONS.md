# Morita Protocol - Hackathon Recommendations

## 🎯 Executive Summary

**Morita Protocol** adalah aplikasi decentralized (dApp) untuk invoicing B2B yang privacy-preserving, dibangun di atas blockchain Starknet. Project ini mengikuti track **Privacy** pada Re{define} Hackathon dengan fokus pada perlindungan data sensitif melalui enkripsi AES-256-GCM dan ZK proofs.

**Status Saat Ini**: Frontend prototype telah selesai dikembangkan, namun integrasi Web3 (Starknet.js) dan smart contract deployment masih dalam tahap mocking. Deadline hackathon adalah **28 Februari 2026** - jika fokus pada submission aktif, timeline sudah terlampaui, namun rekomendasi ini tetap berguna untuk pengembangan lanjutan.

## 📋 Project Context

### Problem Statement

Bisnis B2B menghadapi tantangan signifikan dalam pengelolaan invoice di blockchain:

- **Transparansi publik blockchain** bertentangan dengan kebutuhan kerahasiaan data bisnis
- **Invoice sensitif** (harga, quantity, customer details) terekspos di on-chain
- **Compliance** dengan regulasi data (GDPR, etc.) sulit dipenuhi
- **Trust issue** antara buyer dan seller tanpa pihak ketiga yang trustworthy

### Architecture Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Buyer       │     │    Starknet     │     │     Seller      │
│   (Frontend)    │◄───►│   Blockchain    │◄───►│   (Frontend)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Morita Protocol Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │ AES-256-GCM │  │   Noir ZK    │  │ Smart       │  │ Storage   │  │
│  │ Encryption  │  │   Circuit    │  │ Contract    │  │ Layer     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    Off-chain Encrypted Data IPFS
```

### Tech Stack

| Layer                 | Technology                  | Status                 |
| --------------------- | --------------------------- | ---------------------- |
| **Frontend**          | Next.js 14 + TypeScript     | ✅ Prototype Complete  |
| **Web3 Integration**  | Starknet.js, Starknet React | 🔴 Not Yet Integrated  |
| **Encryption**        | AES-256-GCM                 | 🔴 Not Yet Implemented |
| **ZK Circuit**        | Noir (with Aztec)           | ✅ Basic Circuit Ready |
| **Smart Contract**    | Cairo (Starknet)            | 🔴 Needs Development   |
| **Verifier Contract** | Honk Verifier               | ⚠️ Basic Template      |
| **Testing**           | Starknet Foundry            | ⚠️ Setup Needed        |

## 📊 Current Status Analysis

### Components Status Overview

| Component            | Status               | Completion | Priority |
| -------------------- | -------------------- | ---------- | -------- |
| Frontend UI          | 🟢 Complete          | 100%       | -        |
| Homepage             | 🟢 Complete          | 100%       | -        |
| Create Invoice Page  | 🟢 Complete          | 100%       | -        |
| Payment Page         | 🟢 Complete          | 100%       | -        |
| History Page         | 🟢 Complete          | 100%       | -        |
| Invoice Detail Page  | 🟢 Complete          | 100%       | -        |
| Wallet Connection    | 🔴 Not Integrated    | 0%         | Critical |
| AES Encryption Logic | 🔴 Not Implemented   | 0%         | Critical |
| ZK Proof Generation  | 🔴 Not Integrated    | 0%         | Critical |
| Smart Contract       | 🔴 Needs Development | 10%        | Critical |
| Testnet Deployment   | 🔴 Not Done          | 0%         | Critical |
| End-to-End Testing   | 🔴 Not Done          | 0%         | High     |

### Detailed Gap Analysis

**Yang Sudah Ada**:

- ✅ Next.js 14 + TypeScript project structure
- ✅ Complete UI components (7 pages + shared components)
- ✅ Design system dengan shared UI components
- ✅ Basic ZK circuit skeleton (main.nr)
- ✅ Honk verifier contracts (template dari garaga)
- ✅ Documentation (architecture-flow.md, zk-implementation-plan.md)
- ✅ Mono-repo setup dengan frontend + smart-contract separation

**Yang Belum Ada**:

- ❌ Starknet.js wallet integration
- ❌ Client-side AES-256-GCM encryption
- ❌ Full ZK proof generation pipeline di frontend
- ❌ Invoice smart contract dengan storage + logic
- ❌ Integration antara frontend dan smart contract
- ❌ Testnet deployment dan testing
- ❌ Unit tests dan integration tests
- ❌ Deployment scripts

## 🏆 Hackathon Compliance

### Track Eligibility: Privacy

| Requirement                | Status     | Evidence                   |
| -------------------------- | ---------- | -------------------------- |
| AES-256-GCM Encryption     | ⚠️ Planned | belum diimplementasi       |
| ZK Proof Integration       | ⚠️ Basic   | circuit skeleton ready     |
| Privacy-preserving Storage | ⚠️ Planned | IPFS + encryption          |
| On-chain Verification      | ⚠️ Basic   | verifier contract template |

### Submission Requirements Check

| Requirement               | Status          | Notes                    |
| ------------------------- | --------------- | ------------------------ |
| Working dApp              | 🔴 Not Ready    | Web3 integration missing |
| Smart Contract on Testnet | 🔴 Not Deployed | Contract desenvolvimento |
| Source Code Public        | ✅ Ready        | Git repository exists    |
| Demo Video                | ❌ Not Created  | Need submission          |
| Documentation             | ✅ Good         | Multiple docs exist      |
| Testing                   | 🔴 Not Done     | Zero coverage            |

### Privacy Track Specific Requirements

- [x] Clear privacy architecture documentation
- [x] AES encryption scheme described in docs
- [x] ZK proof approach defined
- [ ] Full implementation of encryption layer
- [x] Verifier smart contract foundation
- [ ] Integration testing untuk privacy guarantees

## ⏰ Timeline Assessment

### Timeline Analysis (from Date: Mar 9, 2026)

| Milestone                  | Original Target    | Current Status       | Delta           |
| -------------------------- | ------------------ | -------------------- | --------------- |
| Frontend Prototype         | ✅ End of Feb 2025 | Complete             | On Track        |
| ZK Circuit Design          | ✅ Jan 2026        | Basic Implementation | Slight Delay    |
| Smart Contract Development | Feb 2026           | Not Started          | Critical Gap    |
| Web3 Integration           | Feb 2026           | Not Started          | Critical Gap    |
| Testnet Deployment         | Feb 28, 2026       | Not Done             | Timeline Missed |
| Submission Deadline        | Feb 28, 2026       | Passed               | 8+ days overdue |

### Recommendation: Timeline sudah melewati deadline

```
┌─────────────────────────────────────────────────────────────────┐
│  TIMELINE VISUALIZATION                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Jan 2026          Feb 2026          Mar 2026                  │
│     │                 │                 │                       │
│     ├─────────────┬───┴─────────────┬───┘                       │
│     │             │                 │                           │
│     └─────────────┴─────────────────┴───────────────────────────�│
│     Deadline     Current     ██████ = Late by 8+ days          │
│     (Feb 28)     (Mar 9)                                    │
│                                                                 │
│  🔴 RECOMMENDATION: Untuk submission aktif, sudah terlambat    │
│  ⚠️  Pertimbangkan extended track atau submission berikutnya   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Prioritas Pengembangan

### Critical Priority (Must Have untuk MVP)

- [ ] Implementasi Starknet.js wallet connection
- [ ] Pengembangan Invoice smart contract (Cairo)
- [ ] Client-side AES-256-GCM encryption module
- [ ] ZK proof generation pipeline integration
- [ ] Frontend-smart contract integration layer
- [ ] Testnet deployment script
- [ ] Basic unit tests (coverage > 60%)

### Important Priority (Should Have)

- [ ] Complete ZK circuit untuk proof verification
- [ ] IPFS integration untuk encrypted data storage
- [ ] Payment flow integration dengan smart contract
- [ ] Error handling dan loading states
- [ ] Wallet disconnection dan session management
- [ ] Transaction history tracking
- [ ] Performance optimization (proof generation time)

### Nice to Have (Could Have)

- [ ] Multi-language support (EN/ID)
- [ ] Dark/light theme toggle
- [ ] Advanced filtering di history page
- [ ] Export invoice ke PDF
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Gas fee estimation
- [ ] Batch invoice creation

## 💎 Value Proposition

### Untuk Judging Criteria

| Criteria                 | Strength                               | Improvement Needed          |
| ------------------------ | -------------------------------------- | --------------------------- |
| **Innovation**           | ZK + AES hybrid approach untuk privacy | Need working implementation |
| **Technical Complexity** | Multi-layer encryption + Starknet      | Show in demo                |
| **Market Fit**           | B2B invoicing yang real                | User testing needed         |
| **Design/UX**            | Clean Next.js UI                       | Web3 UX patterns            |
| **Completeness**         | Strong foundation                      | Missing key integrations    |
| **Presentation**         | Documentation ready                    | Demo video needed           |

### Unique Selling Points

1. **Zero-Knowledge Privacy**: Invoice data tidak pernah tersembunyi on-chain, hanya proof yang terverifikasi
2. **AES + ZK Hybrid**: double-layer protection dengan AES untuk storage + ZK untuk verification
3. **Starknet Advantage**: Low fees + privacy-native architecture
4. **B2B Focus**: Compliance-ready dengan support untuk audit trails tanpa exposure
5. **Separated Concerns**: Encryption happens client-side, verification on-chain

## 🎯 Strategic Recommendations

### Immediate Actions (1-2 Minggu)

1. **Wallet Integration Priority**

   ```bash
   # Install dependencies
   npm install @avnu/starknet.js @starknet-react/core
   ```

   - Implementasikan ConnectWallet dengan Starknet.js
   - Add network detection (Sepolia testnet)
   - Handle account connection/disconnection

2. **Smart Contract Development**
   - Define Invoice struct dengan encrypted data references
   - Implement CRUD operations: create, update, pay, verify
   - Add access control untuk encryption key management
   - Write unit tests dengan Starknet Foundry

3. **Encryption Layer Implementation**
   ```typescript
   // Basic structure
   interface EncryptedInvoice {
     ciphertext: string; // AES-256-GCM encrypted data
     iv: string; // Initialization vector
     tag: string; // Authentication tag
     hash: string; // Commitment for verification
   }
   ```

### Medium-Term Goals (2-4 Minggu)

4. **ZK Proof Integration**
   - Complete Noir circuit untuk encrypted data verification
   - Generate proving keys dan verification keys
   - Implement proof generation di frontend (WebAssembly)
   - Deploy verifier contract ke testnet

5. **Storage Layer**
   - IPFS integration untuk encrypted invoice metadata
   - Pinata or Infura sebagai IPFS provider
   - Metadata structure dengan encrypted references

6. **End-to-End Testing**
   - Integration tests untuk complete flow
   - Edge cases: network disconnect, insufficient gas
   - User acceptance testing

### Long-Term Vision (1-2 Bulan)

7. **Production Readiness**
   - Audit smart contract security
   - Stress testing for scalability
   - Monitoring dan alerting setup
   - CI/CD pipeline automation

8. **Feature Expansion**
   - Multi-signature approval
   - Recurring invoice support
   - Integration dengan existing ERP systems
   - API endpoints untuk B2B platforms

## 📁 Files Checklist

### Files yang Perlu Diupdate

| File                                         | Action                     | Priority  |
| -------------------------------------------- | -------------------------- | --------- |
| `frontend/src/lib/zk.ts`                     | Add proof generation logic | Critical  |
| `frontend/src/components/ConnectWallet.tsx`  | Integrate Starknet.js      | Critical  |
| `frontend/src/lib/encryption.ts`             | Create new file            | Critical  |
| `frontend/src/constants/contracts.ts`        | Add contract addresses     | Important |
| `frontend/src/hooks/useInvoice.ts`           | Create new hook            | Important |
| `smart-contract/contracts/src/invoice.cairo` | Create new contract        | Critical  |

### Files yang Perlu Dibuat

| File                                         | Purpose                          |
| -------------------------------------------- | -------------------------------- |
| `frontend/src/lib/encryption.ts`             | AES-256-GCM encryption utilities |
| `smart-contract/contracts/src/invoice.cairo` | Invoice smart contract           |
| `smart-contract/contracts/src/invoice.cairo` | Payment verification contract    |
| `tests/invoice_test.cairo`                   | Smart contract unit tests        |
| `scripts/deploy.ts`                          | Deployment script                |
| `scripts/generate-proof.ts`                  | Proof generation script          |
| `.env.example`                               | Environment variables template   |
| `docker-compose.override.yml`                | IPFS + local node setup          |

### Documentation Updates Needed

| Document                         | Updates Required                    |
| -------------------------------- | ----------------------------------- |
| `docs/architecture-flow.md`      | Add Web3 integration details        |
| `docs/zk-implementation-plan.md` | Update dengan implementation status |
| `README.md`                      | Add running instructions            |
| `prd/minimum-prd-v1.md`          | Add acceptance criteria             |

## ✅ Action Checklist - Summary

### Phase 1: Foundation (Week 1-2)

- [ ] Setup Starknet.js dependencies di frontend
- [ ] Implement wallet connection component
- [ ] Create Invoice smart contract skeleton
- [ ] Add encryption utilities (AES-256-GCM)
- [ ] Setup development environment (Sepolia testnet)

### Phase 2: Core Integration (Week 3-4)

- [ ] Complete smart contract logic
- [ ] Integrate encryption dengan invoice creation flow
- [ ] Add proof generation using Noir
- [ ] Implement IPFS storage for encrypted data
- [ ] Create payment flow integration

### Phase 3: Testing & Deployment (Week 5-6)

- [ ] Write unit tests (target: 60% coverage)
- [ ] Deploy smart contracts ke testnet
- [ ] Integration testing (end-to-end)
- [ ] Performance optimization
- [ ] Security audit (internal)

### Phase 4: Polish & Launch (Week 7-8)

- [ ] Create demo video
- [ ] Finalize documentation
- [ ] User testing dan feedback iteration
- [ ] Submit ke hackathon (jika applicable)
- [ ] Prepare production deployment

## 📚 References

### Documentation Links

| Document          | Location                                       | Purpose                      |
| ----------------- | ---------------------------------------------- | ---------------------------- |
| Architecture Flow | `docs/architecture-flow.md`                    | System architecture overview |
| ZK Implementation | `docs/zk-implementation-plan.md`               | ZK circuit design details    |
| Mono-repo Setup   | `docs/monerepo-setup.md`                       | Project structure guide      |
| Minimum PRD       | `prd/minimum-prd-v1.md`                        | Product requirements         |
| Hackathon Brief   | `prd/hackathon/brief-detail-hackathon.md`      | Track requirements           |
| Hackathon Rules   | `prd/hackathon/rules-hackathon.md`             | Submission guidelines        |
| Frontend Plan     | `tasks/completed/frontend-refactoring-plan.md` | UI/UX roadmap                |

### External Resources

| Resource           | URL                                             | Purpose                |
| ------------------ | ----------------------------------------------- | ---------------------- |
| Starknet.js Docs   | https://www.starknet-react.com/docs             | Wallet integration     |
| Noir Documentation | https://noir-lang.org/                          | ZK circuit development |
| Starknet Foundry   | https://foundry.starknet.io/                    | Smart contract testing |
| OpenZeppelin Cairo | https://github.com/OpenZeppelin/cairo-contracts | Contract templates     |
| AES Standards      | https://csrc.nist.gov/pubs/fips/197/fip-197.pdf | Encryption reference   |
| IPFS Documentation | https://docs.ipfs.io/                           | Decentralized storage  |

### Smart Contract References

| Contract          | Location                                                    | Purpose                   |
| ----------------- | ----------------------------------------------------------- | ------------------------- |
| Verifier Template | `smart-contract/contracts/verifier/`                        | ZK proof verification     |
| Honk Verifier     | `smart-contract/contracts/verifier/src/honk_verifier.cairo` | Groth16/Honk verification |
| Circuit Source    | `smart-contract/circuit/src/main.nr`                        | Noir circuit definition   |

---

## 🎯 Kesimpulan

**Morita Protocol** memiliki fondasi yang solid dengan frontend yang lengkap dan dokumentasi yang baik. Gap utama adalah di area Web3 integration: Starknet.js wallet connection, AES encryption, dan smart contract development.

**Untuk timeline hackathon aktif**: Maaf, deadline sudah terlewat (28 Feb 2026). Rekomendasi fokus pada pengembangan untuk **track berikutnya** atau **extended deadline**.

**Next Steps Terprioritas**:

1. ⭐ Implementasikan Starknet.js wallet connection
2. ⭐ Develop Invoice smart contract di Cairo
3. ⭐ Add client-side AES-256-GCM encryption
4. ⭐ Complete ZK proof integration
5. ⭐ Deploy ke Starknet Sepolia testnet

**Good luck dengan pengembangan selanjutnya!** 🚀
