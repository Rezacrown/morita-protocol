# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

ZK Invoice dApp dengan Commit-Reveal mechanism menggunakan Zero-Knowledge Proofs.

- **Frontend**: Next.js 16 + TypeScript + TailwindCSS 4
- **Smart Contract**: Cairo (Starknet) + Scarb + Starknet Foundry
- **ZK Circuit**: Noir Lang + UltraHonk prover
- **Verifier**: Garaga-generated Cairo verifier contract

## Deployed Contracts (Starknet Sepolia)

- **MoritaInvoice Contract**: `0x031d5920e2af25bb90a259c0fe44e53f89d08428bbed8e4fcea24f6b117765c5`
- **STRK Token (Sepolia)**: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`

## Development Commands

### Frontend (`frontend/`)

```bash
bun run dev          # Next.js dev server (port 3000)
bun run build        # Production build
bun run lint         # ESLint check
```

### Smart Contract (`smart-contract/`)

Semua perintah ada di Makefile:

```bash
make devnet              # Start local Starknet devnet
make build-circuit       # Build Noir circuit
make prove-circuit       # Generate proof (bb prove)
make gen-vk              # Generate verification key
make gen-verifier        # Generate Cairo verifier (garaga)
make build-verifier      # Build verifier contract
make deploy-devnet       # Deploy to devnet
make artifacts           # Copy artifacts ke frontend
```

### Demo App (`smart-contract/app/`)

```bash
bun run dev          # Vite dev server
bun run build        # Build
```

## Code Standards

- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`
- **ESLint**: Next.js + TypeScript config (eslint.config.mjs)
- **Cairo**: Scarb workspace dengan 2 packages (verifier, morita_invoice)

## ZK Workflow Critical

1. Build circuit → `make build-circuit`
2. Generate VK → `make gen-vk`
3. Generate verifier → `make gen-verifier`
4. Build contracts → `make build-verifier && make build-morita`
5. Copy artifacts → `make artifacts` (WAJIB sebelum deploy frontend)

## Application Flow

### User Flow (dari `contexts/my_expectation_flow.md`)

1. **Create Invoice (/create)**: User connect wallet, isi form (client_name, description, amount, client_address), data dienkripsi, panggil `create_invoice` smart contract, generate link dengan encrypted payload + key
2. **Client Payment (/pay)**: Client buka link `baseUrl/pay?id={invoiceHash}#key={encryptionKey}`, validasi via smart contract, decode payload, klik "Pay" untuk panggil `pay_invoice`
3. **History (/history)**: Tampilkan semua invoice terkait connected address (sebagai payee atau client)
4. **History Detail (/history/[id])**: Tampilkan detail invoice dengan status, created_at, payment_at

### Important Security Notes

- Semua halaman selain "/" WAJIB connect wallet (read dan action)
- User = yang buat invoice (payee), Client = yang bayar (payer)
- Encrypted payload menggunakan AES-256 dengan key dari URL fragment
- ZK Proof digunakan untuk verifikasi invoice tanpa mengungkap data di blockchain
- URL pattern: `?payload=[encrypted]#[key]` - key TIDAK dikirim ke server

## Frontend Integration Tasks

### Task 1: Implementasi ZK Helper (`frontend/src/lib/zk.ts`)

Buat fungsi helper berikut:

1. **generateInvoiceHash**: Mengambil input (clientName, description, amount, payee, client, timestamp). Melakukan hashing menggunakan standar Pedersen Starknet (felt252).
2. **generateAmountCommitment**: Melakukan hashing Pedersen pada (amount, first_byte_of_key) sesuai aturan sirkuit Noir main.nr.
3. **generateZKProof**: Fungsi async untuk memuat circuit.json dan vk.bin dari folder `frontend/src/constants/assets/`, lalu menggunakan Noir JS untuk men-generate proof berdasarkan private inputs (amount, key) dan public inputs.

**Dependencies yang diperlukan**:

- `@noir-lang/noir_js`
- `@noir-lang/backend_barretenberg`
- `crypto-js` (AES-256 encryption)

### Task 2: Implementasi Halaman Create (`/create`)

**Logika yang harus ditambahkan**:

1. Saat form disubmit:
   - Generate random 32-byte hex string sebagai `encryptionKey`
   - Enkripsi `clientName` dan `description` menggunakan CryptoJS AES dengan key tersebut
   - Panggil helper ZK untuk mendapatkan `invoiceHash` dan `amountCommitment`
2. Panggil fungsi `create_invoice` pada smart contract dengan parameter:
   - `invoice_hash`, `amount_commitment`, `payee`, `client_wallet`, `amount` (u256), `due_date`, `encrypted_payload` (ByteArray)
3. Setelah sukses, tampilkan link: `baseUrl/pay?id={invoiceHash}#key={encryptionKeyHex}`

**Gunakan** `byteArray.byteArrayFromString` dari Starknet.js untuk parameter `encrypted_payload`.

### Task 3: Implementasi Halaman Pay (`/pay`)

**Logika yang harus ditambahkan**:

1. Baca `id` (invoiceHash) dari query param dan `key` dari URL fragment (`#`)
2. Panggil fungsi read `get_invoice` di smart contract
3. Validasi: Jika `connected_wallet` bukan Payee atau Client, sembunyikan detail
4. Dekripsi `encrypted_payload` dari event/contract menggunakan key dari URL
5. Saat klik "Pay":
   - Generate ZK Proof secara background menggunakan helper `generateZKProof`
   - Panggil fungsi `pay_invoice` di smart contract membawa array `payment_proof`

**Urutan public inputs pada proof generator**: `[payee, client, timestamp, hash, commitment]`

### Task 4: Implementasi History (`/history`)

**Logika yang harus ditambahkan**:

1. Gunakan Starknet RPC atau Indexer untuk menarik event `InvoiceCreated` dan `InvoicePaid`
2. Filter event berdasarkan `connected_address` (sebagai payee atau client)
3. Tampilkan list invoice. Jika user punya key-nya di local storage (opsional) atau URL, tampilkan detail terdekripsi

**Handling Error**: Gunakan UI state yang user-friendly (bukan alert).

## ZK Artifacts Location

- **Circuit JSON**: `frontend/src/constants/assets/circuit.json`
- **Verification Key**: `frontend/src/constants/assets/vk.bin`
- **Verifier Contract**: `frontend/src/constants/assets/verifier.json`
- **Invoice Commitment**: `frontend/src/constants/assets/invoice_commitment.json`

**PENTING**: Update ZK artifacts di `frontend/src/constants/assets/` setelah ada perubahan circuit.

## Skills Available

- `.kilocode/skills/noir-zk-circuits/SKILL.md` - ZK circuit development
- `.kilocode/skills/starknet-dev/SKILL.md` - Starknet development
