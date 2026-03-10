# **Tujuan Utama**

Selesaikan integrasi Frontend dApp "Morita Protocol" (ZK-Invoice di Starknet) menggunakan Next.js, Starknet-React, dan Noir ZK.

# **Konteks Aplikasi**

Aplikasi ini memungkinkan User membuat invoice rahasia (enkripsi AES lokal \+ hashing Pedersen) dan Client membayarnya menggunakan ZK-Proof untuk memverifikasi validitas data tanpa mengungkap isinya secara publik di blockchain.

# **Tech Stack & Kontrak**

1. Framework: Next.js (App Router), Tailwind CSS.
2. Blockchain: Starknet-React, Starknet.js.
3. ZK: Noir (@noir-lang/noir_js), Barretenberg (@noir-lang/backend_barretenberg).
4. Security: CryptoJS (AES-256).
5. MoritaInvoice Contract (Sepolia): 0x031d5920e2af25bb90a259c0fe44e53f89d08428bbed8e4fcea24f6b117765c5.
6. STRK Token (Sepolia): 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.

# **Tugas 1: Implementasi Helper ZK (frontend/src/lib/zk.ts)**

Buat fungsi helper berikut:

1. generateInvoiceHash: Mengambil input (clientName, description, amount, payee, client, timestamp). Melakukan hashing menggunakan standar Pedersen Starknet (felt252).
2. generateAmountCommitment: Melakukan hashing Pedersen pada (amount, first_byte_of_key) sesuai aturan sirkuit Noir main.nr.
3. generateZKProof: Fungsi async untuk memuat circuit.json dan vk.bin dari folder public, lalu menggunakan Noir JS untuk men-generate proof berdasarkan private inputs (amount, key) dan public inputs.

# **Tugas 2: Implementasi Halaman Create (/create)**

Logika yang harus ditambahkan:

1. Saat form disubmit:
   - Generate random 32-byte hex string sebagai encryptionKey.
   - Enkripsi clientName dan description menggunakan CryptoJS AES dengan key tersebut.
   - Panggil helper ZK untuk mendapatkan invoiceHash dan amountCommitment.
2. Panggil fungsi create_invoice pada smart contract dengan parameter:
   - invoice_hash, amount_commitment, payee, client_wallet, amount (u256), due_date, encrypted_payload (ByteArray).
3. Setelah sukses, tampilkan link: baseUrl/pay?id={invoiceHash}\#key={encryptionKeyHex}.

# **Tugas 3: Implementasi Halaman Pay (/pay)**

Logika yang harus ditambahkan:

1. Baca id (invoiceHash) dari query param dan key dari URL fragment (\#).
2. Panggil fungsi read get_invoice di smart contract.
3. Validasi: Jika connected_wallet bukan Payee atau Client, sembunyikan detail.
4. Dekripsi encrypted_payload dari event/contract menggunakan key dari URL.
5. Saat klik "Pay":
   - Generate ZK Proof secara background menggunakan helper generateZKProof.
   - Panggil fungsi pay_invoice di smart contract membawa array payment_proof.

# **Tugas 4: Implementasi History (/history)**

1. Gunakan Starknet RPC atau Indexer untuk menarik event InvoiceCreated dan InvoicePaid.
2. Filter event berdasarkan connected_address (sebagai payee atau client).
3. Tampilkan list invoice. Jika user punya key-nya di local storage (opsional) atau URL, tampilkan detail terdekripsi.

# **Instruksi Khusus**

- Gunakan byteArray.byteArrayFromString dari Starknet.js untuk parameter encrypted_payload.
- Pastikan urutan public inputs pada proof generator sama dengan sirkuit Noir: \[payee, client, timestamp, hash, commitment\].
- Berikan penanganan error yang user-friendly (jangan pakai alert, gunakan UI state).
