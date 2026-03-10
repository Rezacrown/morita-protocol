# Step-by-Step Deployment ke Devnet

Dokumen ini berisi langkah-langkah detail untuk men-deploy Verifier dan MoritaInvoice contract ke Starknet Devnet lokal.

---

## Prasyarat

Pastikan tools sudah terinstall:

```bash
# Install dependencies (sekali saja)
make install-noir
make install-barretenberg
make install-starknet
make install-devnet
make install-garaga
```

---

## Step 1: Start Devnet

Buka terminal baru dan jalankan:

```bash
cd smart-contract
make devnet
```

Output contoh:

```
Starting server with funds generation on addresses:
0x... (devnet0)
0x... (devnet1)
Server started on http://localhost:5050
```

Biarkan devnet berjalan di terminal ini.

---

## Step 2: Fetch Accounts

Buka terminal baru (terminal 2) dan jalankan:

```bash
cd smart-contract
make accounts-file
```

Ini akan membuat file `contracts/accounts.json` dengan account devnet0.

Cek file untuk melihat alamat:

```bash
cat contracts/accounts.json | jq '.["alpha-sepolia"].devnet0.address'
```

Output contoh:

```
"0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6"
```

---

## Step 3: Build Circuit & Generate Verifier

Di terminal 2, jalankan:

```bash
cd smart-contract
make build-circuit
make gen-vk
make gen-verifier
```

Ini akan:

1. Build circuit → `circuit/target/invoice_commitment.json`
2. Generate VK → `circuit/target/vk`
3. Generate verifier contract → `contracts/verifier/src/`

---

## Step 4: Build Contracts

Build kedua contract:

```bash
make build-verifier
make build-morita
```

---

## Step 5: Declare Verifier Contract

Declare verifier ke devnet:

```bash
cd smart-contract/contracts
sncast declare --contract-name UltraStarknetHonkVerifier --package verifier
```

Simpan **class hash** dari output, contoh:

```
Class hash: 0x4c818bf6d0d3447eecd24943d2ed8815d971e4a4b30268d6bcfd7abfd5be067
```

---

## Step 6: Deploy Verifier Contract

Deploy verifier dengan class hash dari Step 5:

```bash
cd smart-contract/contracts
sncast deploy --salt 0x00 --class-hash 0x4c818bf6d0d3447eecd24943d2ed8815d971e4a4b30268d6bcfd7abfd5be067
```

Simpan **contract address** dari output, contoh:

```
Contract address: 0x1234abcd...5678
```

---

## Step 7: Declare MoritaInvoice Contract

Declare MoritaInvoice ke devnet:

```bash
cd smart-contract/contracts
sncast declare --contract-name MoritaInvoice --package morita_invoice
```

Simpan **class hash** dari output.

---

## Step 8: Deploy MoritaInvoice Contract

Deploy MoritaInvoice dengan:

- `CLASS_HASH`: dari Step 7
- `VERIFIER_ADDR`: dari Step 6

```bash
cd smart-contract/contracts
sncast deploy \
  --salt 0x01 \
  --class-hash 0xYOUR_MORITA_CLASS_HASH \
  --constructor-calldata "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1,0xYOUR_VERIFIER_ADDRESS"
```

Dimana:

- `0xe2eb8f...a34a1d6` = devnet0 address (owner)
- `0xe2eb8f...a34a1d6` = devnet0 address (fee_collector)
- `0x049d36...c9dd7c1` = STRK token address (devnet)
- `0xYOUR_VERIFIER_ADDRESS` = alamat verifier dari Step 6

Simpan **contract address** dari output.

---

## Step 9: Verifikasi Integrasi

Cek bahwa MoritaInvoice sudah terhubung dengan Verifier:

```bash
# Cek verifier_contract address di MoritaInvoice
cd smart-contract/contracts
sncast call --contract-address 0xYOUR_MORITA_ADDRESS --function "verifier_contract"
```

Output harus sama dengan verifier address dari Step 6.

---

## Step 10: Testing

### 10.1 Create Invoice

```bash
cd smart-contract/contracts
sncast invoke \
  --contract-address 0xYOUR_MORITA_ADDRESS \
  --function "create_invoice" \
  --calldata "0x123,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,1000000000000000000,1893456000"
```

Format calldata:
| Parameter | Value | Deskripsi |
|-----------|-------|-----------|
| invoice_hash | 0x123 | Hash invoice |
| payee | 0xe2eb... | Alamat penerima (devnet0) |
| client_wallet | 0xe2eb... | Alamat klien (devnet0) |
| amount | 1000000000000000000 | 1 ETH dalam wei |
| due_date | 1893456000 | Timestamp (2030-01-01) |

### 10.2 Check Invoice Status

```bash
sncast call --contract-address 0xYOUR_MORITA_ADDRESS --function "get_invoice_status" --calldata "0x123"
```

Output harus menunjukkan invoice status (0 = Pending).

### 10.3 Get Invoice Details

```bash
sncast call --contract-address 0xYOUR_MORITA_ADDRESS --function "get_invoice" --calldata "0x123"
```

---

## Quick Reference Commands

```bash
# Terminal 1: Start devnet
make devnet

# Terminal 2: Full deployment
make accounts-file
make build-circuit && make gen-vk && make gen-verifier
make build-verifier && make build-morita

# Declare & Deploy Verifier
cd contracts && sncast declare --contract-name UltraStarknetHonkVerifier --package verifier
# Catat class hash, lalu:
cd contracts && sncast deploy --salt 0x00 --class-hash 0x4c818bf6d0d3447eecd24943d2ed8815d971e4a4b30268d6bcfd7abfd5be067
# Catat verifier address

# Declare & Deploy MoritaInvoice
cd contracts && sncast declare --contract-name MoritaInvoice --package morita_invoice
# Catat class hash, lalu:
cd contracts && sncast deploy --salt 0x01 --class-hash 0xYOUR_MORITA_CLASS_HASH --constructor-calldata "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1,0xYOUR_VERIFIER_ADDRESS"
# Catat morita address

# Verify integration
cd contracts && sncast call --contract-address 0xYOUR_MORITA_ADDRESS --function "verifier_contract"

# Test create invoice
cd contracts && sncast invoke --contract-address 0xYOUR_MORITA_ADDRESS --function "create_invoice" --calldata "0x123,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,1000000000000000000,1893456000"

# Check status
cd contracts && sncast call --contract-address 0xYOUR_MORITA_ADDRESS --function "get_invoice_status" --calldata "0x123"
```

---

## Catatan Penting

1. Setiap step WAJIB menunggu step sebelumnya selesai
2. Simpan class hash dan contract address dari setiap step
3. Jika ada error, cek terminal devnet untuk log
4. Untuk testing ZK proof, perlu generate proof dengan Barretenberg terlebih dahulu

---

## Troubleshooting

| Error                | Solution                                    |
| -------------------- | ------------------------------------------- |
| Connection refused   | Pastikan devnet berjalan di port 5050       |
| Class hash not found | Declare contract terlebih dahulu            |
| Insufficient funds   | Devnet sudah punya funds, cek accounts.json |
| Constructor error    | Cek format calldata dan addresses           |

---

**Last Updated**: 2026-03-10
