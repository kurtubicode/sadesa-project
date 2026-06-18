<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.5; }

  .kop { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #0d9488; padding-bottom: 10px; margin-bottom: 10px; }
  .kop-text { flex: 1; }
  .kop-text h1 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .kop-text p  { font-size: 10px; color: #555; }

  .judul-laporan { text-align: center; margin: 16px 0 12px; }
  .judul-laporan h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .judul-laporan p  { font-size: 10px; color: #666; margin-top: 2px; }

  .ringkasan { display: flex; gap: 8px; margin-bottom: 14px; }
  .stat-box  { flex: 1; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; text-align: center; background: #f9fafb; }
  .stat-box .num { font-size: 20px; font-weight: 700; color: #0d9488; }
  .stat-box .lbl { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px; }

  .section-title { font-size: 11px; font-weight: 700; color: #0d9488; border-bottom: 1px solid #d1fae5; padding-bottom: 4px; margin: 14px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th { background: #0d9488; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
  td { padding: 5px 8px; font-size: 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  tr:nth-child(even) td { background: #f9fafb; }

  .badge { display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 9px; font-weight: 700; }
  .badge-selesai  { background: #d1fae5; color: #065f46; }
  .badge-menunggu { background: #fef3c7; color: #92400e; }
  .badge-diproses { background: #dbeafe; color: #1e40af; }
  .badge-ditolak  { background: #fee2e2; color: #991b1b; }
  .badge-lain     { background: #f3f4f6; color: #374151; }

  .ttd-area { margin-top: 32px; display: flex; justify-content: flex-end; }
  .ttd-box  { text-align: center; width: 200px; }
  .ttd-box .ttd-nama { margin-top: 60px; border-top: 1px solid #374151; padding-top: 4px; font-weight: 700; font-size: 10px; }
  .ttd-box .ttd-nip  { font-size: 9px; color: #6b7280; }

  .footer { margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 6px; font-size: 9px; color: #9ca3af; text-align: center; }
  .no-data { text-align: center; color: #9ca3af; font-style: italic; padding: 12px 0; }
</style>
</head>
<body>

{{-- KOP SURAT --}}
<div class="kop">
  <div class="kop-text">
    <h1>{{ $appSetting['nama_desa'] ?? 'Desa Cirangkong' }}</h1>
    <p>{{ $appSetting['alamat'] ?? 'Kec. Cijambe, Kab. Subang, Jawa Barat' }}</p>
    <p>Telp: {{ $appSetting['telepon'] ?? '-' }} &nbsp;|&nbsp; Email: {{ $appSetting['email'] ?? '-' }}</p>
  </div>
</div>

{{-- JUDUL --}}
<div class="judul-laporan">
  <h2>Laporan Bulanan Pelayanan Desa</h2>
  <p>Periode: {{ $periode->locale('id')->isoFormat('MMMM YYYY') }}</p>
</div>

{{-- RINGKASAN --}}
<div class="ringkasan">
  <div class="stat-box">
    <div class="num">{{ $total }}</div>
    <div class="lbl">Total Pengajuan</div>
  </div>
  <div class="stat-box">
    <div class="num">{{ $selesai }}</div>
    <div class="lbl">Selesai</div>
  </div>
  <div class="stat-box">
    <div class="num">{{ $statusCount->get('menunggu_pengesahan', 0) + $statusCount->get('diproses', 0) + $statusCount->get('menunggu', 0) }}</div>
    <div class="lbl">Proses</div>
  </div>
  <div class="stat-box">
    <div class="num">{{ $total > 0 ? round(($selesai / $total) * 100) : 0 }}%</div>
    <div class="lbl">Tingkat Selesai</div>
  </div>
  <div class="stat-box">
    <div class="num">{{ $pengaduan->count() }}</div>
    <div class="lbl">Pengaduan</div>
  </div>
</div>

{{-- PENGAJUAN SURAT --}}
<div class="section-title">Daftar Pengajuan Surat</div>
@if($pengajuan->isEmpty())
  <p class="no-data">Tidak ada data pengajuan pada periode ini.</p>
@else
<table>
  <thead>
    <tr>
      <th style="width:30px">No</th>
      <th style="width:130px">No. Pengajuan</th>
      <th>Nama Pemohon</th>
      <th>Jenis Surat</th>
      <th style="width:80px">Tanggal</th>
      <th style="width:80px">Status</th>
    </tr>
  </thead>
  <tbody>
    @foreach($pengajuan as $i => $p)
    <tr>
      <td>{{ $i + 1 }}</td>
      <td style="font-family: monospace; font-size: 9px;">{{ $p->no_pengajuan }}</td>
      <td>{{ $p->user?->name ?? '—' }}</td>
      <td>{{ $p->masterSurat?->nama_surat ?? '—' }}</td>
      <td>{{ $p->created_at->format('d/m/Y') }}</td>
      <td>
        @php
          $badgeClass = match($p->status) {
            'selesai'  => 'badge-selesai',
            'menunggu' => 'badge-menunggu',
            'diproses','diverifikasi','menunggu_pengesahan','disetujui','siap_diambil' => 'badge-diproses',
            'ditolak_staff','ditolak_kepala','dibatalkan' => 'badge-ditolak',
            default    => 'badge-lain',
          };
          $statusLabel = [
            'menunggu' => 'Menunggu', 'diproses' => 'Diproses',
            'diverifikasi' => 'Diverifikasi', 'menunggu_pengesahan' => 'Menunggu Sahkan',
            'disetujui' => 'Disetujui', 'siap_diambil' => 'Siap Diambil',
            'selesai' => 'Selesai', 'ditolak_staff' => 'Ditolak Staff',
            'ditolak_kepala' => 'Ditolak Kades', 'dibatalkan' => 'Dibatalkan',
          ][$p->status] ?? $p->status;
        @endphp
        <span class="badge {{ $badgeClass }}">{{ $statusLabel }}</span>
      </td>
    </tr>
    @endforeach
  </tbody>
</table>
@endif

{{-- PENGADUAN --}}
<div class="section-title">Daftar Pengaduan Warga</div>
@if($pengaduan->isEmpty())
  <p class="no-data">Tidak ada data pengaduan pada periode ini.</p>
@else
<table>
  <thead>
    <tr>
      <th style="width:30px">No</th>
      <th>Pelapor</th>
      <th>Judul Pengaduan</th>
      <th style="width:80px">Kategori</th>
      <th style="width:80px">Tanggal</th>
      <th style="width:70px">Status</th>
    </tr>
  </thead>
  <tbody>
    @foreach($pengaduan as $i => $a)
    <tr>
      <td>{{ $i + 1 }}</td>
      <td>{{ $a->user?->name ?? '—' }}</td>
      <td>{{ $a->judul }}</td>
      <td>{{ $a->kategori?->nama_kategori ?? '—' }}</td>
      <td>{{ $a->created_at->format('d/m/Y') }}</td>
      <td>
        @php
          $bc = match($a->status) { 'selesai' => 'badge-selesai', 'menunggu' => 'badge-menunggu', 'diproses' => 'badge-diproses', default => 'badge-lain' };
        @endphp
        <span class="badge {{ $bc }}">{{ ucfirst($a->status) }}</span>
      </td>
    </tr>
    @endforeach
  </tbody>
</table>
@endif

{{-- TTD --}}
<div class="ttd-area">
  <div class="ttd-box">
    <p>Cirangkong, {{ now()->locale('id')->isoFormat('D MMMM YYYY') }}</p>
    <p>Kepala Desa Cirangkong</p>
    <div class="ttd-nama">{{ $appSetting['nama_kades'] ?? 'Kepala Desa' }}</div>
    <div class="ttd-nip">Kepala Desa</div>
  </div>
</div>

<div class="footer">
  Laporan ini dicetak otomatis oleh Sistem SADESA — {{ now()->format('d/m/Y H:i') }} WIB
</div>
</body>
</html>
