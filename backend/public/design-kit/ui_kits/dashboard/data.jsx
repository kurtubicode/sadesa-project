// SADESA — fake demo data shared across role dashboards
const AVATAR_COLORS = [
  ['#ccfbf1','#0f766e'],['#dbeafe','#1d4ed8'],['#fef9c3','#a16207'],
  ['#fee2e2','#b91c1c'],['#e9d5ff','#7e22ce'],['#dcfce7','#15803d'],
];
function initials(name){return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}
function avatarColor(name){let s=0;for(const c of name)s+=c.charCodeAt(0);return AVATAR_COLORS[s%AVATAR_COLORS.length];}

const TODAY = 'Kamis, 4 Juni 2026';

// permohonan surat — shared list, statuses drive each role's view
const PERMOHONAN = [
  { id:'SR-2041', nama:'Siti Rohmah',     nik:'3273••••0042', jenis:'Surat Keterangan Domisili', tanggal:'04 Jun 2026', waktu:'08:14', status:'menunggu',     verifBy:null },
  { id:'AH-2040', nama:'Asep Hidayat',    nik:'3273••••1180', jenis:'SKTM',                      tanggal:'04 Jun 2026', waktu:'08:31', status:'diproses',     verifBy:null },
  { id:'DW-2039', nama:'Dewi Wulandari',  nik:'3273••••2207', jenis:'Surat Keterangan Usaha',    tanggal:'04 Jun 2026', waktu:'09:02', status:'terverifikasi', verifBy:'Budi Santoso' },
  { id:'RM-2038', nama:'Rudi Maulana',    nik:'3273••••3318', jenis:'Surat Pengantar KTP',       tanggal:'04 Jun 2026', waktu:'09:20', status:'terverifikasi', verifBy:'Budi Santoso' },
  { id:'NK-2037', nama:'Nani Kurnia',     nik:'3273••••4429', jenis:'Surat Keterangan Domisili', tanggal:'03 Jun 2026', waktu:'14:48', status:'selesai',      verifBy:'Budi Santoso' },
  { id:'EP-2036', nama:'Eko Prasetyo',    nik:'3273••••5530', jenis:'Surat Keterangan Kelahiran', tanggal:'03 Jun 2026', waktu:'13:10', status:'ditolak',      verifBy:'Budi Santoso' },
  { id:'LM-2035', nama:'Lina Marlina',    nik:'3273••••6641', jenis:'SKTM',                      tanggal:'03 Jun 2026', waktu:'11:25', status:'selesai',      verifBy:'Sri Lestari' },
];

const PENGADUAN = [
  { id:'P-118', judul:'Jalan rusak RT 03 / RW 02', kategori:'Infrastruktur', waktu:'41 mnt lalu', baru:true },
  { id:'P-117', judul:'Lampu jalan mati di Dusun Sukamaju', kategori:'Fasilitas Umum', waktu:'2 jam lalu', baru:true },
  { id:'P-116', judul:'Saluran air tersumbat depan balai', kategori:'Lingkungan', waktu:'5 jam lalu', baru:false },
];

const BUKU_TAMU = [
  { nama:'H. Sapari', tujuan:'Konsultasi sertifikat tanah', jam:'08:20', status:'selesai' },
  { nama:'Yuni Astuti', tujuan:'Legalisir surat', jam:'09:05', status:'hadir' },
  { nama:'Pak Camat', tujuan:'Kunjungan koordinasi', jam:'10:00', status:'hadir' },
];

const ACTIVITY = [
  { color:'var(--success)', title:'Surat Domisili disahkan', desc:'Kepala Desa menandatangani permohonan Siti Rohmah', time:'2 mnt lalu' },
  { color:'var(--info)',    title:'Pengajuan diverifikasi', desc:'Staff Budi memproses SKTM Asep Hidayat', time:'18 mnt lalu' },
  { color:'var(--warning)', title:'Pengaduan masuk', desc:'Laporan jalan rusak RT 03 / RW 02', time:'41 mnt lalu' },
  { color:'var(--danger)',  title:'Permohonan ditolak', desc:'Dokumen KK tidak terbaca — perlu unggah ulang', time:'1 jam lalu' },
  { color:'var(--info)',    title:'Akun warga baru', desc:'Registrasi warga an. Dewi Wulandari', time:'2 jam lalu' },
];

// chart data
const TREN_MINGGU = [ {d:'SEN',v:18}, {d:'SEL',v:24}, {d:'RAB',v:21}, {d:'KAM',v:32}, {d:'JUM',v:28}, {d:'SAB',v:12}, {d:'MIN',v:6} ];
const TREN_BULAN  = [ {d:'SEN',v:96}, {d:'SEL',v:120}, {d:'RAB',v:88}, {d:'KAM',v:142}, {d:'JUM',v:131}, {d:'SAB',v:54}, {d:'MIN',v:33} ];
const SURAT_JENIS = [
  {label:'Domisili', v:142}, {label:'SKTM', v:118}, {label:'Usaha', v:86}, {label:'Pengantar KTP', v:64}, {label:'Kelahiran', v:39},
];

const STATUS_META = {
  menunggu:     { label:'MENUNGGU',     bg:'var(--warn-bg)',    fg:'var(--warn-fg)' },
  diproses:     { label:'DIPROSES',     bg:'var(--info-bg)',    fg:'var(--info-fg)' },
  terverifikasi:{ label:'TERVERIFIKASI', bg:'var(--verify-bg)', fg:'var(--verify-fg)' },
  selesai:      { label:'SELESAI',      bg:'var(--success-bg)', fg:'var(--success-fg)' },
  ditolak:      { label:'DITOLAK',      bg:'var(--danger-bg)',  fg:'var(--danger-fg)' },
};

// ============ ADMIN PAGES ============

// Data Kependudukan
const PENDUDUK = [
  { no: 1, nik: '3271040508920001', nama: 'Ahmad Suhman',     jk: 'L', alamat: 'Jl. Melati No. 42, RT 003 / RW 001' },
  { no: 2, nik: '3271044410950003', nama: 'Siti Rahmawati',   jk: 'P', alamat: 'Gg. Damai VII, RT 001 / RW 005' },
  { no: 3, nik: '3271042101880004', nama: 'Bambang Pamungkas', jk: 'L', alamat: 'Perum Harapan Indah Blok C2, RT 012 / RW 008' },
  { no: 4, nik: '3271046512990001', nama: 'Dewi Lestari',     jk: 'P', alamat: 'Jl. Anggrek No. 15, RT 004 / RW 002' },
  { no: 5, nik: '3271040203850002', nama: 'Eko Nugroho',      jk: 'L', alamat: 'Jl. Veteran No. 88, RT 005 / RW 003' },
];

// Manajemen Wilayah — dusun with expandable RW
const WILAYAH = [
  { dusun: 'Dusun Karanganyar', kepala: 'Ahmad Fauzi', rw: '04 RW', rt: '12 RT', status: 'Aktif',
    children: [{ rw: 'RW 001', rt: '03 RT', status: 'VERIFIKASI' }, { rw: 'RW 002', rt: '03 RT', status: 'VERIFIKASI' }] },
  { dusun: 'Dusun Sukamaju', kepala: 'Siti Aminah', rw: '03 RW', rt: '09 RT', status: 'Aktif', children: [] },
  { dusun: 'Dusun Pasirjati', kepala: 'Bambang Susilo', rw: '05 RW', rt: '15 RT', status: 'Non-Aktif', children: [] },
];

// Manajemen Akun & Hak Akses
const PENGGUNA = [
  { nama: 'Ahmad Hidayat', id: '#882910', username: 'ahmad_hdy88',   role: 'Warga Tetap',     status: 'Aktif' },
  { nama: 'Siti Aminah',   id: '#882915', username: 'siti.aminah_02', role: 'Warga Tetap',     status: 'Terblokir' },
  { nama: 'Budi Santoso',  id: '#883021', username: 'budi_santoso',  role: 'Warga Sementara', status: 'Aktif' },
  { nama: 'Ratna Sari',    id: '#883045', username: 'ratna.sari90',  role: 'Warga Tetap',     status: 'Aktif' },
];

// Kategori Pengaduan
const KATEGORI = [
  { no: '01', nama: 'Infrastruktur',  icon: 'wrench',          bg: '#dbeafe', fg: '#1d4ed8', desc: 'Laporan mengenai kerusakan jalan, jembatan, drainase…', on: true },
  { no: '02', nama: 'Keamanan',       icon: 'shield',          bg: '#fee2e2', fg: '#b91c1c', desc: 'Gangguan ketertiban, tindakan kriminal, atau konflik…', on: true },
  { no: '03', nama: 'Kesehatan',      icon: 'shield-plus',     bg: '#dcfce7', fg: '#15803d', desc: 'Masalah layanan Posyandu, Puskesmas, wabah penyakit…', on: true },
  { no: '04', nama: 'Lingkungan',     icon: 'leaf',            bg: '#ffedd5', fg: '#c2410c', desc: 'Masalah sampah, polusi air/udara, penebangan liar…', on: false },
  { no: '05', nama: 'Layanan Publik', icon: 'headset',         bg: '#f3e8ff', fg: '#7e22ce', desc: 'Keluhan terkait birokrasi, perilaku perangkat desa…', on: true },
];

// Monitor Antrean
const ANTREAN = [
  { no: '#ANT-2024-001', nama: 'Ahmad Subarjo',    nik: '3275001201920003', layanan: 'Surat Keterangan Usaha',     waktu: '08:45 WIB', status: 'pending' },
  { no: '#ANT-2024-002', nama: 'Siti Khadijah',    nik: '3275004505950001', layanan: 'Surat Pengantar Nikah (N1)', waktu: '09:12 WIB', status: 'proses' },
  { no: '#ANT-2024-003', nama: 'Bambang Pamungkas', nik: '3275001006880004', layanan: 'Perubahan Kartu Keluarga',   waktu: '09:30 WIB', status: 'revisi' },
  { no: '#ANT-2024-004', nama: 'Dewi Widowati',    nik: '3275005510900002', layanan: 'Surat Keterangan Domisili',   waktu: '09:55 WIB', status: 'selesai' },
];
const ANTREAN_STATS = [
  { key: 'semua',   label: 'Semua Antrean', value: 128, dot: null },
  { key: 'pending', label: 'Pending', value: 24, dot: 'var(--warning)' },
  { key: 'proses',  label: 'Proses',  value: 42, dot: 'var(--info)' },
  { key: 'selesai', label: 'Selesai', value: 56, dot: 'var(--success)' },
  { key: 'revisi',  label: 'Revisi',  value: 6,  dot: 'var(--danger)' },
];
const ANTREAN_STATUS = {
  pending: { label: 'PENDING', bg: 'var(--warn-bg)', fg: 'var(--warn-fg)' },
  proses:  { label: 'PROSES',  bg: 'var(--info-bg)', fg: 'var(--info-fg)' },
  revisi:  { label: 'REVISI',  bg: 'var(--revisi-bg)', fg: 'var(--revisi-fg)' },
  selesai: { label: 'SELESAI', bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
};

// Riwayat Kunjungan
const KUNJUNGAN = [
  { nama: 'Ahmad Ridwan',  asal: 'Dusun Krajan RT 02/04',  tujuan: 'Pengurusan Surat Keterangan',   kat: 'Layanan Administrasi', katBg: '#dcfce7', katFg: '#15803d', loket: 'Loket 1 (Umum)',  jam: '08:45 WIB' },
  { nama: 'Siti Nurhaliza', asal: 'Dusun Mentari RT 01/01', tujuan: 'Konsultasi Program BLT Dana',    kat: 'Kesejahteraan', katBg: '#fef9c3', katFg: '#a16207', loket: 'Ruang Kades',     jam: '09:12 WIB' },
  { nama: 'Budi Pratama',  asal: 'Dusun Sawah RT 05/02',   tujuan: 'Pengambilan Akta Kelahiran',     kat: 'Capil', katBg: '#dcfce7', katFg: '#15803d', loket: 'Loket 2 (Capil)', jam: '10:05 WIB' },
  { nama: 'Dewi Kusuma',   asal: 'Perum Desa Indah No. 12', tujuan: 'Laporan Gangguan Keamanan',     kat: 'Aduan', katBg: '#fee2e2', katFg: '#b91c1c', loket: 'Ruang Kamtib',    jam: '10:45 WIB' },
  { nama: 'Heri Munandar', asal: 'Dusun Barat RT 09/03',   tujuan: 'Pendaftaran Sertifikat Tanah',   kat: 'Pertanahan', katBg: '#dbeafe', katFg: '#1d4ed8', loket: 'Loket 3 (Tanah)', jam: '11:15 WIB' },
];

// Audit Log
const AUDIT = [
  { aksi: 'HAPUS',   aksiBg: 'var(--danger-bg)', aksiFg: 'var(--danger-fg)',   judul: 'Penghapusan Data Penduduk', detail: 'ID: #3210-9981-221 · Nama: Budi Santoso', operator: 'Ahmad Subardjo', tgl: '12 Okt 2023', jam: '14:22:15 WIB', ip: '192.168.1.124' },
  { aksi: 'BUAT',    aksiBg: 'var(--success-bg)', aksiFg: 'var(--success-fg)', judul: 'Penerbitan Surat Keterangan Usaha', detail: 'Nomor: 503/12/Desa-2023', operator: 'Siti Rahayu', tgl: '12 Okt 2023', jam: '11:05:40 WIB', ip: '10.0.4.88' },
  { aksi: 'PERBARUI', aksiBg: 'var(--warn-bg)', aksiFg: 'var(--warn-fg)',      judul: 'Update Profil Wilayah RT 04', detail: 'Perubahan data batas wilayah geografis', operator: 'Suryo Utomo', tgl: '12 Okt 2023', jam: '09:12:02 WIB', ip: '36.12.89.24' },
  { aksi: 'BUAT',    aksiBg: 'var(--success-bg)', aksiFg: 'var(--success-fg)', judul: 'Upload Berita Desa Baru', detail: 'Judul: Penyaluran BLT Dana Desa Tahap IV', operator: 'Indah Permata', tgl: '11 Okt 2023', jam: '16:55:20 WIB', ip: '192.168.1.105' },
];

// Manajemen Berita
const BERITA = [
  { status: 'DITERBITKAN', kategori: 'KEGIATAN',     tanggal: '12 Okt 2025', judul: 'Festival Budaya Desa 2023: Merajut Tradisi di Era Digital', excerpt: 'Perayaan tahunan desa kali ini…', author: 'Admin Budi', views: '1.2K', comments: 24, hue: 200 },
  { status: 'DRAFT',       kategori: 'INFRASTRUKTUR', tanggal: '10 Okt 2023', judul: 'Pembangunan Jembatan Penghubung Dusun Cempaka Rampung 90%', excerpt: 'Proyek strategis desa yang bertujuan…', author: 'Siti Aminah', views: '0', comments: 0, hue: 210 },
  { status: 'DITERBITKAN', kategori: 'KESEHATAN',    tanggal: '08 Okt 2023', judul: 'Program Posyandu Lansia: Pemeriksaan Kesehatan Gratis', excerpt: 'Upaya desa dalam menjaga kualitas…', author: 'SADESA Admin', views: '3.4K', comments: 102, hue: 160 },
  { status: 'DITERBITKAN', kategori: 'LINGKUNGAN',   tanggal: '05 Okt 2023', judul: 'Menuju Desa Mandiri Sampah: Inovasi Bank Sampah Digital', excerpt: 'Sistem pengelolaan limbah rumah tangga…', author: 'Admin Reza', views: '856', comments: 0, hue: 110 },
];
const BERITA_PENTING = {
  judul: 'Jadwal Penyaluran BLT Dana Desa Tahap IV Bulan Oktober',
  isi: 'Daftar penerima manfaat dan persyaratan pengambilan dana bantuan untuk seluruh RT/RW di wilayah Desa Digital.',
  tgl: '15', bln: 'OKT',
};

// Broadcast WhatsApp
const BROADCAST = [
  { tgl: '12 Okt 2023', jam: '09:15 WIB', target: 'Warga RW 04',   targetBg: '#e0e7ff', targetFg: '#4338ca', pesan: 'Pengumuman kerja bakti serentak untuk membersihkan…', terkirim: '156 / 156', status: 'selesai' },
  { tgl: '11 Okt 2023', jam: '14:00 WIB', target: 'Penerima BLT',  targetBg: '#e0e7ff', targetFg: '#4338ca', pesan: 'Informasi pengambilan bantuan langsung tunai di Balai…', terkirim: '312 / 312', status: 'selesai' },
  { tgl: 'Jadwal: 15 Okt', jam: '08:00 WIB', target: 'Seluruh Warga', targetBg: '#e0e7ff', targetFg: '#4338ca', pesan: 'Undangan memperingati Hari Jadi Desa ke-102…', terkirim: '0 / 3,420', status: 'terjadwal' },
];

// Form Builder components palette
const SURAT_KOMPONEN = [
  { icon: 'type', label: 'Input Teks', sub: 'TEXT FIELD' },
  { icon: 'hash', label: 'Input Angka', sub: 'NUMBER INPUT' },
  { icon: 'calendar', label: 'Pilih Tanggal', sub: 'DATE PICKER' },
  { icon: 'list', label: 'Dropdown Menu', sub: 'SELECT OPTION' },
  { icon: 'upload', label: 'Unggah Berkas', sub: 'FILE UPLOAD' },
  { icon: 'pen-tool', label: 'Tanda Tangan', sub: 'E-SIGNATURE' },
];

// ============ STAFF PAGES DATA ============
const STAF_ANTREAN = [
  { waktu: '08:45 WIB', no: '#ANT-2410-001', nama: 'Budi Santoso',  nik: '3273***********', jenis: 'Surat Keterangan Usaha', status: 'menunggu' },
  { waktu: '09:12 WIB', no: '#ANT-2410-002', nama: 'Siti Aminah',   nik: '3273***********', jenis: 'Surat Pengantar Nikah', status: 'menunggu' },
  { waktu: '09:45 WIB', no: '#ANT-2410-003', nama: 'Rahmat Hidayat', nik: '3273***********', jenis: 'Surat Domisili', status: 'revisi' },
  { waktu: '10:02 WIB', no: '#ANT-2410-004', nama: 'Nani Kurnia',   nik: '3273***********', jenis: 'SKTM', status: 'menunggu' },
  { waktu: '10:24 WIB', no: '#ANT-2410-005', nama: 'Eko Prasetyo',  nik: '3273***********', jenis: 'Surat Keterangan Kelahiran', status: 'menunggu' },
];

const SURAT_CETAK = [
  { nama: 'Ahmad Subarjo',  nik: '3201234567890001', jenis: 'Surat Keterangan Usaha (SKU)', no: '#REQ-2023-1001' },
  { nama: 'Siti Rahmawati', nik: '3201234567890005', jenis: 'SK Domisili (SKP)',            no: '#REQ-2023-1004' },
  { nama: 'Dedi Prayoga',   nik: '3201234567890012', jenis: 'Surat Pengantar Nikah',        no: '#REQ-2023-0988' },
  { nama: 'Maya Wijaya',    nik: '3201234567890045', jenis: 'Surat Keterangan Tidak Mampu', no: '#REQ-2023-1102' },
  { nama: 'Hendra Gunawan', nik: '3201234567890067', jenis: 'Surat Keterangan Usaha (SKU)', no: '#REQ-2023-1108' },
];

const LOKET_FILES = [
  { nama: 'KTP_ASLI.jpg', size: '1.2 MB' },
  { nama: 'KK_ASLI.pdf',  size: '2.8 MB' },
];

const PENGADUAN_TIKET = {
  id: '#LPR-2023-0824', status: 'Sedang Diproses', kategori: 'INFRASTRUKTUR',
  pelapor: 'Bambang Wijaya', tanggal: '24 Agustus 2023, 09:15 WIB',
  lokasi: 'RT 04 / RW 02, Jalan Melati Blok C (Dekat Pos Ronda)',
  deskripsi: 'Selamat pagi Bapak/Ibu Admin Desa. Saya ingin melaporkan adanya jalan rusak parah di depan Pos Ronda RT 04. Kedalaman lubang sudah cukup membahayakan pengendara motor, apalagi kalau malam hari karena lampunya sering mati. Mohon segera ditindaklanjuti sebelum ada korban jatuh. Terima kasih.',
};

// ============ KEPALA DESA PAGES DATA ============
const KADES_TREN = {
  keterangan: [ {d:'JAN',v:28}, {d:'FEB',v:36}, {d:'MAR',v:30}, {d:'APR',v:58}, {d:'MEI',v:64}, {d:'JUN',v:78} ],
  umum:       [ {d:'JAN',v:14}, {d:'FEB',v:20}, {d:'MAR',v:18}, {d:'APR',v:34}, {d:'MEI',v:40}, {d:'JUN',v:52} ],
};
const KADES_PENGADUAN = [
  { label: 'Infrastruktur', v: 45, color: '#2563eb' },
  { label: 'Sosial',        v: 25, color: '#16a34a' },
  { label: 'Keamanan',      v: 20, color: '#ea9a16' },
  { label: 'Lainnya',       v: 10, color: '#dc2626' },
];
const KADES_ANTREAN = [
  { tipe: 'SKU',  nama: 'Ahmad Subarjo',  jenis: 'Surat Keterangan Usaha',  waktu: '2 jam lalu',  verified: true, active: true,
    nik: '3204123456780001', ttl: 'Bandung, 12-05-1992', jk: 'Laki-laki', pekerjaan: 'Wiraswasta', agama: 'Islam', status: 'Kawin',
    alamat: 'Dusun II RT 03 RW 08 Desa Cimekar', wa: '0812-3456-7890', keperluan: 'Pengajuan Kredit Usaha Rakyat (KUR)', verifBy: 'Budi Santoso' },
  { tipe: 'SKP',  nama: 'Siti Rahmawati', jenis: 'Surat Keterangan Pindah', waktu: '4 jam lalu',  verified: true,
    nik: '3204126609940003', ttl: 'Garut, 26-09-1994', jk: 'Perempuan', pekerjaan: 'Karyawan Swasta', agama: 'Islam', status: 'Belum Kawin',
    alamat: 'Dusun I RT 01 RW 05 Desa Cimekar', wa: '0813-2210-5566', keperluan: 'Pindah domisili ke Kota Bandung', verifBy: 'Sri Lestari' },
  { tipe: 'SKTM', nama: 'Budi Hartanto',  jenis: 'S.K. Tidak Mampu',        waktu: '5 jam lalu',  verified: true,
    nik: '3204120311850007', ttl: 'Bandung, 03-11-1985', jk: 'Laki-laki', pekerjaan: 'Buruh Harian', agama: 'Islam', status: 'Kawin',
    alamat: 'Dusun III RT 02 RW 09 Desa Cimekar', wa: '0857-9911-2030', keperluan: 'Keringanan biaya sekolah anak', verifBy: 'Budi Santoso' },
  { tipe: 'SKU',  nama: 'Diana Lestari',  jenis: 'Surat Keterangan Usaha',  waktu: 'Kemarin',     verified: true,
    nik: '3204125504960002', ttl: 'Bandung, 15-04-1996', jk: 'Perempuan', pekerjaan: 'Pedagang', agama: 'Islam', status: 'Belum Kawin',
    alamat: 'Dusun II RT 04 RW 08 Desa Cimekar', wa: '0822-7788-1122', keperluan: 'Pengajuan pinjaman modal usaha', verifBy: 'Sri Lestari' },
];
const KADES_PREVIEW = [
  { tgl: '12 Jan 2025', jenis: 'Surat Keterangan Usaha', status: 'selesai', jumlah: 42 },
  { tgl: '14 Jan 2025', jenis: 'SKTM',                   status: 'proses',  jumlah: 18 },
  { tgl: '15 Jan 2025', jenis: 'Surat Keterangan Pindah', status: 'selesai', jumlah: 27 },
];

// conventional monthly report content
const LAPORAN_REKAP_SURAT = [
  { no: 1, jenis: 'Surat Keterangan Usaha (SKU)',      masuk: 48, selesai: 45, tolak: 3 },
  { no: 2, jenis: 'Surat Keterangan Tidak Mampu (SKTM)', masuk: 31, selesai: 29, tolak: 2 },
  { no: 3, jenis: 'Surat Keterangan Domisili (SKP)',   masuk: 26, selesai: 26, tolak: 0 },
  { no: 4, jenis: 'Surat Pengantar Nikah (N1-N4)',     masuk: 17, selesai: 16, tolak: 1 },
  { no: 5, jenis: 'Surat Keterangan Kelahiran',        masuk: 12, selesai: 12, tolak: 0 },
  { no: 6, jenis: 'Lain-lain',                         masuk: 9,  selesai: 8,  tolak: 1 },
];
const LAPORAN_PENGADUAN = [
  { no: 1, kategori: 'Infrastruktur', masuk: 14, selesai: 11, proses: 3 },
  { no: 2, kategori: 'Sosial',        masuk: 8,  selesai: 8,  proses: 0 },
  { no: 3, kategori: 'Keamanan',      masuk: 6,  selesai: 5,  proses: 1 },
  { no: 4, kategori: 'Lainnya',       masuk: 4,  selesai: 4,  proses: 0 },
];
// extra detail/rincian for the on-screen report breakdown
const LAPORAN_HARIAN = [ {d:'Minggu 1',v:34}, {d:'Minggu 2',v:41}, {d:'Minggu 3',v:38}, {d:'Minggu 4',v:30} ];
const LAPORAN_PETUGAS = [
  { nama: 'Budi Santoso',  diproses: 58, rata: '1,2 hari' },
  { nama: 'Sri Lestari',   diproses: 44, rata: '1,5 hari' },
  { nama: 'Ahmad Fauzi',   diproses: 41, rata: '1,3 hari' },
];
const LAPORAN_KEUANGAN = [
  { label: 'PAD Retribusi Surat', value: 'Rp 4.290.000', sub: '143 transaksi tercatat' },
  { label: 'Realisasi Anggaran',  value: '68%', sub: 'Rp 34,2 jt / Rp 50 jt' },
];

Object.assign(window, { KADES_TREN, KADES_PENGADUAN, KADES_ANTREAN, KADES_PREVIEW, LAPORAN_REKAP_SURAT, LAPORAN_PENGADUAN, LAPORAN_HARIAN, LAPORAN_PETUGAS, LAPORAN_KEUANGAN });
