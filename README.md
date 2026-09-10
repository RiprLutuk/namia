# Syarfi — Modern Sharia Fintech Crowdfunding & Aggregator

Platform crowdfunding syariah dan fintech aggregator berkinerja tinggi yang menghubungkan pelaku usaha UMKM dengan komunitas pendana dan produk-produk keuangan halal di Indonesia tanpa riba, gharar, dan maisir.

Proyek ini telah direfaktor secara penuh dari arsitektur monolitik PHP lawas menjadi **Modern High-Performance Monorepo** berbasis **Bun Workspaces**, **ElysiaJS**, dan **SvelteKit 2 (Svelte 5 Runes)** sesuai spesifikasi `structure_and_prd.md`.

---

## 🚀 Tech Stack

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Monorepo Engine** | Bun Workspaces v1.3+ | Kecepatan instalasi & eksekusi instan |
| **Backend Framework** | ElysiaJS v1.2+ | Framework TypeScript tercepat (<15ms p95 latency) |
| **Data & ORM** | PostgreSQL + Drizzle ORM | Schema-first, type-safe query & migrasi |
| **Frontend Framework** | SvelteKit 2 + Svelte 5 Runes | `$state`, `$derived`, performa hidrasi tinggi |
| **Styling & UI** | Tailwind CSS v4 + Lucide Icons | Palet warna emerald syariah & tema responsif |
| **Type-Safe RPC Client** | Eden Treaty (`@elysiajs/eden`) | Sinkronisasi tipe end-to-end tanpa codegen |
| **API Documentation** | Elysia Swagger / OpenAPI 3.0 | Dokumentasi interaktif di `/swagger` |

---

## 📁 Struktur Monorepo

```
.
├── apps/
│   ├── backend/                     # ElysiaJS Backend API Service
│   │   ├── src/
│   │   │   ├── controllers/         # Aggregator, Calculator, Lead, Content
│   │   │   ├── db/                  # Drizzle ORM schemas, DB client, Mock data & Seed
│   │   │   ├── schemas/             # TypeBox & Drizzle data models
│   │   │   └── index.ts             # Elysia app entry point (port 3000)
│   │   ├── test/                    # Bun Test integration suite (14 passing tests)
│   │   └── drizzle.config.ts        # Drizzle ORM configuration
│   │
│   └── frontend/                    # SvelteKit 2 Frontend Application
│       ├── src/
│       │   ├── lib/
│       │   │   ├── components/      # Navbar, Footer, ProductCard, CompareDrawer
│       │   │   │   └── calculators/ # LoanCalculator, InvestmentCalculator, CreditScore
│       │   │   └── api.ts           # Eden Treaty Client
│       │   └── routes/              # SvelteKit Pages & Routes
│       │       ├── +page.svelte     # Landing page interaktif & showcase
│       │       ├── aggregator/      # Multi-kategori catalog & filter
│       │       ├── calculators/     # Kalkulator finansial lengkap
│       │       ├── onboarding/      # Wizard pengajuan pembiayaan & E-KYC
│       │       ├── about/           # Profil perusahaan, Direksi & DPS DSN-MUI
│       │       ├── borrower/        # Panduan peminjam/penerima dana UMKM
│       │       ├── investor/        # Panduan pendana/investor sukuk
│       │       ├── blog/            # Pusat edukasi & literasi muamalah
│       │       └── contacts/        # Kontak kantor Menara MTH & formulir
│       └── static/                  # Static assets & gambar produk
├── structure_and_prd.md             # Dokumen spesifikasi arsitektur & PRD
└── package.json                     # Root orchestrator
```

---

## ⚡ Cara Menjalankan Aplikasi

### 1. Menjalankan Server Development (Backend & Frontend Sekaligus)
Dari root direktori proyek, jalankan:
```bash
bun run dev
```
- **Backend API**: `http://localhost:3000`
- **Swagger Documentation**: `http://localhost:3000/swagger`
- **Frontend SvelteKit**: `http://localhost:5173`

### 2. Menjalankan Backend Secara Terpisah
```bash
cd apps/backend
bun run dev
```

### 3. Menjalankan Frontend Secara Terpisah
```bash
cd apps/frontend
bun run dev
```

### 4. Menjalankan Unit & Integration Test Suite
```bash
bun run test
```
*Hasil pengujian: 14 test lulus dengan respon latensi 0.36ms - 1.12ms (jauh di bawah target <15ms).*

### 5. Memeriksa Tipe & Build Production
```bash
bun run check
bun run build
```

---

## 🔍 Fitur Utama yang Disediakan

1. **Multi-Category Fintech Aggregator**:
   - P2P Lending Syariah, Asuransi Takaful, Paylater Syariah, Sukuk / Reksa Dana Syariah, Pembiayaan UMKM.
   - Filter dinamis berdasarkan akad syariah (Murabahah, Mudharabah, Musyarakah, Wakalah, Ta'awun).
   - Fitur **Floating Compare Drawer** untuk membandingkan 2 hingga 3 produk finansial secara berdampingan.

2. **Modular Financial Calculator Suite**:
   - **Kalkulator Pembiayaan Murabahah**: Simulasi cicilan flat tanpa bunga berbunga dengan pilihan akad jual beli.
   - **Kalkulator Investasi Mudharabah**: Proyeksi bagi hasil riil dan compound return modal usaha.
   - **Estimator Skor Kelayakan Finansial**: Perhitungan Debt Service Ratio (DSR), analisis kapasitas angsuran, dan rekomendasi plafon.

3. **Onboarding & E-KYC Wizard**:
   - Multi-step application form (Identitas diri, Kebutuhan dana, Profil finansial, Ijab Qabul digital).
   - Validasi instan di browser dan API endpoint penerimaan prospek dengan nomor referensi unik.

4. **Kepatuhan Syariah & Regulasi**:
   - Seluruh konten dan alur merujuk pada regulasi OJK dan Fatwa DSN-MUI (No. 117/DSN-MUI/II/2018).
