# Perbaikan audit — 28 September 2026

Perbaikan berikut diterapkan terhadap temuan audit 27 September. Status ini merujuk kode dan lingkungan uji lokal; bukan hasil pentest atau deployment produksi.

| Temuan                           | Perbaikan                                                                                                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Bypass API / CMS tanpa role   | Pengecualian Origin, Referer, User-Agent dan API key dihapus. Semua mutasi CMS memakai pemeriksaan admin di server.                                                                                                   |
| 2. Lead tanpa ownership          | Identitas dari sesi server; owner ID diperiksa untuk baca/update. Akses silang mengembalikan 404; list pribadi difilter dan tidak menyertakan NIK/penghasilan.                                                        |
| 3. Stored XSS FAQ                | FAQ dirender sebagai teks; payload HTML baru ditolak. URL aktif dibatasi. CSP membatasi script dan frame; CDATA RSS di-escape.                                                                                        |
| 4. Login simulasi dan public key | Akun PostgreSQL, password Argon2id, token acak dengan hash tersimpan, sesi kedaluwarsa/revokasi. Cookie HttpOnly/SameSite; produksi Secure dan prefiks __Host-. Tidak ada secret frontend atau password admin bawaan. |
| 5. KYC otomatis verified         | Submit memerlukan NIK numerik, pekerjaan, penghasilan, dan persetujuan. Status submitted terpisah dari verified; keputusan admin memerlukan catatan dan dicatat transaksional.                                        |
| 6. Counter reset                 | ID lead berasal dari sequence database. Counter CMS disimpan, mempertimbangkan ID maksimum, dan tidak reset setelah restart/hapus/reset konten.                                                                       |
| 7. Persistence JSON tidak andal  | PostgreSQL dengan transaksi, query parametrik, dan row lock. Kegagalan commit menjadi error HTTP, tanpa state parsial di memori. Data pribadi keluar dari source code.                                                |
| 8. URL localhost pada browser    | Browser menggunakan same-origin /api. SvelteKit proxy memakai BACKEND_URL server-only, dengan adapter Node dan batas ukuran body.                                                                                     |
| 9. Lead admin fiktif             | Daftar/detail pengajuan dan inbox kontak berasal dari database; peran admin diperiksa pada endpoint. Aksi review memakai ID hasil API.                                                                                |
| 10. IP/rate limit palsu          | Peer socket sebagai sumber utama; X-Real-IP hanya dari proxy yang dikonfigurasi. Counter atomik PostgreSQL dibagi antar-instance. Login dibatasi per IP dan akun.                                                     |
| 11. Statistik dan saldo fiktif   | Statistik operasional UNAVAILABLE; transaksi pendana dinonaktifkan secara jelas sampai integrasi nyata tersedia. Tidak ada pembuatan saldo/instruksi transfer demo.                                                   |
| 12. Tes mencemari data           | App factory tanpa listen saat import; tes memakai PostgreSQL sementara yang dibuat/dihapus sendiri dan tidak memakai DATABASE_URL aplikasi.                                                                           |

## Struktur reusable dan clean code

- AuthService menangani akun/sesi; requireUser menangani akses berbasis role.
- Domain KYC menangani aturan transisi; repository menangani transaksi dan ownership.
- ContentRepository mengisolasi snapshot per operasi dan serialisasi writer. Seed publik tidak berisi lead.
- AccountAccess dipakai CMS, onboarding, dan portal akun. LeadList dan ContactInbox membaca data aktual.
- apiRequest serta helper mutasi CMS memusatkan error HTTP; perubahan UI menunggu commit server. Adapter input CMS menyatukan alias field lama dengan kontrak API.
- Editor menunggu sinkronisasi data terbaru; refresh paksa tidak berlomba dengan fetch yang masih berjalan. Error mutasi tetap terlihat dan tidak menutup formulir sebagai sukses.

## Bukti verifikasi

- `bun run test`: 31 tes lulus, 0 gagal, 71 assertions, menggunakan PostgreSQL sementara. Termasuk kegagalan write database yang disengaja dan bukti rollback.
- `bun run check`: backend lulus; frontend 0 errors / 0 warnings.
- `bun run build`: berhasil dengan adapter-node.
- Browser E2E memakai server hasil build dan Chromium: guard CMS, registrasi/cookie, onboarding, review admin, simpan dan muat ulang branding, FAQ, HTML legacy yang inert, kirim kontak dan inbox admin, serta pemeriksaan CSP/hidrasi.
- `bun audit`: tidak menemukan kerentanan yang tercatat pada dependency yang terpasang saat pemeriksaan. Ini bukan jaminan tidak ada kerentanan yang belum diketahui.

Dependency override `cookie` dan `esbuild` menutup temuan scanner pada versi transitif. Referensi: [advisory cookie](https://github.com/advisories/GHSA-pxg6-pf52-xh8x), [advisory esbuild](https://github.com/advisories/GHSA-67mh-4wv8-2f99). Kompatibilitas perubahan diuji dengan typecheck, build, dan login melalui browser.

## Aktivasi dan batas yang masih memerlukan lingkungan operasional

Ikuti [OPERATIONS.md](OPERATIONS.md) untuk migrasi, pembuatan admin, konfigurasi HTTPS/proxy, backup/restore, dan import data legacy. Database produksi, TLS, firewall, backup terjadwal, serta penghapusan data dari riwayat Git tidak diubah atau diverifikasi oleh tes lokal. `.env` yang sudah ada tidak ditimpa.

Integrasi pembayaran dan penyedia e-KYC tidak dibuat-buat. Verifikasi email, recovery password, dan MFA belum menjadi fitur aplikasi. Portal pendana menunjukkan bahwa transaksi belum tersedia; KYC tetap proses pemeriksaan manual. Perbaikan ini tidak menyatakan kepatuhan hukum atau syariah secara otomatis.
