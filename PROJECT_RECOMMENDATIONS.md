# Project Morita - Rekomendasi Pengembangan

**Morita** adalah aplikasi _privacy-preserving B2B invoicing dApp_ di blockchain Starknet. Ini adalah frontend prototype untuk hackathon Re{define} yang dibangun dengan Next.js 14+, TypeScript, dan TailwindCSS.

## Fitur Utama yang Sudah Diimplementasi:

1. **Landing Page** - Hero section dengan "Architecture of Privacy" (Encrypt → Commit → Reveal)
2. **Create Invoice** - Form untuk membuat invoice dengan mock encryption
3. **Payment Page** - Halaman pembayaran dengan decrypt payload dari URL
4. **History Page** - Daftar invoice dengan filter (Role, Status) dan search
5. **History Detail** - Detail invoice dengan tombol kontekstual

---

# Daftar Rekomendasi Pengembangan

## 🔴 Prioritas Tinggi (P0 - Critical)

### 1. Integrasi Starknet/Web3

- Implementasi starknet.js untuk koneksi wallet sungguhan
- Ganti mock ConnectWallet.tsx dengan wallet adapter Starknet
- Integrasi dengan browser wallet (Argent X, Braavos)

### 2. Implementasi Smart Contract

- Deploy smart contract Cairo untuk invoice management di Starknet
- Simpan invoice hash ke blockchain (fungsi "Commit" di PRD)
- Implementasi fungsi payment settlement on-chain

### 3. Implementasi Encryption

- Ganti mock encryption dengan crypto-js atau Web Crypto API
- Implementasi AES-256-GCM untuk enkripsi lokal
- Implementasi Keccak256 untuk hashing

---

## 🟡 Prioritas Sedang (P1 - Important)

### 4. State Management

- Tambahkan Zustand atau Context API untuk global state (wallet connection, invoice list)
- Simpan invoice history ke localStorage atau cloud

### 5. Data Fetching

- Ganti mock data dengan API calls ke smart contract
- Implementasi polling untuk update status invoice

### 6. Error Handling

- Tambahkan error boundaries
- Implementasi toast notifications untuk feedback user
- Loading states yang lebih baik

### 7. Validasi Form

- Tambahkan form validation di create/page.tsx
- Validasi input amount (STRK), wallet address format

---

## 🟢 Prioritas Rendah (P2 - Nice to Have)

### 8. UI/UX Improvements

- Tambahkan skeleton loaders
- Animasi transisi antar halaman
- Dark mode support
- Responsive design untuk mobile

### 9. Fitur Tambahan

- Export invoice sebagai PDF
- Email notification ke client
- Multiple currency support
- Invoice template customization

### 10. Testing

- Unit tests untuk komponen
- Integration tests untuk user flows
- E2E tests dengan Playwright

### 11. Dokumentasi

- Update README.md dengan setup instructions
- Tambahkan API documentation
- Write usage guide untuk developer

### 12. Security Audit

- Review kode untuk vulnerability
- Audit smart contract sebelum mainnet deployment

---

## 📊 Perbandingan dengan PRD Awal

| Aspek                  | PRD Awal | Sekarang        | Status     |
| ---------------------- | -------- | --------------- | ---------- |
| Starknet.js            | ✅       | ❌ Mock         | 🔴 Perlu   |
| Encryption (AES-GCM)   | ✅       | ❌ Mock         | 🔴 Perlu   |
| Smart Contract (Cairo) | ✅       | ❌ Not deployed | 🔴 Perlu   |
| History Page           | ❌       | ✅ Ada          | ✅ Selesai |
| Detail History         | ❌       | ✅ Ada          | ✅ Selesai |

---

## 🚀 Rekomendasi Prioritas Selanjutnya

1. **Immediate**: Setup Starknet.js dan implementasikan wallet connection
2. **Week 1**: Implementasikan encryption/decryption logic dan integrate dengan smart contract
3. **Week 2**: Testing dan bug fixing
4. **Week 3**: Deploy ke Starknet testnet dan audit

---

## Catatan

Project ini adalah **frontend prototype yang solid** dengan struktur yang baik, namun membutuhkan integrasi Web3 yang sebenarnya untuk menjadi production-ready dApp.
