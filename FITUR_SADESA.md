# Fitur SADESA — Sistem Administrasi Desa Digital
**Desa Cirangkong, Kecamatan Cijambe, Kabupaten Subang**

---

## Aktor

| Peran | Deskripsi |
|---|---|
| Admin | Superuser — kelola data master, pengguna, template surat, pengaturan |
| Staff | Verifikasi pengajuan, tanggapi pengaduan, cetak surat |
| Kepala Desa | Pengesahan akhir pengajuan surat |
| Warga | Ajukan surat, laporan pengaduan, isi data diri |
| Publik | Informasi desa & buku tamu (tanpa login) |

---

## M01 — Autentikasi

- Registrasi akun (nama, NIK, email, password)
- Login email + password
- Lupa & reset password via email
- Verifikasi email
- Two-factor authentication (OTP)
- Logout

---

## M02 — Dashboard

**Admin** — StatCard: total pengajuan, menunggu verifikasi, pengaduan aktif, total penduduk, total warga

**Staff** — StatCard pengajuan hari ini, antrian aktif, selesai hari ini; filter tab status; daftar pengaduan terbaru; counter buku tamu

**Kepala Desa** — StatCard: menunggu pengesahan, disahkan bulan ini, pengaduan selesai, total warga; alert antrian; bar chart jenis surat; panel ringkasan (tingkat penyelesaian, jenis terbanyak, ditolak)

**Warga** — Info selamat datang; banner peringatan jika data kependudukan belum lengkap

---

## M03 — Data Kependudukan Warga

- Form isi/edit data diri: nama, tempat lahir, tanggal lahir, jenis kelamin (toggle), agama, status perkawinan, pekerjaan, alamat, no. KK, wilayah
- Progress bar kelengkapan realtime (8 field wajib)
- NIK read-only (dari akun)
- `updateOrCreate` — buat baru jika belum ada, update jika sudah
- Banner peringatan di dashboard jika profil belum lengkap

---

## M04 — Pengajuan Surat (Warga)

- Pilih jenis surat dari daftar aktif
- Form dinamis sesuai template jenis surat
- Upload dokumen pendukung
- Submit pengajuan → status awal `menunggu`
- Lihat daftar & status pengajuan sendiri

> Status: selesai, perlu penyesuaian lebih lanjut

---

## M05 — Verifikasi Pengajuan (Staff)

- Daftar antrian pengajuan dengan filter status
- Detail pengajuan: layout split-screen dokumen + identitas pemohon
- Viewer dokumen inline (PDF iframe / gambar)
- Tab switcher antar-dokumen pendukung
- Data kependudukan pemohon otomatis dari database via NIK
- Preview draft surat (collapsible iframe)
- Verifikasi setujui → status `menunggu_pengesahan`
- Tolak dengan catatan → status `ditolak_staff`
- Download/cetak PDF surat (setelah disahkan)
- Tandai siap diambil (konfirmasi TTD fisik selesai) → status `siap_diambil`
- Konfirmasi surat sudah diambil warga → status `selesai`
- Timeline riwayat proses pengajuan

**Alur status:**
```
menunggu → diproses → menunggu_pengesahan → disetujui → siap_diambil → selesai
                  ↘ ditolak_staff          ↘ ditolak_kepala
```

---

## M06 — Pengesahan Surat (Kepala Desa)

- Daftar pengajuan menunggu pengesahan
- Detail pengajuan: split-screen dokumen + identitas pemohon
- Preview surat collapsible
- Sahkan (double-confirm) → status `disetujui`, PDF di-generate otomatis
- Tolak dengan catatan (double-confirm) → status `ditolak_kepala`
- Info surat output: nomor surat + tanggal generate
- Riwayat verifikasi staff sebelumnya

---

## M07 — Pantau Pengajuan (Admin)

- Lihat semua pengajuan lintas peran (read-only)
- Detail pengajuan + riwayat proses

---

## M08 — Master Surat (Admin)

**29 jenis surat aktif, 5 kategori:**

| Kategori | Kode |
|---|---|
| Domisili (4) | DOM-DLM, DOM-LWY, DOM-LBG, DOM-USH |
| Ijin (7) | IJN-ABG, IJN-SMI, IJN-CTP, IJN-ORT, IJN-PMN, IJN-TTG, IJN-RMI |
| Keterangan (12) | KTR-LHR, KTR-PKJ, KTR-PDL, KTR-KTR, KTR-BNM, KTR-BLM, KTR-LNR, KTR-KRM, KTR-LKT, KTR-PGH, KTR-PKK, KTR-MSK |
| Keterangan Tanah (5) | TNH-WKF, TNH-BRI, TNH-KPL, TNH-PJM, TNH-TKS |
| Pengantar Nikah (2) | NKH-LLK, NKH-PRP |

**Fitur:**
- CRUD jenis surat (nama, kode, kategori, nomor prefix, deskripsi, dokumen pendukung)
- Toggle aktif/nonaktif
- Block editor template surat
  - Block types: `paragraph`, `fields_table`, `alasan`, `signature`, `spacer`
  - Substitusi variabel: `{{nama_lengkap}}`, `{{nik}}`, `{{alamat}}`, dll
  - Preview template realtime

---

## M09 — Pengaduan (Staff & Admin)

- Daftar pengaduan dengan filter status & kategori
- Detail pengaduan: isi laporan, data pelapor
- Tambah respons/tanggapan
- Update status: menunggu → diproses → selesai

---

## M10 — Verifikasi Akun Warga (Admin)

- Daftar permintaan verifikasi warga baru
- Detail: data akun + dokumen verifikasi
- Setujui / tolak verifikasi

---

## M11 — Manajemen Pengguna (Admin)

- Daftar semua user (role, status, email)
- Aktifkan / nonaktifkan akun
- Ubah role user
- Hapus akun

---

## M12 — Data Master (Admin)

- CRUD Wilayah (RT/RW/dusun)
- CRUD Kategori Aduan

---

## M13 — Konten Desa (Admin)

- CRUD artikel & pengumuman desa
- Ditampilkan di halaman informasi publik

---

## M14 — Informasi Desa (Publik)

- Daftar artikel/pengumuman
- Halaman detail artikel

---

## M15 — Buku Tamu

- Form buku tamu publik (tanpa login): nama, keperluan, nomor identitas, instansi
- Admin/staff: lihat semua entri, filter tanggal

---

## M16 — Pengaturan Sistem (Admin)

- Kop surat: nama desa, kecamatan, kabupaten, kode pos
- Data kop digunakan di semua header PDF surat
- Nama kecamatan dinamis di tanda tangan CAMAT

---

## M17 — Audit Log (Admin)

- Riwayat semua aktivitas penting (login, update status, hapus data)
- Filter berdasarkan waktu, user, tipe aksi

---

## M18 — Pengaturan Akun (Semua Role)

- Edit profil: nama, email, nomor telepon
- Ganti password
- Toggle dark/light mode

---

## M19 — Generate PDF Surat

- Preview HTML surat dari template blok sebelum disahkan
- PDF di-generate otomatis saat kepala desa mengesahkan
- Nomor surat otomatis: `[prefix]/[kode]/[bulan-romawi]/[tahun]`
- Substitusi variabel dari database penduduk & formulir input
- Kop surat dinamis dari `AppSetting`
- Download PDF oleh staff

---

## Ringkasan Status

| Modul | Status |
|---|---|
| M01 Autentikasi | ✅ |
| M02 Dashboard (4 role) | ✅ |
| M03 Data Kependudukan Warga | ✅ |
| M04 Form Pengajuan Warga | 🔧 Perlu penyesuaian |
| M05 Verifikasi Staff | ✅ |
| M06 Pengesahan Kepala Desa | ✅ |
| M07 Pantau Pengajuan Admin | ✅ |
| M08 Master Surat + Block Editor | ✅ |
| M09 Pengaduan | ✅ |
| M10 Verifikasi Akun Warga | ✅ |
| M11 Manajemen Pengguna | ✅ |
| M12 Data Master | ✅ |
| M13 Konten Desa | ✅ |
| M14 Informasi Publik | ✅ |
| M15 Buku Tamu | ✅ |
| M16 Pengaturan Sistem | ✅ |
| M17 Audit Log | ✅ |
| M18 Pengaturan Akun | ✅ |
| M19 Generate PDF | ✅ |
