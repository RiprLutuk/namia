# Operasi, migrasi, dan deployment

## Data legacy

Pada perbaikan ini snapshot JSON lama dipisahkan dari source code. Backup lengkap lokal berada di `.local/legacy-cms_state.json`, tidak dilacak Git, dengan izin file 0600. Seed publik berada di `apps/backend/src/db/content-seed.json`, tanpa daftar lead. `.env` yang sudah ada tidak ditimpa.

Migrasi versi 1 menginisialisasi penyimpanan aplikasi. Versi 2 memindahkan tujuh koleksi konten ke tabel domain dan mengubah `app_leads` menjadi `leads` dengan kolom terstruktur. ID, urutan, field tambahan, pemilik, dan waktu pembuatan dipertahankan. `app_content` menyimpan pengaturan, koleksi tambahan, dan counter. Versi tercatat di `app_migrations`; menjalankan ulang tidak menimpa data. Migrasi berjalan dalam satu transaksi dan menolak tabel domain yang sudah ada agar tidak menimpa skema lain. Hentikan instance aplikasi versi lama sebelum menjalankan versi 2, lalu mulai aplikasi versi baru setelah migrasi selesai. Jalankan `bun run db:migrate` memakai role migrasi. Bootstrap admin dijalankan terpisah dengan `bun run admin:create`.

Jika lead legacy memang perlu dipindahkan, setelah mem-backup database jalankan dari root:

```sh
bun --filter backend db:import-legacy ../../.local/legacy-cms_state.json
```

Import hanya diizinkan saat tabel `leads` kosong. Seluruh batch transaksional; setiap baris mendapat ID baru karena ID lama dapat bertabrakan. ID lama dipertahankan sebagai `legacy_reference`; waktu pembuatan asli serta alamat/tanggal lahir dipertahankan. Salinan utuh tiap record disimpan privat di `legacy_payload`, tidak dikirim melalui API. Status menjadi pending, owner kosong, dan data hanya terlihat oleh admin. Kepemilikan tidak ditebak dari email, dan status verified lama tidak dipercaya. Operator perlu memeriksa identitas serta menentukan tindak lanjut untuk data legacy sebelum menggunakannya secara operasional.

Penghapusan dari working tree tidak menghapus salinan data yang sudah ada dalam riwayat Git atau clone lain. Jika riwayat memuat data nyata, lakukan pembersihan riwayat terkoordinasi dan penanganan salinan sesuai kebijakan organisasi. Riwayat Git tidak diubah otomatis oleh pekerjaan ini.

## Konfigurasi produksi

Backend:

```text
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
APP_ORIGIN=https://domain-anda.example
DATABASE_URL=<secret connection string>
TRUSTED_PROXY_IPS=127.0.0.1
```

Frontend hasil `bun run build`:

```text
NODE_ENV=production
HOST=127.0.0.1
PORT=4000
ORIGIN=https://domain-anda.example
BACKEND_URL=http://127.0.0.1:3000
BODY_SIZE_LIMIT=256K
```

Jalankan backend dengan Bun (`bun src/index.ts` dari apps/backend), frontend dengan Node (`node build` dari apps/frontend), di bawah process manager. Pastikan env disuplai process manager; Node tidak otomatis membaca `.env`. Lihat [adapter-node](https://svelte.dev/docs/kit/adapter-node).

Hanya reverse proxy TLS yang dibuka ke publik. Teruskan seluruh path ke frontend port 4000; jangan membuka backend atau PostgreSQL ke publik. Jika menggunakan proxy jaringan terpisah, atur IP yang dipercaya secara eksplisit. SvelteKit memakai peer address secara default. Bila memakai ADDRESS_HEADER di belakang reverse proxy, proxy wajib menghapus lalu menimpa header tersebut; jangan mempercayai forwarding header langsung dari internet. Backend hanya menerima X-Real-IP dari peer dalam TRUSTED_PROXY_IPS.

Gunakan role database runtime dengan hak SELECT/INSERT/UPDATE/DELETE pada tabel runtime `app_*`, `leads`, `categories`, `products`, `blog_posts`, `faq_categories`, `faqs`, `personil`, dan `stats` (hanya SELECT untuk `app_migrations`) serta USAGE/SELECT pada sequence terkait; pisahkan dari role migrasi yang memiliki DDL. Gunakan koneksi database privat/TLS dan media penyimpanan terenkripsi sesuai infrastruktur. Startup gagal bila database atau migrasi belum siap; health memeriksa koneksi database. Jangan mengaktifkan mode development pada domain publik.

API key publik lama sudah tidak dipakai untuk akses. Hapus variabel NAMIA_API_KEY/PUBLIC_NAMIA_API_KEY yang usang; jika nilai lama digunakan layanan lain, rotasi pada layanan tersebut.

## Backup dan pemulihan

Gunakan backup PostgreSQL terjadwal ke penyimpanan privat terenkripsi, termasuk seluruh tabel domain, app_users, app_sessions, leads, app_contacts, app_content, app_migrations, dan app_audit_events. Jangan meletakkan dump di repository atau direktori static. Tetapkan retensi berdasarkan kebutuhan data organisasi. Contoh perintah, dengan variabel disuplai secret manager:

```sh
pg_dump --format=custom --file="$BACKUP_FILE" "$DATABASE_URL"
pg_restore --exit-on-error --no-owner --dbname="$RESTORE_DATABASE_URL" "$BACKUP_FILE"
```

RESTORE_DATABASE_URL harus menunjuk database pemulihan terpisah. Uji jumlah record, login, baca lead, dan konten sebelum cutover. Setelah restore atau insiden, hapus sesi tersimpan untuk memaksa autentikasi ulang. Jadwal backup dan uji restore pada infrastruktur produksi tidak dapat diverifikasi dari repository lokal.

## Batas fitur

KYC adalah pemeriksaan manual oleh admin berwenang, bukan integrasi penyedia e-KYC. Tidak ada transaksi uang, gateway pembayaran, email verification, atau pemulihan password otomatis. Halaman pendana menampilkan batas ini dan tidak mengeluarkan nomor transfer atau saldo fiktif. Statistik operasional mengembalikan UNAVAILABLE sampai ada sumber transaksi terverifikasi. Konten produk dan legal yang dikelola CMS tetap memerlukan validasi editorial perusahaan.

## Migrasi domain lokal (28 September 2026)

Database `namia` telah dimigrasikan ke versi 2. Backup sebelum migrasi: `.local/namia-before-domain-migration.dump` (0600, diabaikan Git). Sebanyak 38 leads dari backup JSON lokal telah diimpor; semuanya pending dan tanpa owner. Jangan mengulang import pada database ini.

Untuk rollback, hentikan penulis, pulihkan dump ke database terpisah, verifikasi isinya, lalu gunakan versi aplikasi sebelum migrasi domain. Jangan menjalankan kode lama terhadap skema versi 2. Dump sebelum migrasi tidak mencakup perubahan setelah waktu backup; ekspor perubahan baru sebelum rollback jika sudah ada aktivitas lanjutan.
