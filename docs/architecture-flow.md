# Morita Protocol - High-Level Architecture & Flow

## 1. Overview Aplikasi

### Apa itu Morita Protocol (ZkInvoice)?

Morita Protocol adalah protokol invoice berbasis blockchain Starknet yang menyediakan **privacy-preserving invoice settlement** — solusi invoice yang menjaga privasi freelancer dan client dengan teknologi zero-knowledge proof dan enkripsi client-side.

### Value Proposition Utama

- **Privacy-First**: Data invoice dienkripsi client-side sebelum disimpan di blockchain
- **Zero-Knowledge Verification**: Client dapat memverifikasi invoice tanpa melihat detail sensitif
- **Trustless Settlement**: Transaksi pembayaran terjadi secara on-chain dengan jaminan keamanan
- **Cost-Effective**: Menggunakan Starknet (Layer 2) untuk biaya transaksi minimal

---

## 2. User Flow Lengkap

### Freelancer Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FREELANCER FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CREATE INVOICE                                                          │
│  ┌─────────────────┐                                                        │
│  │  - Client Name  │                                                        │
│  │  - Description  │                                                        │
│  │  - Amount (STRK)│                                                        │
│  │  - Due Date     │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  2. ENCRYPT (AES-256-GCM)                                                   │
│  ┌─────────────────────────────────────────┐                                │
│  │  Invoice Data ──► Client-Side Encrypt │                                │
│  │  Key: Generated per invoice            │                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  3. COMMIT TO CHAIN                                                         │
│  ┌─────────────────────────────────────────┐                                │
│  │  Hash(Encrypted Data) ──► Smart Contract│                                │
│  │  Store: hash, amount, deadline, status  │                                │
│  │  On-chain: Public visibility, private data│                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  4. GENERATE SHARE URL                                                      │
│  ┌─────────────────────────────────────────┐                                │
│  │  URL: /pay?id={invoice_id}&key={enc_key} │                               │
│  │  Enc key di-encrypt dengan public key    │                               │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  5. SHARE TO CLIENT                                                         │
│  ┌─────────────────┐                                                        │
│  │  WhatsApp/Email │                                                        │
│  │  or Direct Link│                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Client Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. RECEIVE URL                                                             │
│  ┌─────────────────────────────────────────┐                                │
│  │  /pay?id=0x123...&key=abc...           │                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  2. CONNECT WALLET                                                          │
│  ┌─────────────────────────────────────────┐                                │
│  │  Argent X / Braavos                     │                                │
│  │  Verify: Wallet connected               │                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  3. DECRYPT INVOICE                                                         │
│  ┌─────────────────────────────────────────┐                                │
│  │  URL Key ──► Decrypt Invoice Data       │                                │
│  │  Display: Amount, Description, Due Date │                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  4. VERIFY ON-CHAIN                                                         │
│  ┌─────────────────────────────────────────┐                                │
│  │  - Check invoice exists (by hash)       │                                │
│  │  - Verify amount matches                 │                                │
│  │  - Verify deadline                       │                                │
│  │  No sensitive data exposed!              │                                │
│  └────────┬────────────────────────────────┘                                │
│           ▼                                                                  │
│  5. PAY STRK                                                                │
│  ┌─────────────────────────────────────────┐                                │
│  │  Client signs transaction                │                                │
│  │  STRK transferred to freelancer         │                                │
│  │  Status: PAID                            │                                │
│  └────────┬────────────────────────────────┘                                │
│           │                                                                  │
│           ▼                                                                  │
│  6. SETTLEMENT CONFIRMATION                                                │
│  ┌─────────────────────────────────────────┐                                │
│  │  - Smart Contract updates status        │                                │
│  │  - Freelancer notified                  │                                │
│  │  - Transaction complete                  │                                │
│  └─────────────────┘                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MORITA PROTOCOL ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                          FRONTEND (Next.js)                        │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │  Pages:                                                            │   │
│   │  ├── / (Home)          - Landing page                              │   │
│   │  ├── /create           - Create invoice                            │   │
│   │  ├── /history          - Invoice history                          │   │
│   │  ├── /history/[id]     - Invoice detail                           │   │
│   │  └── /pay               - Payment page                             │   │
│   │                                                                      │   │
│   │  Components:                                                        │   │
│   │  ├── ConnectWallet     - Wallet connection                         │   │
│   │  ├── InvoiceForm       - Create invoice form                      │   │
│   │  ├── InvoiceCard       - Display invoice                           │   │
│   │  └── PaymentFlow       - Payment process                          │   │
│   └───────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     ENCRYPTION LAYER                                │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │  AES-256-GCM (Web Crypto API / crypto-js)                          │   │
│   │                                                                       │   │
│   │  ┌─────────────────┐    ┌─────────────────┐                        │   │
│   │  │ Client-Side    │    │ URL Key Gen     │                        │   │
│   │  │ Encryption     │    │ (Base64)        │                        │   │
│   │  └─────────────────┘    └─────────────────┘                        │   │
│   └───────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    WALLET INTEGRATION                              │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │                                                                       │   │
│   │  ┌─────────────┐           ┌─────────────┐                          │   │
│   │  │  Argent X  │           │   Braavos   │                          │   │
│   │  └──────┬──────┘           └──────┬──────┘                          │   │
│   │         │                         │                                 │   │
│   │         └──────────┬──────────────┘                                 │   │
│   │                    ▼                                                │   │
│   │           starknet-react                                            │   │
│   │           (Provider)                                                │   │
│   └───────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                   SMART CONTRACT (Cairo)                            │   │
│   ├─────────────────────────────────────────────────────────────────────┤   │
│   │                                                                       │   │
│   │  Contract: ZkInvoice                                                │   │
│   │  ├── create_invoice(hash, amount, deadline)                       │   │
│   │  │    → Store commitment hash + metadata                           │   │
│   │  │                                                                  │   │
│   │  ├── get_invoice(id)                                                │   │
│   │  │    → Return: hash, amount, deadline, status, payer              │   │
│   │  │                                                                  │   │
│   │  ├── pay_invoice(id)                                                │   │
│   │  │    → Process payment, update status to PAID                     │   │
│   │  │                                                                  │   │
│   │  └── verify_invoice(hash, amount)                                   │   │
│   │       → Verify without exposing data                               │   │
│   │                                                                       │   │
│   └───────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│                           STARKNET MAINNET                                   │
│                           (Layer 2)                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Komponen Utama

#### Frontend (Next.js 15)

| Komponen                                                                    | Deskripsi                               |
| --------------------------------------------------------------------------- | --------------------------------------- |
| [`pages/index.tsx`](frontend/src/app/page.tsx)                              | Landing page dengan hero, features, CTA |
| [`pages/create/page.tsx`](frontend/src/app/create/page.tsx)                 | Form pembuatan invoice                  |
| [`pages/history/page.tsx`](frontend/src/app/history/page.tsx)               | Riwayat invoice                         |
| [`pages/history/[id]/page.tsx`](frontend/src/app/history/[id]/page.tsx)     | Detail invoice                          |
| [`pages/pay/page.tsx`](frontend/src/app/pay/page.tsx)                       | Halaman pembayaran client               |
| [`components/ConnectWallet.tsx`](frontend/src/components/ConnectWallet.tsx) | Koneksi wallet                          |
| [`modules/create/*`](frontend/src/components/modules/create/)               | Komponen form invoice                   |
| [`modules/pay/*`](frontend/src/components/modules/pay/)                     | Komponen pembayaran                     |

#### Smart Contract (Cairo/Starknet)

```cairo
// Pseudo-code struktur contract
contract ZkInvoice {
    // Struct untuk invoice
    struct Invoice {
        hash: felt252,      // Hash dari data terenkripsi
        amount: u256,        // Jumlah payment (STRK)
        deadline: u64,       // Batas waktu payment
        status: InvoiceStatus, // PENDING, PAID, EXPIRED
        payer: ContractAddress, // Siapa yang membayar
        created_at: u64     // Timestamp pembuatan
    }

    // Mapping invoice
    invoices: Map<u256, Invoice>
    invoice_hashes: Map<felt252, bool>

    // Fungsi utama
    fn create_invoice(hash: felt252, amount: u256, deadline: u64) -> u256
    fn get_invoice(id: u256) -> Invoice
    fn pay_invoice(id: u256) -> ()
    fn verify_invoice(hash: felt252, amount: u256) -> bool
}
```

#### Encryption Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION PROCESS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT: Plaintext Invoice Data                                  │
│  {                                                              │
│    "clientName": "PT ABC",                                      │
│    "description": "Web Development Services",                 │
│    "amount": "5000000000000000000",  // 5 STRK in wei          │
│    "dueDate": "2024-12-31",                                    │
│    "items": [...]                                               │
│  }                                                              │
│                                                                  │
│  PROCESS:                                                       │
│  1. Generate random 256-bit key                                │
│  2. Generate random 96-bit IV (Initialization Vector)          │
│  3. Encrypt plaintext with AES-256-GCM                         │
│  4. Output: (ciphertext + auth_tag + iv)                        │
│                                                                  │
│  OUTPUT: Encrypted Data                                         │
│  {                                                              │
│    "encrypted": "a8f3d7c9...",                                  │
│    "iv": "b2e4f6a8c9...",                                       │
│    "tag": "d4e6f8a0b2..."                                        │
│  }                                                              │
│                                                                  │
│  URL GENERATION:                                                │
│  /pay?id={invoice_id}&key={base64(key)}                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Wallet Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                   WALLET INTEGRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐                                           │
│  │  starknet-react │                                           │
│  │  (Official SDK) │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
│     ┌─────┴─────┐                                                │
│     │           │                                                │
│     ▼           ▼                                                │
│  ┌──────┐   ┌────────┐                                          │
│  │Argent│   │Braavos │                                          │
│  │  X   │   │ Wallet │                                          │
│  └──────┘   └────────┘                                          │
│                                                                  │
│  Features:                                                      │
│  • Connect/Disconnect                                           │
│  • Get Account Address                                          │
│  • Sign Transactions                                            │
│  • Event Listeners                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Stack

### Tech Stack Summary

| Layer                  | Technology                 | Version |
| ---------------------- | -------------------------- | ------- |
| **Frontend Framework** | Next.js                    | 15.x    |
| **Language**           | TypeScript                 | 5.x     |
| **Styling**            | Tailwind CSS               | 3.x     |
| **Blockchain**         | Starknet                   | Layer 2 |
| **Smart Contract**     | Cairo                      | 2.x     |
| **Encryption**         | Web Crypto API / crypto-js | -       |
| **Wallet SDK**         | starknet-react             | 3.x     |
| **Supported Wallets**  | Argent X, Braavos          | Latest  |

### Dependencies Utama

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "starknet": "^5.0.0",
    "starknet-react": "^3.0.0",
    "crypto-js": "^4.2.0"
  }
}
```

---

## 5. Data Flow Diagram

### Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │  FREELANCER │     │   ENCRYPTION  │     │    CHAIN     │                │
│  │   CLIENT    │     │    LAYER      │     │   COMMIT     │                │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘                │
│         │                   │                    │                         │
│         │  1. Input Data    │                    │                         │
│         │  ──────────────► │                    │                         │
│         │                  │                    │                         │
│         │  2. Generate Key │                    │                         │
│         │  ──────────────► │                    │                         │
│         │                  │                    │                         │
│         │  3. Encrypt      │                    │                         │
│         │  ──────────────► │                    │                         │
│         │                  │                    │                         │
│         │                  │  4. Hash           │                         │
│         │                  │  ─────────────────► │                         │
│         │                  │                    │                         │
│         │                  │                    │  5. Store Commitment   │
│         │                  │                    │  ─────────────────────►│
│         │                  │                    │                         │
│         │                  │                    │  6. Return Invoice ID  │
│         │                  │                    │  ◄──────────────────── │
│         │                  │                    │                         │
│         │  7. Generate URL │                    │                         │
│         │  ◄───────────── │                    │                         │
│         │                  │                    │                         │
│         │  8. Share URL    │                    │                         │
│         │  ───────────────┼────────────────────►│                         │
│         │                 (to Client)            │                         │
│         │                  │                    │                         │
│         ▼                  ▼                    ▼                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT SIDE                                  │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│         │                  │                    │                         │
│         │  1. Open URL     │                    │                         │
│         │  ──────────────► │                    │                         │
│         │                  │                    │                         │
│         │  2. Decrypt Key  │                    │                         │
│         │  ──────────────► │                    │                         │
│         │                  │                    │                         │
│         │  3. Get Invoice  │                    │                         │
│         │  ─────────────────┼───────────────────►│                         │
│         │                  │                    │                         │
│         │                  │  4. Fetch Data     │                         │
│         │                  │  ◄───────────────── │                         │
│         │                  │                    │                         │
│         │  5. Decrypt &    │                    │                         │
│         │     Display      │                    │                         │
│         │  ◄───────────── │                    │                         │
│         │                  │                    │                         │
│         │  6. Verify       │                    │                         │
│         │     On-Chain     │                    │                         │
│         │  ────────────────────────────────────►│                         │
│         │                  │                    │                         │
│         │                  │  7. Sign & Pay     │                         │
│         │                  │  ─────────────────►│                         │
│         │                  │                    │                         │
│         │                  │  8. Update Status  │                         │
│         │                  │  ◄─────────────────│                         │
│         │                  │                    │                         │
│         │  9. Show Receipt │                    │                         │
│         │  ◄───────────────│                    │                         │
│         │                  │                    │                         │
│         └──────────────────┴────────────────────┘                         │
│                              END                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DETAILED DATA FLOW STEPS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1: Invoice Creation (Freelancer)                                     │
│  ───────────────────────────────────────                                    │
│  Freelancer fills form → Plaintext data collected                          │
│  { clientName, description, amount, dueDate, items }                      │
│                                                                              │
│  STEP 2: Key Generation                                                      │
│  ────────────────────────────                                               │
│  Generate random 256-bit AES key                                           │
│  key = crypto.getRandomValues(new Uint8Array(32))                         │
│                                                                              │
│  STEP 3: Client-Side Encryption                                             │
│  ─────────────────────────────────                                          │
│  plaintext + key + iv → AES-256-GCM → encrypted_data + auth_tag           │
│                                                                              │
│  STEP 4: Hash Commitment                                                    │
│  ────────────────────────────                                               │
│  hash = keccak256(encrypted_data)                                           │
│  Only hash stored on-chain (not plaintext!)                               │
│                                                                              │
│  STEP 5: On-Chain Commitment                                                │
│  ─────────────────────────────────                                          │
│  Call contract.createInvoice(                                              │
│    hash: felt252,       // Commitment hash                                 │
│    amount: u256,        // Public amount                                    │
│    deadline: u64        // Public deadline                                  │
│  )                                                                          │
│                                                                              │
│  STEP 6: URL Generation                                                     │
│  ────────────────────────────                                               │
│  shareUrl = `${domain}/pay?id=${invoiceId}&key=${base64(key)}`             │
│                                                                              │
│  STEP 7: Client Receives URL                                                │
│  ─────────────────────────────────                                          │
│  Client opens URL, extracts key from URL params                            │
│                                                                              │
│  STEP 8: Decryption & Display                                              │
│  ───────────────────────────────────────                                    │
│  key from URL + encrypted_data → AES-256-GCM decrypt → plaintext         │
│  Display invoice details to client                                          │
│                                                                              │
│  STEP 9: On-Chain Verification                                              │
│  ───────────────────────────────────────                                    │
│  Call contract.verifyInvoice(hash, amount)                                 │
│  Returns: bool (valid or not)                                               │
│  NOTE: Verification works WITHOUT exposing data!                           │
│                                                                              │
│  STEP 10: Payment                                                           │
│  ─────────────────                                                          │
│  Client approves transaction → STRK transferred                            │
│  contract.payInvoice(id) called                                             │
│                                                                              │
│  STEP 11: Status Update                                                     │
│  ─────────────────────────                                                  │
│  Contract updates status: PENDING → PAID                                    │
│  Freelancer can check status on /history page                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Security Model

### Kenapa Encryption Dilakukan Client-Side?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLIENT-SIDE ENCRYPTION RATIONALE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RISK: Server-Side Encryption                                       │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  • Server has access to plaintext                                   │   │
│  │  • If server compromised → all data exposed                        │   │
│  │  • Single point of failure                                          │   │
│  │  • Requires trust in server operator                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SOLUTION: Client-Side Encryption                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  • Server NEVER sees plaintext                                     │   │
│  │  • Encryption happens in browser before send                       │   │
│  │  • Key passed via URL (not stored on server)                        │   │
│  │  • Even if server compromised → no data exposure                  │   │
│  │  • Zero-trust architecture                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ENCRYPTION FLOW:                                                           │
│                                                                              │
│  ┌─────────┐    AES-256-GCM    ┌─────────────┐   keccak256   ┌─────────┐│
│  │Plaintext│ ───────────────► │Encrypted DB │ ───────────► │  Hash   ││
│  │  Data   │                   │   Storage   │               │ (Chain) ││
│  └─────────┘                   └─────────────┘               └─────────┘│
│       │                                                          │        │
│       │ Generate                                                On-chain │        │
│       │ Key                                                         │        │
│       ▼                                                            ▼        │
│  ┌─────────────────────────────────────────────────────────────┐          │
│  │  URL: /pay?id=...&key=Base64(key)  ← Key ada di URL!        │          │
│  └─────────────────────────────────────────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bagaimana Hash Commitment Menjaga Privacy?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     HASH COMMITMENT SECURITY                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONCEPT:                                                                   │
│  Hash commitment adalah teknik cryptografi yang memungkinkan               │
│  seseorang "mengunci" nilai tanpa mengungkapkannya.                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  COMMITMENT SCHEME                                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                       │   │
│  │  1. COMMIT PHASE ( saat create invoice )                            │   │
│  │     ┌──────────────┐                                                │   │
│  │     │ Plaintext    │                                                │   │
│  │     │ Invoice Data │                                                │   │
│  │     └──────┬───────┘                                                │   │
│  │            │                                                         │   │
│  │            ▼                                                         │   │
│  │     ┌──────────────┐                                                │   │
│  │     │ Hash (SHA256/│                                                │   │
│  │     │ Keccak256)   │                                                │   │
│  │     └──────┬───────┘                                                │   │
│  │            │                                                         │   │
│  │            ▼                                                         │   │
│  │     ┌──────────────┐    STORE ON-CHAIN                              │   │
│  │     │ commitment   │ ◄──────────────────────                        │   │
│  │     │ hash         │                                                │   │
│  │     └──────────────┘                                                │   │
│  │                                                                       │   │
│  │  2. REVEAL PHASE ( saat verify )                                    │   │
│  │     ┌──────────────┐                                                │   │
│  │     │ Client has   │                                                │   │
│  │     │ plaintext    │                                                │   │
│  │     └──────┬───────┘                                                │   │
│  │            │                                                         │   │
│  │            ▼                                                         │   │
│  │     ┌──────────────┐    COMPUTE HASH                                │   │
│  │     │ Hash(input) │ ────┐                                           │   │
│  │     └──────────────┘    │                                           │   │
│  │                         ▼                                           │   │
│  │                   ┌──────────────┐  COMPARE                          │   │
│  │     ┌────────────┤ commitment   │ ◄───┐                             │   │
│  │     │ (from URL)│   hash       │    │                             │   │
│  │     └────────────┴──────────────┘    │                             │   │
│  │                                      │                             │   │
│  │                    VERIFY: hash(input) == stored_hash               │   │
│  │                                      │                             │   │
│  │                              MATCH! ───┘                             │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  PRIVACY BENEFITS:                                                          │
│  • Hash tidak dapat di-reverse untuk mendapatkan plaintext                │
│  • Data sensitif TIDAK pernah menyentuh blockchain                         │
│  • Siapa pun bisa verify bahwa invoice valid tanpa tahu detailnya          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Verification Flow Tanpa Expose Data

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ZERO-KNOWLEDGE VERIFICATION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GOAL: Client ingin membayar invoice freelancer, tapi perlu               │
│        verifikasi bahwa invoice itu valid (exists, amount correct)        │
│        tanpa freelancer harus menunjukkan data sensitif.                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SCENARIO: Freelancer Invoice                                       │   │
│  │                                                                       │   │
│  │  On-Chain:                                                           │   │
│  │  - Invoice ID: 1                                                     │   │
│  │  - Hash: 0xabc123... (commitment)                                   │   │
│  │  - Amount: 5 STRK                                                    │   │
│  │  - Status: PENDING                                                   │   │
│  │                                                                       │   │
│  │  Off-Chain (Freelancer punya):                                       │   │
│  │  - Full Invoice Data: "Pembuatan website PT ABC"                   │   │
│  │  - Encryption Key: random_key                                        │   │
│  │                                                                       │   │
│  │  URL yang dikirim ke client:                                         │   │
│  │  /pay?id=1&key=random_key                                           │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  VERIFICATION PROCESS:                                                      │
│                                                                              │
│  1. CLIENT opens URL dengan key dari freelancer                            │
│                                                                              │
│  2. CLIENT calls smart contract:                                          │
│     get_invoice(1) → returns hash, amount, status                          │
│     Amount: 5 STRK (PUBLIC!)                                               │
│                                                                              │
│  3. CLIENT decrypts URL param dengan key:                                  │
│     encrypted_data → decrypt → plaintext                                  │
│     Revealed: "Pembuatan website PT ABC", Amount: 5 STRK                  │
│                                                                              │
│  4. CLIENT computes hash:                                                 │
│     hash_computed = keccak256("Pembuatan website PT ABC" + 5 STRK)       │
│                                                                              │
│  5. CLIENT verifies:                                                        │
│     hash_computed == on_chain_hash                                         │
│                                                                              │
│  6. IF match → Invoice valid! Client can proceed to pay                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  WHAT'S EXPOSED:                                                    │   │
│  │  • Invoice ID                                                       │   │
│  │  • Amount (5 STRK) - this is intentional, payment is public       │   │
│  │  • Status (PENDING)                                                │   │
│  │                                                                       │   │
│  │  WHAT'S NOT EXPOSED:                                                │   │
│  │  • Client name (PT ABC) - hanya freelancer & client tahu          │   │
│  │  • Description ("Pembuatan website") - hanya freelancer & client │   │
│  │  • Any other sensitive details - hanya di URL, tidak di chain     │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SECURITY GUARANTEE:                                                        │
│  ─────────────────────                                                      │
│  • Freelancer tidak bisa memalsukan amount (hash verification fails)      │
│  • Client tidak perlu percaya freelancer, verification cryptographic    │
│  • Siapa pun bisa verify di blockchain bahwa invoice exists               │
│  • Detail sensitif tetap privat antara freelancer & client               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

Morita Protocol adalah protokol invoice yang menggabungkan:

1. **Blockchain Starknet** untuk trustless settlement
2. **Client-side AES-256-GCM encryption** untuk privacy
3. **Hash commitment** untuk zero-knowledge verification
4. **Wallet integration** (Argent X, Braavos) untuk aksesibilitas

Arsitektur ini memastikan bahwa:

- Data sensitif tidak pernah触碰 blockchain
- Verifikasi dapat dilakukan tanpa mengekspos data
- Transaksi pembayaran terjadi secara on-chain dengan transparency
- Freelancer dan client memiliki kontrol penuh atas data mereka

---

_Document Version: 1.0_  
_Last Updated: March 2026_  
_Project: Morita Protocol - ZkInvoice_
