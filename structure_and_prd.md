# Product Requirement Document (PRD) & Architecture Structure
## Global Financial Technology Template (SvelteKit + ElysiaJS + Bun Monorepo)

---

## 1. Executive Summary & Objective

### 1.1 Objective
Proyek ini bertujuan untuk melakukan **rewrite (migrasi total)** dari arsitektur PHP lama berbasis *monolith* menjadi sebuah **Monorepo modern berkecepatan tinggi** menggunakan **Bun, ElysiaJS, dan SvelteKit**. 

### 1.2 Global Scope (Multi-Purpose Fintech Template)
Aplikasi ini didesain sebagai **Template Global Multi-Fungsi** yang modular. Template ini tidak hanya berfungsi sebagai Company Profile Fintech statis, melainkan dapat dikonfigurasi secara instan menjadi berbagai varian platform finansial yang saling berelasi:
*   **Fintech Company Profile & Edu-Hub:** Representasi corporate modern dengan kalkulator finansial interaktif.
*   **Fintech Aggregator / Comparison Platform:** Sistem pencarian, filter, dan komparasi produk pihak ketiga (P2P Lending, Asuransi, Paylater, Reksa Dana).
*   **Lead Generation & Onboarding Funnel:** Pipeline pengumpulan data pengguna awal sebelum dioperasikan ke API mitra.

---

## 2. Monorepo Directory Structure

Struktur folder dikelola menggunakan **Bun Workspaces** untuk memisahkan domain Front-End (SvelteKit) dan Back-End (ElysiaJS) namun tetap menjaga sinkronisasi *TypeScript Type-Safe* secara penuh melalui Eden Treaty.

```text
financial-template-monorepo/
├── package.json                 # Konfigurasi Bun Workspaces & Root Scripts
├── bun.lock                     # Universal Lockfile Bun
├── README.md                    # Dokumentasi Instalasi Proyek
├── apps/
│   ├── frontend/                # SvelteKit App (UI & Aggregator Engine)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── api.ts       # Inisialisasi Eden Client (Elysia Integration)
│   │   │   │   └── components/  # Reusable Fintech UI Components (Cards, Calculator)
│   │   │   ├── routes/          # SvelteKit Routing (Global & Aggregator Pages)
│   │   │   │   ├── +layout.svelte
│   │   │   │   ├── +page.svelte # Landing Page / Company Profile Main
│   │   │   │   └── aggregator/  # Sistem Komparasi & Filter Produk
│   │   │   │       ├── +page.svelte
│   │   │   │       └── [category]/+page.svelte
│   │   │   └── app.d.ts
│   │   ├── package.json
│   │   └── svelte.config.js
│   │
│   └── backend/                 # ElysiaJS App (Fast API & Aggregator Core)
│       ├── src/
│       │   ├── index.ts         # Main Entrypoint & Global Export Type App
│       │   ├── controllers/     # Logika Bisnis (Aggregator, Calculators, Leads)
│       │   │   ├── aggregator.ts
│       │   │   └── lead.ts
│       │   ├── schemas/         # TypeBox Validation Schemas (Fintech Specs)
│       │   │   └── product.ts
│       │   └── config/          # Database & Environment Setup
│       ├── package.json
│       └── tsconfig.json
```

---

## 3. Product & Feature Requirements

### 3.1 Core Features (Global Fintech Module)

#### A. Multi-Category Aggregator & Comparison Engine (Core Feature)
*   **Requirement:** Sistem dinamis yang bisa melakukan filter, urut (*sorting*), dan bandingkan data produk finansial berdasarkan kategori (*Bunga, Tenor, Rating, Limit*).
*   **Scope Template:** Harus bisa menerima variasi skema produk global (misal: Produk P2P Lending punya atribut *Suku Bunga*, sedangkan Paylater punya atribut *Biaya Admin*).
*   **ElysiaJS Role:** Menyediakan endpoint API tangguh dengan validasi ketat menggunakan TypeBox untuk memastikan input filter data mitra akurat.
*   **SvelteKit Role:** Manajemen *state* filter yang reaktif tanpa memicu pemuatan ulang halaman penuh (*Zero-latency filtering*).

#### B. Dynamic Financial Calculators (Interactive Section)
*   **Requirement:** Kalkulator interaktif simulasi pinjaman, kalkulator imbal hasil investasi (ROI/Compound Interest), dan kalkulator kelayakan kredit (Credit Score Estimator).
*   **Scope Template:** Komponen kalkulator dibuat dalam bentuk svelte komponen yang terisolasi (*Modular Component*), sehingga tipe kalkulator bisa diaktifkan/dimatikan lewat file konfigurasi.

#### C. Secure Lead Generation & KYC Onboarding Simulator
*   **Requirement:** Formulir multi-step (*Wizard Form*) untuk mengumpulkan data prospek pengguna (Nama, Kontak, Penghasilan, Kebutuhan Finansial).
*   **Scope Template:** Validasi *real-time* di sisi klien menggunakan Svelte dan validasi ketat di sisi server ElysiaJS sebelum data diteruskan atau disimpan ke database simulator.

#### D. Content Management System (CMS) Hub untuk Edukasi & Regulasi
*   **Requirement:** Halaman blog/edukasi finansial statis namun berkecepatan tinggi lengkap dengan penempatan informasi regulasi legalitas (seperti simulator lisensi otoritas keuangan lokal).
*   **Scope Template:** Menggunakan kapabilitas kompilasi SvelteKit statis untuk optimasi SEO yang sempurna.

---

## 4. Technical Architecture & Data Workflow

### 4.1 Data Synchronization (Eden Treaty Flow)
Arsitektur ini menghilangkan kebutuhan dokumentasi manual API (*no more stale API contracts*):
1.  **Define:** Developer mendefinisikan rute dan validasi skema skrip finansial baru di `apps/backend/src/controllers/aggregator.ts` menggunakan TypeBox.
2.  **Export:** Elysia mengekspor tipe data mutakhir melalui `export type App = typeof app`.
3.  **Consume:** SvelteKit mengimpor tipe tersebut di `apps/frontend/src/lib/api.ts`. Editor (VS Code) langsung memberikan fitur *IntelliSense* otomatis saat memanggil parameter fintech.

### 4.2 Tech Stack Architecture
*   **Runtime Engine:** Bun v1.x (Universal execution & package manager)
*   **Back-End Framework:** ElysiaJS (REST API Server, CORS Enabled)
*   **Front-End Framework:** SvelteKit (UI Renderer & Client Router)
*   **Data Validation:** TypeBox (Native to Elysia)
*   **Type Safety:** TypeScript Strict Mode

---

## 5. Non-Functional Requirements & Performance Targets

*   **Performance (Lighthouse Score):** Target nilai performa Front-End wajib mencapai **>95** untuk aspek *Performance, Accessibility, dan SEO* berkat kompilasi super ringan Svelte.
*   **API Response Time:** Waktu respons server ElysiaJS untuk pencarian data aggregator wajib berada di bawah **<15ms** pada kondisi normal.
*   **Scalability:** Struktur folder modular memungkinkan developer untuk mengubah salah satu aplikasi (misal menambahkan dashboard admin terpisah) tanpa mengganggu kode yang sudah ada cukup dengan mendaftarkannya ke dalam Bun Workspaces.