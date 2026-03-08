# Morita - Project Context

## Overview

**Morita** adalah aplikasi _privacy-preserving B2B invoicing dApp_ (decentralized application) yang dibangun di blockchain Starknet. Ini adalah project untuk hackathon **Re{define} Hackathon**.

## Visi

Membuat solusi invoicing B2B yang menjaga privasi dengan cara:

1. **Encrypt** - Data invoice dienkripsi secara lokal menggunakan AES-GCM
2. **Commit** - Hash enkripsi disimpan ke Starknet blockchain
3. **Reveal** - Hanya pihak yang berwenang bisa melihat data dengan decrypt menggunakan key dari URL fragment

## Teknologi

- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS
- **Blockchain**: Starknet (L2), Cairo 1.0
- **Wallet**: Starknet.js (belum diimplementasi - masih mock)
- **Encryption**: AES-256-GCM, Keccak256 (belum diimplementasi - masih mock)
- **Fonts**: Inter, Playfair Display, JetBrains Mono

## Struktur Project

```
morita-protocol/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── create/page.tsx    # Create invoice
│   │   │   ├── pay/page.tsx       # Payment page
│   │   │   ├── history/page.tsx   # Invoice history list
│   │   │   └── history/[id]/page.tsx  # Invoice detail
│   │   ├── components/   # React components
│   │   │   ├── ConnectWallet.tsx
│   │   │   └── ui/       # UI components (Navbar, Footer)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
│   └── package.json
├── contracts/             # Starknet Smart Contracts (Cairo) - BELUM DIBUAT
├── prd/                  # Product Requirements Documents
│   ├── minimum-prd-v1.md
│   └── hackathon/
│       ├── brief-detail-hackathon.md
│       └── rules-hackathon.md
├── template/             # Template project (ZkInvoice legacy)
├── PROJECT_RECOMMENDATIONS.md  # Development recommendations
└── context.md            # Project context untuk LLM
```

## Fitur Saat Ini (Frontend Prototype)

### 1. Landing Page (`/`)

- Hero: "Designed for Privacy, Built for Business"
- "Architecture of Privacy" section menjelaskan flow Encrypt → Commit → Reveal

### 2. Create Invoice (`/create`)

- Form: Client Name, Description, Amount (STRK), Receiving Wallet
- Tombol "Sign & Encrypt Invoice" (saat ini masih mock)
- Menghasilkan secure URL dengan format: `https://morita.app/pay?payload=[encrypted]#key=[key]`

### 3. Payment Page (`/pay`)

- Membaca URL params dan fragment
- Loading state "Decrypting..."
- Jika PAID → Tampilkan "Settled" screen
- Jika UNPAID → Tampilkan invoice details + tombol Pay STRK

### 4. History Page (`/history`)

- Mock invoice list dengan filter:
  - Role: All / Creator / Payer
  - Status: All / Settled / Awaiting Payment
- Search by ID atau Client
- Tabel: Date, Invoice ID, Role, Status, Amount

### 5. History Detail (`/history/[id]`)

- Dynamic route untuk detail invoice
- Info: Amount, Status, Date, Client, Role, Network, Tx Hash, Decryption Key, Description
- Tombol kontekstual (Proceed to Payment / Copy Link)

## Komponen UI

- **Navbar**: Logo "Morita", links (Home/Create/History), ConnectWallet button
- **ConnectWallet**: Toggle mock connection, menampilkan address "0x049d...8f2a"
- **Footer**: "Built for Re{define} Hackathon — Powered by Starknet"

## Status Saat Ini

| Aspek                | Status                 |
| -------------------- | ---------------------- |
| Frontend UI          | ✅ Selesai (prototype) |
| Starknet Integration | ❌ Belum (mock)        |
| Smart Contract       | ❌ Belum dibuat        |
| Encryption           | ❌ Belum (mock)        |
| Wallet Connection    | ❌ Belum (mock)        |

## Rencana Pengembangan

### Fase 1: Frontend First (Saat Ini)

Fokus membangun frontend lengkap terlebih dahulu dengan mock functionality.

### Fase 2: Smart Contract Development

Setelah frontend siap, baru dikembangkan smart contract di folder `contracts/`.

Lihat file `PROJECT_RECOMMENDATIONS.md` untuk detail lengkap.

### Prioritas Tinggi:

1. Integrasi starknet.js untuk wallet connection
2. Implementasi AES-256-GCM encryption
3. **Smart Contract Cairo** (Fase 2)

### Prioritas Sedang:

4. State management (Zustand/Context API)
5. Data fetching dari smart contract
6. Error handling dan validasi

### Prioritas Rendah:

7. UI/UX improvements
8. Testing
9. Dokumentasi
10. Security audit

## Smart Contract (Coming Soon)

**Folder `contracts/` belum dibuat.** Rencana:

- **Language**: Cairo 1.0
- **Framework**: Starknet Foundry (snfoundry) atau Nile
- **Funcionalitas**:
  - Create invoice (store encrypted hash)
  - Update invoice status (paid/unpaid)
  - Get invoice details by ID
  - Verify payment

## Catatan Penting

- Semua fungsi Web3 masih **mock** - belum ada koneksi nyata ke Starknet
- Ini adalah **frontend prototype** yang siap dikembangkan lebih lanjut
- Nama project adalah **Morita** (bukan ZkInvoice)
- Target deployment: Starknet testnet lalu mainnet
- **Prioritas saat ini: Frontend dulu, lalu smart contract**
- Monorepo structure: `frontend/` + `contracts/` dalam satu repo

## Link Referensi

- Website: https://morita.app
- Starknet Docs: https://docs.starknet.io/
- Starknet.js: https://www.starknet-react.com/
