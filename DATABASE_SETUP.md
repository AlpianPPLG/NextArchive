# Setup Database untuk e-Arsip Digital

## Langkah-langkah Setup:

### 1. Pastikan MySQL Server Berjalan
- Buka XAMPP Control Panel
- Klik tombol "Start" pada MySQL
- Tunggu sampai status berubah menjadi hijau

### 2. Buat Database dan Tabel
Jalankan salah satu cara berikut:

#### Cara A: Menggunakan phpMyAdmin
1. Buka browser dan akses http://localhost/phpmyadmin
2. Klik tab "SQL"
3. Copy paste seluruh isi file `src/scripts/database.sql`
4. Klik "Go" atau "Jalankan"

#### Cara B: Menggunakan Command Line
```bash
mysql -u root -p < src/scripts/database.sql
```
(Tekan Enter jika diminta password dan password kosong)

#### Cara C: Menggunakan MySQL Workbench
1. Buka MySQL Workbench
2. Buka koneksi localhost
3. File → Open SQL Script
4. Pilih file `src/scripts/database.sql`
5. Klik icon petir (Execute)

### 3. Verifikasi Database
Pastikan database `e_arsip_db` sudah dibuat dengan tabel:
- users
- classifications
- incoming_letters
- outgoing_letters
- faqs

### 4. Test Login
Gunakan kredensial default:
- Username: `admin_arsip`
- Password: `password123`

### 5. Restart Development Server
```bash
npm run dev
```

## Troubleshooting

### Error: ETIMEDOUT
**Masalah:** Tidak dapat terhubung ke MySQL server
**Solusi:**
1. Pastikan MySQL service berjalan di XAMPP
2. Periksa port MySQL (default: 3306)
3. Periksa file `.env.local` - pastikan konfigurasi benar

### Error: Access Denied
**Masalah:** Username atau password database salah
**Solusi:**
1. Periksa file `.env.local`
2. Pastikan `DB_USER=root` dan `DB_PASSWORD=` (kosong untuk XAMPP default)

### Error: Database does not exist
**Masalah:** Database belum dibuat
**Solusi:**
1. Jalankan script `database.sql` menggunakan salah satu cara di atas

## Konfigurasi Database (.env.local)

Pastikan file `.env.local` memiliki konfigurasi:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=e_arsip_db
```

Untuk XAMPP default, password biasanya kosong.
Jika menggunakan MySQL Workbench atau instalasi manual, sesuaikan dengan password Anda.

