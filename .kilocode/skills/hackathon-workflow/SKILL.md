---
name: hackathon-workflow
description: Panduan end-to-end untuk hackathon dari ideation hingga pitching. Gunakan skill ini ketika user ingin berpartisipasi dalam hackathon blockchain/Web3 atau membutuhkan panduan lengkap workflow hackathon.
---

# Hackathon Workflow Skill

Skill ini digunakan untuk membantu user menyelesaikan proyek hackathon Web3 dari awal hingga akhir. Gunakan skill ini ketika:

1. **Mengikuti hackathon Web3** - ETHGlobal (EthCC, ETHOnline, ETHDenver), Protocol Labs (Filecoin, IPFS), MetaBuild, DoraHacks, dan hackathon Web3 lainnya
2. **Membangun proyek blockchain** - Dengan timeline terbatas dan membutuhkan workflow yang terstruktur
3. **Membutuhkan panduan lengkap** - Dari ide hingga pitch dalam format yang siap digunakan

Skill ini membagi workflow hackathon menjadi **5 fase** yang saling terhubung, dengan mandatory questions di setiap fase untuk memastikan progress yang tepat.

---

## Five Phases

### Phase 1: Ideation (0-4 jam pertama)

**Tujuan:** Validasi ide sebelum development dimulai

Fase ini sangat krusial karena ide yang baik adalah fondasi proyek yang sukses. Ajak user untuk brainstorming dengan pertanyaan-pertanyaan fundamental yang akan membantu mengkristalkan konsep proyek.

**Mandatory Questions untuk Phase 1:**

- "Apa masalah yang ingin kamu selesaikan?"
- "Siapa target user dari solusi ini?"
- "Apa yang membuat solusi ini berbeda dari yang sudah ada di рынке?"
- "Apakah ada teknologi blockchain spesifik yang ingin digunakan?"
- "Apa unique value proposition dari proyek ini?"

**Checklist Ideation:**

- [ ] Problem statement jelas dan terukur
- [ ] Target audience terdefinisi dengan spesifik
- [ ] Solution concept sudah divalidasi
- [ ] Market research sudah dilakukan
- [ ] Feasibility check passed - teknis dan komersial

**Framework yang Bisa Digunakan:**

1. **How Might We (HMW)** - Ubah masalah menjadi pertanyaan desain
2. **Jobs-to-be-Done (JTBD)** - Pahami motivasi user di balik penggunaan produk
3. **Lean Canvas** - Validasi asumsi bisnis dengan cepat
4. **Competitive Analysis** - Pahami posisi kompetitor

**Tips untuk Phase 1:**

- Validasi ide dengan peer review secepat mungkin
- Batasi brainstorming maksimal 2 jam untuk ide awal
- Pilih 1-2 ide terkuat untuk dikembangkan lebih lanjut
- Jangan terjebak dalam "analysis paralysis" - move fast!

---

### Phase 2: Planning (4-8 jam)

**Tujuan:** Arsitektur dan roadmap development yang jelas

Setelah ide divalidasi, langkah selanjutnya adalah membuat rencana development yang realistis. Fase ini menentukan keberhasilan eksekusi karena Tech Stack yang tepat akan sangat mempengaruhi development speed.

**Mandatory Questions untuk Phase 2:**

1. **Tech Stack:**
   - Blockchain mana yang akan digunakan? (Ethereum, Polygon, Arbitrum, Optimism, Base, Solana, dll)
   - Smart contract language? (Solidity, Rust, Move, Cairo)
   - Frontend framework? (Next.js + Wagmi, React + Viem, Vue + RainbowKit)
   - Apakah butuh backend service?

2. **Architecture:**
   - On-chain atau off-chain? Bagaimana split-nya?
   - Centralized atau decentralized backend?
   - Data storage? (IPFS, Arweave, Ceramic, local storage)

3. **MVP Scope:**
   - Fitur minimum apa saja yang harus ada?
   - Fitur nice-to-have mana yang bisa ditambahkan?
   - Fitur mana yang di-cut jika waktu tidak cukup?

**Tech Stack Recommendations:**

| Komponen       | Default         | Alternatives                      |
| -------------- | --------------- | --------------------------------- |
| Blockchain     | Ethereum        | Polygon, Arbitrum, Optimism, Base |
| Smart Contract | Solidity        | Rust (Solana), Move (Aptos/Sui)   |
| Frontend       | Next.js + Wagmi | React + Viem, Vue + RainbowKit    |
| Backend        | Hono.js         | Express, Fastify, Node.js         |
| Database       | PostgreSQL      | SQLite, Turso, Supabase           |
| Storage        | IPFS            | Arweave, Pinata, Ceramic          |
| Wallet         | RainbowKit      | Web3Modal, WalletConnect          |

**Output dari Phase 2:**

- Arsitektur sistem terdokumentasi
- MVP features terdefinisi dengan priority
- Timeline development dengan milestone
- Daftar dependencies dan tools yang dibutuhkan
- Emergency fallback plan jika ada blocker

---

### Phase 3: Development (8-36 jam)

**Tujuan:** Build MVP yang working dan demo-able

Ini adalah fase paling intensif di mana sebagian besar waktu dihabiskan untuk coding. Fokus pada build core feature yang bisa didemonstrasikan kepada judges.

**Prioritas Development:**

1. **Core Feature (Priority 1)** - Fitur utama yang membuat proyek unik dan bisa di-demo
2. **Integration (Priority 2)** - Connect frontend dengan smart contract
3. **UI/UX (Priority 3)** - Interface yang usable dan menarik
4. **Documentation (Priority 4)** - README, deployment info, comments

**Mandatory Questions untuk Phase 3:**

- "Progress sekarang sampai mana?"
- "Ada blocker atau issue yang perlu diatasi?"
- "Bagaimana status deployment contracts?"
- "Demo sudah bisa dijalankan?"
- "Apakah ada fitur yang perlu di-cut karena waktu?"

**Best Practices selama Development:**

- **Commit early, commit often** - Gunakan version control dengan commit message yang jelas
- **Always have working demo** - Jangan sampai ada momen di mana demo tidak bisa jalan
- **Document as you build** - Tulis comments dan README bersamaan dengan coding
- **Prepare fallback plans** - Jika ada teknologi yang tidak bisa diimplementasikan, punya plan B
- **Test continuously** - Jangan tunggu akhir untuk testing

**Development Workflow yang Disarankan:**

1. Setup project structure (1-2 jam)
2. Develop smart contracts core (4-8 jam)
3. Deploy contracts ke testnet (1-2 jam)
4. Build frontend integration (4-8 jam)
5. Connect frontend dengan contracts (2-4 jam)
6. Basic testing dan bug fixes (2-4 jam)
7. Demo flow testing (1-2 jam)

**Integrasi dengan Skill Lain:**

Gunakan skill berikut untuk development:

- **[smart-contract-evm](../smart-contract-evm/SKILL.md)** - Untuk smart contract development EVM
- **[web3-wagmi-builder](../web3-wagmi-builder/SKILL.md)** - Untuk frontend Web3 integration
- **[backend-honojs](../backend-honojs/SKILL.md)** - Untuk backend API jika diperlukan
- **[design-builder](../design-builder/SKILL.md)** - Untuk UI/UX design yang menarik

---

### Phase 4: Polish (36-44 jam)

**Tujuan:** Perbaiki bug, tingkatkan kualitas, dan persiapkan demo

Fase ini adalah "last mile" sebelum pitch. Fokus pada membuat aplikasi menjadi production-ready dalam skala hackathon.

**Mandatory Questions untuk Phase 4:**

- "Bug apa saja yang masih ada?"
- "Fitur polish apa yang perlu ditambahkan?"
- "Demo sudah smooth?"
- "Graceful error handling sudah?"
- "UI/UX sudah memadai untuk presentasi?"

**Checklist Polish:**

- [ ] Critical bug fixes sudah done
- [ ] UI improvements sudah applied (typography, spacing, colors)
- [ ] Demo flow sudah tested multiple times
- [ ] Edge cases sudah handled dengan baik
- [ ] Error messages sudah clear dan helpful
- [ ] Loading states dan transitions sudah smooth
- [ ] Mobile responsive jika diperlukan
- [ ] Performance sudah optimal (loading time < 3 detik)

**Polish Checklist untuk Web3 Projects:**

- [ ] Wallet connection flow sudah smooth
- [ ] Transaction signing sudah berjalan dengan benar
- [ ] Network switching sudah handled
- [ ] Gas estimation sudah accurate
- [ ] Transaction receipts sudah displayed dengan benar
- [ ] Contract events sudah subscribed dengan baik

**Tips untuk Phase 4:**

- Prioritaskan bug yang会影响 demo
- Jangan add fitur baru - justru risiko引入 bugs
- Test demo di environment yang berbeda
- Prepare screenshot/video backup jika demo gagal
- Rest yang cukup - don't burn out!

---

### Phase 5: Pitch (44-48 jam)

**Tujuan:** Siapkan pitch yang compelling dan demo yang impressive

Ini adalah momen kebenaran - semua kerja keras di 4 fase sebelumnya akan dinilai oleh judges. Persiapkan pitch deck yang menarik dan demo yang smooth.

**Mandatory Questions untuk Phase 5:**

- "Pitch deck sudah dibuat?"
- "Demo script sudah diuji?"
- "Berapa lama waktu demo yang diberikan?"
- "Siapa yang akan present di depan judges?"
- "Q&A preparation sudah sejauh mana?"

**Mandatory Deliverables:**

1. **Pitch Deck** - Slide presentasi (10-12 slides)
2. **Demo Script** - Urutan fitur yang akan ditunjukkan dengan timing
3. **Q&A Prep** - Antisipasi pertanyaan dari judges

**Pitch Deck Structure yang Disarankan:**

1. **Title Slide** - Nama proyek, tagline, team name
2. **Problem Statement** - Masalah yang diselesaikan dengan data
3. **Solution** - Bagaimana solusi Web3 menjawab masalah
4. **Market Opportunity** - Target market size dan growth
5. **Product Demo** - Screenshots atau live demo
6. **Technology** - Tech stack dan innovation
7. **Business Model** - Bagaimana monetisasi/ sustaining
8. **Competition** - competitive advantage
9. **Traction** - Jika ada (users, partnerships, metrics)
10. **Team** - Skills dan background
11. **Ask** - Funding yang dibutuhkan (jika ada)
12. **Closing** - Call to action, contact info

**Demo Script Elements:**

- Opening hook (30 detik)
- Problem demonstration (1 menit)
- Solution walkthrough (2-3 menit)
- Live transaction demo (2-3 menit)
- Closing value proposition (30 detik)
- Buffer untuk Q&A (sisa waktu)

**Q&A Preparation - Pertanyaan Umum Judges:**

- "Apa yang membuat solusi ini berbeda dari yang sudah ada?"
- "Bagaimana scalability proyek ini?"
- "Apa business model-nya?"
- "Bagaimana handling security concerns?"
- "Apa rencana setelah hackathon?"
- "Berapa biaya gas untuk user?"
- "Bagaimana mengatasi volatility crypto?"

---

## Integrations

Skill ini terintegrasi dengan skill lain di proyek untuk memberikan panduan development yang komprehensif:

### Required Integrations:

- **[smart-contract-evm](../smart-contract-evm/SKILL.md)** - Untuk smart contract development dengan Solidity, testing, dan deployment ke EVM chains
- **[web3-wagmi-builder](../web3-wagmi-builder/SKILL.md)** - Untuk frontend Web3 dengan Wagmi, RainbowKit, dan Viem

### Optional Integrations:

- **[backend-honojs](../backend-honojs/SKILL.md)** - Untuk backend API jika proyek membutuhkan indexing, metadata storage, atau off-chain logic
- **[design-builder](../design-builder/SKILL.md)** - Untuk UI/UX design yang menarik dan professional

---

## References

Lihat folder [references/](references/) untuk dokumentasi lengkap yang mendukung setiap fase:

- **[Ideation Guide](references/ideation-guide.md)** - Framework brainstorming, validasi ide, market research methods, competitor analysis
- **[Hackathon Timeline](references/hackathon-timeline.md)** - 24/36/48 jam timeline template, milestone checkpoints, buffer time recommendations
- **[Judging Criteria](references/judging-criteria.md)** - Innovation, technical complexity, UX, market potential scoring, demo quality rubric
- **[Tech Stack Options](references/tech-stack-options.md)** - Blockchain comparison, smart contract languages, frontend/backend options, storage solutions

---

## Patterns

Lihat folder [pattern/](pattern/) untuk templates yang siap digunakan:

- **[Pitch Deck Template](pattern/pitch-deck-template.md)** - Struktur slide lengkap dengan tips untuk setiap section
- **[Project Structure Template](pattern/project-structure-template.md)** - Monorepo structure, smart contract layout, frontend/backend organization
- **[Demo Script Template](pattern/demo-script-template.md)** - Demo flow sequence, timing guide, backup scenarios, screen sharing checklist

---

## Examples

Lihat folder [example/](example/) untuk contoh lengkap proyek hackathon yang pernah dibuat:

- **[Full-Stack DAO Example](example/full-stack-dao-example.md)** - Complete DAO project walkthrough dengan governance contracts, frontend voting, dan deployment steps
- **[DeFi Protocol Example](example/defi-protocol-example.md)** - DeFi project dengan staking, farming, dan integration dengan protocols seperti Uniswap
- **[NFT Marketplace Example](example/nft-marketplace-example.md)** - NFT marketplace dengan ERC721 contracts, minting interface, dan IPFS integration

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    HACKATHON WORKFLOW                       │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Ideation (0-4 jam)                                │
│  ├── Brainstorm & Validate Problem                          │
│  ├── Market Research                                        │
│  └── Feasibility Check                                      │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Planning (4-8 jam)                                │
│  ├── Choose Tech Stack                                      │
│  ├── Design Architecture                                    │
│  └── Define MVP Scope                                       │
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Development (8-36 jam)                            │
│  ├── Build Core Feature                                     │
│  ├── Smart Contract Dev                                     │
│  ├── Frontend Integration                                   │
│  └── Testing & Deployment                                   │
├─────────────────────────────────────────────────────────────┤
│  Phase 4: Polish (36-44 jam)                                │
│  ├── Bug Fixes                                              │
│  ├── UI Polish                                              │
│  └── Demo Testing                                           │
├─────────────────────────────────────────────────────────────┤
│  Phase 5: Pitch (44-48 jam)                                 │
│  ├── Create Pitch Deck                                      │
│  ├── Prepare Demo Script                                    │
│  └── Q&A Preparation                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Kapan Menggunakan Skill Ini

Gunakan skill **hackathon-workflow** ketika:

1. User ingin mengikuti hackathon Web3/Blockchain dan membutuhkan panduan lengkap
2. User membutuhkan framework untuk menyelesaikan proyek dalam timeline terbatas
3. User ingin memaksimalkan peluang menang dengan workflow yang terstruktur
4. User membutuhkan template dan examples yang siap digunakan
5. User bingung harus mulai dari mana dalam hackathon

Skill ini akan memandu user melalui setiap fase dengan mandatory questions dan checklist yang memastikan progress yang tepat menuju submission yang successful.
