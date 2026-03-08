# Technical Product Requirements Document (PRD): ZkInvoice MVP

## Target: Re{define} Hackathon (Starknet) - Privacy Track

## Development Timeframe: 9 Days

### 1. Project Overview

ZkInvoice is a privacy-preserving B2B invoicing dApp built on Starknet. It solves the problem of public financial data exposure in Web3 payments.
Core Innovation: It uses a "Commit-Reveal" mechanism on-chain combined with AES-256 End-to-End Encryption (E2EE) via URL fragments off-chain. The smart contract acts as a trustless settlement engine without ever storing plaintext invoice data.

### 2. Tech Stack

- Smart Contract: Cairo (Starknet Foundry)
- Frontend: Next.js (App Router), React, TailwindCSS, TypeScript
- Web3 Integration: Starknet.js, Starknet-React (ArgentX/Braavos)
- Cryptography (Frontend): `crypto-js` (for AES encryption) & `starknet.js` (for Poseidon hashing)

### 3. Cryptographic & Application Flow (The "Method 3" Magic)

#### A. Creation Flow (Freelancer)

1. Freelancer fills out the UI form: `client_name`, `description`, `amount` (in STRK), `freelancer_wallet_address`.
2. Frontend generates a secure random 256-bit string: `encryption_key`.
3. Frontend generates a random number: `secret_salt`.
4. Frontend computes the on-chain hash:
   `invoice_hash = Poseidon(amount, freelancer_wallet_address, secret_salt)`
5. Frontend packages the full data into a JSON object and encrypts it using AES:
   `encrypted_payload = AES.encrypt(JSON.stringify({client_name, description, amount, freelancer_wallet_address, secret_salt, invoice_hash}), encryption_key)`
6. Freelancer connects wallet and calls `create_invoice(invoice_hash)` on the Starknet contract.
7. Frontend generates the payment URL:
   `https://zkinvoice.app/pay?payload=[encrypted_payload_base64]#[encryption_key]`
   _Security Note: The part after `#` (the key) is NEVER sent to any server. It stays local in the browser._

#### B. Payment & Decryption Flow (Client)

1. Client opens the URL. The Next.js app extracts the `payload` from the query string and the `encryption_key` from the URL fragment (`window.location.hash`).
2. Frontend decrypts the `payload` locally.
3. Frontend queries the Starknet contract: `get_invoice_status(invoice_hash)`.
   - If status == PAID: Show "Link Expired / Invoice Already Paid" screen. (DO NOT show invoice details to protect privacy post-payment).
   - If status == UNPAID: Display the beautiful invoice UI (Amount, Description, etc.).
4. Client connects wallet and clicks "Pay".
5. Frontend calls `pay_invoice(invoice_hash, amount, freelancer_wallet_address, secret_salt)` on the smart contract.
6. The smart contract verifies the data, transfers the ERC20 tokens, and marks the hash as PAID.

### 4. Smart Contract Specification (Cairo)

Contract Name: `ZkInvoiceSettlement.cairo`

**State Variables:**

- `invoice_status`: Mapping `LegacyMap<felt252, bool>` (Maps `invoice_hash` to `is_paid` status).
- `strk_token_address`: ContractAddress (Address of the STRK ERC20 token).

**Functions:**

1. `create_invoice(ref self: ContractState, invoice_hash: felt252)`
   - Asserts `invoice_status.read(invoice_hash)` is false.
   - Sets `invoice_status.write(invoice_hash, false)`. (Registers the hash).
   - Emits `InvoiceCommitted` event.
2. `pay_invoice(ref self: ContractState, amount: u256, payee: ContractAddress, secret_salt: felt252)`
   - Computes `computed_hash = poseidon_hash(amount, payee, secret_salt)`.
   - Asserts `invoice_status.read(computed_hash)` exists and is `false`.
   - Calls `IERC20Dispatcher.transferFrom(strk_token_address, caller, payee, amount)`.
   - Sets `invoice_status.write(computed_hash, true)`.
   - Emits `InvoiceSettled` event.
3. `get_invoice_status(self: @ContractState, invoice_hash: felt252) -> bool`
   - Returns the `is_paid` status.

### 5. Frontend Pages & Components

1. **Landing Page (`/`)**: Hero section explaining the privacy value prop. Button: "Create Secret Invoice".
2. **Create Invoice Page (`/create`)**:
   - Form inputs (Amount, Description, Client Name, Payee Address).
   - "Connect Wallet" button.
   - "Sign & Generate Link" button.
   - Modal/Component to display the generated URL with a "Copy to Clipboard" button.
3. **Payment View Page (`/pay`)**:
   - Reads URL parameters and fragment.
   - Decryption logic handler.
   - Conditional rendering: If paid -> Expired State. If unpaid -> Invoice View.
   - "Pay with STRK" button executing the contract call.

### 6. Hackathon Prompt for LLM:

Please act as my senior Web3 developer pair-programmer. Let's start by writing the complete `ZkInvoiceSettlement.cairo` contract based on this PRD. Ensure it compiles with the latest Starknet Foundry and follows Cairo best practices for security and gas optimization.
