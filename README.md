# Namia Syariah

Monorepo Bun dengan backend Elysia, PostgreSQL, serta frontend SvelteKit/Svelte 5. Fitur aktif: katalog produk, kalkulator, CMS admin, akun borrower/lender, pengajuan pembiayaan, pemeriksaan KYC manual, dan formulir kontak. Pembayaran, top-up, saldo pendanaan, dan statistik transaksi belum terintegrasi; UI tidak membuat saldo atau status transaksi simulasi.

## Menjalankan lokal

Prasyarat: Bun 1.3+, Node 22+, PostgreSQL. Salin `.env.example` ke `.env` hanya bila belum ada; sesuaikan DATABASE_URL dengan database lokal khusus aplikasi. Backend tidak lagi fallback ke JSON jika database gagal.

```sh
bun install --frozen-lockfile
bun run db:migrate
bun run admin:create
bun run dev
```

`admin:create` memerlukan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` melalui environment lokal/secret manager, dengan password 12–128 karakter. Tidak ada akun admin atau password bawaan. Hindari menulis password literal dalam shell history. Kredensial tersebut hanya dipakai CLI, tidak disimpan di kode atau dikirim ke browser. CLI gagal jika email sudah ada; tidak mengubah akun lain diam-diam.

Frontend: http://localhost:5173. Backend hanya mendengarkan loopback port 3000 secara default. Browser memanggil `/api`; SvelteKit meneruskan permintaan ke BACKEND_URL. APP_ORIGIN harus sama persis dengan origin frontend, termasuk port.

- `/auth/cms/borrower`: daftar/masuk dan daftar pengajuan milik sendiri.
- `/onboarding`: formulir pengajuan, memerlukan akun borrower.
- `/auth/cms/lender`: akun pendana dan simulasi; transaksi belum tersedia.
- `/backoffice/auth`: login admin dan pemeriksaan pengajuan nyata.
- `/cms`: pengelolaan konten, memerlukan sesi admin.

## Arsitektur dan batas tanggung jawab

| Lapisan        | Lokasi                                    | Tanggung jawab                                            |
| -------------- | ----------------------------------------- | --------------------------------------------------------- |
| App factory    | `apps/backend/src/app.ts`                 | Komposisi dependency, kebijakan request, penanganan error |
| Controller     | `apps/backend/src/controllers`            | Kontrak HTTP dan validasi input                           |
| Service        | `apps/backend/src/services`               | Password hashing, sesi, autentikasi                       |
| Domain         | `apps/backend/src/domain`                 | Aturan kepemilikan, transisi KYC, keamanan konten         |
| Repository     | `apps/backend/src/repositories`           | Query parametrik, transaksi, penguncian, persistence      |
| Komponen akun  | `AccountAccess.svelte`, `LeadList.svelte` | Login bersama, daftar/detail pengajuan dan review         |
| Klien frontend | `apps/frontend/src/lib/api.ts`            | Permintaan same-origin dan penanganan respons gagal       |

`createApp` tidak membuka port atau mengakses file data saat diimpor. `index.ts` hanya mengurus startup/shutdown. Data akun, sesi, pengajuan, pesan kontak, rate limit, dan audit review berada di tabel terpisah. Konten editorial disimpan sebagai satu dokumen JSONB dengan transaksi dan `SELECT FOR UPDATE`; ini menjaga kompatibilitas bentuk CMS sekaligus menghindari perubahan yang saling menimpa. Counter konten disimpan bersama dokumen, sedangkan ID pengajuan berasal dari sequence PostgreSQL.

Semua mutasi CMS diperiksa sebagai admin di server. Lead diperiksa berdasarkan owner ID, bukan email yang dikirim pengguna. Password menggunakan Argon2id; token sesi acak disimpan sebagai hash dan dikirim lewat cookie HttpOnly/SameSite. Produksi memakai cookie Secure. Origin harus cocok pada semua mutasi JSON. Header Origin/User-Agent/API key tidak pernah membuktikan identitas pengguna.

## Pengujian

```sh
bun run check
bun run test
bun run build
bun run test:e2e
bun audit
```

Tes API dan E2E membuat cluster PostgreSQL sementara, memilih port kosong, dan membersihkannya setelah selesai. Keduanya tidak memakai DATABASE_URL aplikasi. Sediakan `initdb`/`pg_ctl` melalui PATH atau `PG_BIN=/path/to/postgresql/bin`; akun OS yang menjalankan tes tidak boleh root. Pengujian browser memerlukan Chromium: jalankan `bunx playwright install chromium` dari `apps/frontend` sekali. `test:e2e` membangun frontend lalu menguji server hasil build dengan Chromium headless.

Tes mencakup otorisasi, kepemilikan, cookie, expiry/logout, CSRF, XSS, validasi KYC, restart/ID, write concurrency, rollback, kegagalan database, rate limit antar-instance, dan alur pengguna/admin di browser. Tes tidak mengukur p95 produksi.

## Migrasi dan deployment

Lihat [panduan operasi dan migrasi](docs/OPERATIONS.md) dan [hasil perbaikan audit](docs/SECURITY-REMEDIATION.md). Migrasi aktif berada di `apps/backend/migrations`; folder `apps/backend/drizzle` adalah artefak migrasi lama dan tidak dijalankan oleh script aktif.
