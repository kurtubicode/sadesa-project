# SADESA (Sahabat Digital Desa) 🏛️

Sistem informasi dan administrasi terpadu untuk pelayanan warga Desa Cirangkong. Proyek ini dikembangkan menggunakan arsitektur _monorepo_ untuk memudahkan pengelolaan kode, memisahkan antara sistem _backend_ (Admin Web & API) dan _frontend_ (Aplikasi Mobile Warga).

## 📂 Struktur Repositori

Proyek ini terdiri dari dua bagian utama:

| Direktori  | Teknologi Utama                   | Deskripsi                                                                                                                  |
| :--------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `/backend` | **Laravel 11, Inertia.js, React** | Berisi Panel Admin berbasis Web, skema Database, dan REST API (Sanctum) yang bertugas melayani data untuk aplikasi mobile. |
| `/mobile`  | **React Native, Expo Router**     | Berisi _source code_ aplikasi Android/iOS yang menjadi antarmuka utama bagi warga desa untuk mengakses layanan.            |

---

## 🚀 Panduan Instalasi & Pengembangan (Development)

Pastikan kamu sudah menginstal **PHP**, **Composer**, **Node.js**, dan database server (seperti **MySQL** via Laragon/XAMPP) di komputermu.

### 1. Setup Backend (Laravel)

Buka terminal, masuk ke folder `backend`, dan jalankan perintah berikut:

`````bash
cd backend

# Install dependensi PHP dan Node
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Lakukan migrasi database (Pastikan database 'sadesa' sudah dibuat)
php artisan migrate

# Jalankan server API (Gunakan IP 0.0.0.0 agar bisa diakses emulator/HP)
php artisan serve --host=0.0.0.0 --port=8000

### 2. Setup Mobile (expo)

Buka terminal baru, masuk ke folder mobile, dan jalankan perintah berikut:

````Bash
cd mobile

# Install dependensi React Native
npm install

# Jalankan server Expo (Gunakan flag -c untuk membersihkan cache jika perlu)
npx expo start -c


⚠️ Penting untuk Mobile:
Sebelum melakukan login atau fetch data dari aplikasi mobile, pastikan URL API di dalam source code (menggunakan Axios) sudah disesuaikan dengan IP Address lokal komputermu (contoh: http://192.168.x.x:8000/api/...), bukan localhost.

✨ Fitur Utama (Tahap Pengembangan)
[x] Autentikasi API menggunakan Laravel Sanctum.

[x] Sistem Auto-Login di Mobile menggunakan Expo SecureStore.

[ ] Dashboard Informasi Warga.

[ ] Layanan Pengajuan Surat Desa.
`````
