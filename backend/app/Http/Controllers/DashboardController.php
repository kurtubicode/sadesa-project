<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\BukuTamu;
use App\Models\KontenDesa;
use App\Models\MasterSurat;
use App\Models\Penduduk;
use App\Models\Ulasan;
use App\Models\Pengaduan;
use App\Models\PengajuanSurat;
use App\Models\User;
use App\Models\VerifikasiWarga;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return match ($user->role) {
            'admin'       => $this->admin($request),
            'kepala_desa' => $this->kepalaDesa($request),
            'staff'       => $this->staff($request),
            default       => $this->warga($request),
        };
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    private function admin(Request $request): Response
    {
        $totalUsers          = User::count();
        $totalPengajuan      = PengajuanSurat::count();
        $pengajuanHariIni    = PengajuanSurat::whereDate('created_at', today())->count();
        $pengaduanBaru       = Pengaduan::where('status', 'menunggu')->count();
        $verifikasiMenunggu  = VerifikasiWarga::where('status', 'menunggu')->count();
        $penggunaBulanIni    = User::whereMonth('created_at', now()->month)
                                    ->whereYear('created_at', now()->year)
                                    ->count();

        // Chart: pengajuan per hari 7 hari terakhir
        $chartMingguan = collect(range(6, 0))->map(function (int $daysAgo) {
            $date = now()->subDays($daysAgo);
            return [
                'label'  => strtoupper($date->locale('id')->isoFormat('ddd')),
                'jumlah' => PengajuanSurat::whereDate('created_at', $date)->count(),
            ];
        })->values();

        $recentLogs = AuditLog::with('user:id,name')
            ->latest()
            ->take(5)
            ->get(['id', 'user_id', 'action', 'model', 'created_at']);

        $recentPengajuan = PengajuanSurat::with([
                'user:id,name,nik',
                'masterSurat:id,nama_surat',
            ])
            ->latest()
            ->take(5)
            ->get(['id', 'user_id', 'master_surat_id', 'status', 'created_at']);

        $totalPenduduk = Penduduk::count();
        $totalWarga    = User::where('role', 'warga')->count();

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'total_penduduk'          => $totalPenduduk,
                'total_warga'             => $totalWarga,
                'total_users'             => $totalUsers,
                'total_pengajuan'         => $totalPengajuan,
                'pengajuan_hari_ini'      => $pengajuanHariIni,
                'pengaduan_baru'          => $pengaduanBaru,
                'verifikasi_menunggu'     => $verifikasiMenunggu,
                'pengguna_baru_bulan_ini' => $penggunaBulanIni,
            ],
            'chart_mingguan'  => $chartMingguan,
            'recent_logs'     => $recentLogs,
            'recent_pengajuan' => $recentPengajuan,
        ]);
    }

    // ─── Kepala Desa ──────────────────────────────────────────────────────────

    private function kepalaDesa(Request $request): Response
    {
        $totalPengajuan     = PengajuanSurat::count();
        $menungguPengesahan = PengajuanSurat::where('status', 'menunggu_pengesahan')->count();

        // "Disahkan bulan ini" = semua yang sudah melewati tahap pengesahan
        $disahkanBulanIni = PengajuanSurat::whereIn('status', ['disetujui', 'siap_diambil', 'selesai'])
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        $ditolakBulanIni = PengajuanSurat::where('status', 'ditolak_kepala')
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        $selesaiBulanIni = PengajuanSurat::where('status', 'selesai')
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        $totalWarga = User::where('role', 'warga')->count();

        $pengaduanSelesaiBulanIni = Pengaduan::where('status', 'selesai')
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        // Hanya pengajuan menunggu pengesahan — untuk tabel aksi kades
        $menungguPengesahanList = PengajuanSurat::with(['user:id,name', 'masterSurat:id,nama_surat'])
            ->where('status', 'menunggu_pengesahan')
            ->oldest()
            ->take(10)
            ->get(['id', 'no_pengajuan', 'user_id', 'master_surat_id', 'status', 'created_at']);

        // Top 5 jenis surat bulan ini (untuk bar chart)
        $chartJenisSurat = MasterSurat::withCount([
                'pengajuanSurat as jumlah' => fn ($q) => $q
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year),
            ])
            ->orderByDesc('jumlah')
            ->take(5)
            ->get(['id', 'nama_surat'])
            ->map(fn ($m) => ['label' => $m->nama_surat, 'jumlah' => $m->jumlah]);

        $totalBulanIni   = PengajuanSurat::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $tingkatSelesai  = $totalBulanIni > 0 ? round(($selesaiBulanIni / $totalBulanIni) * 100) : 0;
        $jenisTerbanyak  = $chartJenisSurat->first()['label'] ?? '—';

        // Breakdown status pipeline bulan ini
        $statusBreakdown = collect([
            ['label' => 'Menunggu',       'status' => 'menunggu',            'tone' => 'yellow'],
            ['label' => 'Diproses',       'status' => 'diproses',            'tone' => 'blue'],
            ['label' => 'Diverifikasi',   'status' => 'diverifikasi',        'tone' => 'purple'],
            ['label' => 'Menunggu Sahkan','status' => 'menunggu_pengesahan', 'tone' => 'orange'],
            ['label' => 'Disetujui',      'status' => 'disetujui',           'tone' => 'teal'],
            ['label' => 'Selesai',        'status' => 'selesai',             'tone' => 'green'],
            ['label' => 'Ditolak',        'status' => 'ditolak_kepala',      'tone' => 'red'],
        ])->map(fn ($s) => [
            'label'  => $s['label'],
            'tone'   => $s['tone'],
            'jumlah' => PengajuanSurat::where('status', $s['status'])
                ->whereMonth('updated_at', now()->month)
                ->whereYear('updated_at', now()->year)
                ->count(),
        ])->values();

        // Trend 6 bulan terakhir
        $trendBulanan = collect(range(5, 0))->map(function ($ago) {
            $d = now()->subMonths($ago);
            return [
                'label'   => $d->locale('id')->isoFormat('MMM YY'),
                'masuk'   => PengajuanSurat::whereMonth('created_at', $d->month)->whereYear('created_at', $d->year)->count(),
                'selesai' => PengajuanSurat::where('status', 'selesai')->whereMonth('updated_at', $d->month)->whereYear('updated_at', $d->year)->count(),
            ];
        })->values();

        return Inertia::render('dashboard/kepala-desa', [
            'stats' => [
                'menunggu_pengesahan'        => $menungguPengesahan,
                'disahkan_bulan_ini'         => $disahkanBulanIni,
                'pengaduan_selesai_bulan_ini'=> $pengaduanSelesaiBulanIni,
                'total_warga'                => $totalWarga,
                'selesai_bulan_ini'          => $selesaiBulanIni,
                'ditolak_bulan_ini'          => $ditolakBulanIni,
            ],
            'menunggu_pengesahan_list' => $menungguPengesahanList,
            'chart_jenis_surat'        => $chartJenisSurat,
            'status_breakdown'         => $statusBreakdown,
            'trend_bulanan'            => $trendBulanan,
            'ringkasan' => [
                'jenis_terbanyak'      => $jenisTerbanyak,
                'tingkat_penyelesaian' => $tingkatSelesai,
                'total_bulan_ini'      => $totalBulanIni,
            ],
        ]);
    }

    // ─── Kepala Desa — Penilaian Layanan ─────────────────────────────────────

    public function penilaianLayanan(Request $request): Response
    {
        $q = Ulasan::with([
            'user:id,name',
            'pengajuan:id,no_pengajuan,master_surat_id',
            'pengajuan.masterSurat:id,nama_surat',
        ])->latest();

        if ($request->filled('rating')) {
            $q->where('rating', $request->rating);
        }

        $ulasan = $q->paginate(15)->withQueryString();

        $stats = [
            'total'        => Ulasan::count(),
            'rata_rata'    => round(Ulasan::avg('rating') ?? 0, 1),
            'bintang5'     => Ulasan::where('rating', 5)->count(),
            'bintang4'     => Ulasan::where('rating', 4)->count(),
            'bintang3'     => Ulasan::where('rating', 3)->count(),
            'bintang2'     => Ulasan::where('rating', 2)->count(),
            'bintang1'     => Ulasan::where('rating', 1)->count(),
        ];

        return Inertia::render('kepala-desa/ulasan', [
            'ulasan' => $ulasan,
            'stats'  => $stats,
            'filter' => ['rating' => $request->rating],
        ]);
    }

    // ─── Kepala Desa — Statistik Layanan (halaman terpisah) ──────────────────

    public function statistikLayanan(): Response
    {
        // Trend 12 bulan
        $trend = collect(range(11, 0))->map(function ($ago) {
            $d = now()->subMonths($ago);
            return [
                'label'   => $d->locale('id')->isoFormat('MMM YY'),
                'masuk'   => PengajuanSurat::whereMonth('created_at', $d->month)->whereYear('created_at', $d->year)->count(),
                'selesai' => PengajuanSurat::where('status', 'selesai')->whereMonth('updated_at', $d->month)->whereYear('updated_at', $d->year)->count(),
                'ditolak' => PengajuanSurat::whereIn('status', ['ditolak_staff', 'ditolak_kepala'])->whereMonth('updated_at', $d->month)->whereYear('updated_at', $d->year)->count(),
            ];
        })->values();

        // Breakdown status keseluruhan (all-time)
        $statusBreakdown = collect([
            ['label' => 'Menunggu',           'status' => 'menunggu',            'tone' => 'yellow'],
            ['label' => 'Diproses',           'status' => 'diproses',            'tone' => 'blue'],
            ['label' => 'Diverifikasi',       'status' => 'diverifikasi',        'tone' => 'purple'],
            ['label' => 'Menunggu Pengesahan','status' => 'menunggu_pengesahan', 'tone' => 'orange'],
            ['label' => 'Disetujui',          'status' => 'disetujui',           'tone' => 'teal'],
            ['label' => 'Siap Diambil',       'status' => 'siap_diambil',        'tone' => 'teal'],
            ['label' => 'Selesai',            'status' => 'selesai',             'tone' => 'green'],
            ['label' => 'Ditolak Staff',      'status' => 'ditolak_staff',       'tone' => 'red'],
            ['label' => 'Ditolak Kades',      'status' => 'ditolak_kepala',      'tone' => 'red'],
            ['label' => 'Dibatalkan',         'status' => 'dibatalkan',          'tone' => 'red'],
        ])->map(fn ($s) => [
            'label'  => $s['label'],
            'tone'   => $s['tone'],
            'jumlah' => PengajuanSurat::where('status', $s['status'])->count(),
        ])->values();

        // Top 10 jenis surat all-time
        $topJenisSurat = MasterSurat::withCount('pengajuanSurat as jumlah')
            ->orderByDesc('jumlah')
            ->take(10)
            ->get(['id', 'nama_surat'])
            ->map(fn ($m) => ['label' => $m->nama_surat, 'jumlah' => $m->jumlah])
            ->values();

        // Statistik ringkas
        $total      = PengajuanSurat::count();
        $selesai    = PengajuanSurat::where('status', 'selesai')->count();
        $pending    = PengajuanSurat::whereIn('status', ['menunggu', 'diproses', 'diverifikasi', 'menunggu_pengesahan'])->count();
        $ditolak    = PengajuanSurat::whereIn('status', ['ditolak_staff', 'ditolak_kepala', 'dibatalkan'])->count();
        $bulanIni   = PengajuanSurat::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $tingkat    = $total > 0 ? round(($selesai / $total) * 100) : 0;

        return Inertia::render('kepala-desa/statistik', [
            'trend'           => $trend,
            'status_breakdown'=> $statusBreakdown,
            'top_jenis_surat' => $topJenisSurat,
            'ringkasan' => [
                'total'       => $total,
                'selesai'     => $selesai,
                'pending'     => $pending,
                'ditolak'     => $ditolak,
                'bulan_ini'   => $bulanIni,
                'tingkat_selesai' => $tingkat,
            ],
        ]);
    }

    // ─── Kepala Desa — Laporan Bulanan PDF ───────────────────────────────────

    public function laporanBulanan(Request $request)
    {
        $bulan = (int) $request->input('bulan', now()->month);
        $tahun = (int) $request->input('tahun', now()->year);

        $periode = \Carbon\Carbon::createFromDate($tahun, $bulan, 1);

        $pengajuan = PengajuanSurat::with(['user:id,name,nik', 'masterSurat:id,nama_surat'])
            ->whereMonth('created_at', $bulan)
            ->whereYear('created_at', $tahun)
            ->orderBy('created_at')
            ->get();

        $statusCount = $pengajuan->groupBy('status')->map->count();
        $selesai     = $statusCount->get('selesai', 0);
        $total       = $pengajuan->count();

        $pengaduan = Pengaduan::with(['user:id,name', 'kategori:id,nama_kategori'])
            ->whereMonth('created_at', $bulan)
            ->whereYear('created_at', $tahun)
            ->orderBy('created_at')
            ->get();

        $appSetting = \App\Models\AppSetting::allAsArray();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('laporan.bulanan', compact(
            'pengajuan', 'pengaduan', 'statusCount', 'selesai', 'total', 'periode', 'appSetting'
        ))->setPaper('a4', 'portrait');

        $filename = "Laporan_Bulanan_{$periode->format('Y_m')}.pdf";
        return $pdf->download($filename);
    }

    // ─── Warga ────────────────────────────────────────────────────────────────

    private function warga(Request $request): Response
    {
        $user     = $request->user();
        $penduduk = $user->nik ? Penduduk::where('nik', $user->nik)->first() : null;

        // Profil dianggap lengkap kalau 8 field wajib sudah terisi
        $profilLengkap = $penduduk !== null
            && filled($penduduk->nama)
            && filled($penduduk->tempat_lahir)
            && $penduduk->tanggal_lahir !== null
            && filled($penduduk->jenis_kelamin)
            && filled($penduduk->agama)
            && filled($penduduk->status_perkawinan)
            && filled($penduduk->pekerjaan)
            && filled($penduduk->alamat);

        $recentPengajuan = PengajuanSurat::where('user_id', $user->id)
            ->with('masterSurat:id,nama_surat,kode')
            ->latest()->take(5)
            ->get(['id', 'no_pengajuan', 'master_surat_id', 'status', 'created_at']);

        $recentPengaduan = Pengaduan::where('user_id', $user->id)
            ->latest()->take(5)
            ->get(['id', 'judul', 'status', 'created_at']);

        $recentInformasi = KontenDesa::published()
            ->latest()->take(3)
            ->get(['id', 'judul', 'slug', 'tipe', 'created_at']);

        return Inertia::render('dashboard/warga', [
            'profil_lengkap'   => $profilLengkap,
            'stats' => [
                'total_pengajuan' => PengajuanSurat::where('user_id', $user->id)->count(),
                'total_pengaduan' => Pengaduan::where('user_id', $user->id)->count(),
            ],
            'recent_pengajuan' => $recentPengajuan,
            'recent_pengaduan' => $recentPengaduan,
            'recent_informasi' => $recentInformasi,
        ]);
    }

    // ─── Staff ────────────────────────────────────────────────────────────────

    private function staff(Request $request): Response
    {
        // Antrian masuk — belum diverifikasi staff
        $menungguVerifikasi = PengajuanSurat::where('status', 'menunggu')->count();

        // Siap cetak — sudah disahkan kades, tinggal staff cetak + TTD fisik
        $siapCetak = PengajuanSurat::where('status', 'disetujui')->count();

        // Siap diambil — sudah dicetak, menunggu warga datang
        $siapDiambil = PengajuanSurat::where('status', 'siap_diambil')->count();

        // Selesai hari ini
        $selesaiHariIni = PengajuanSurat::where('status', 'selesai')
            ->whereDate('updated_at', today())
            ->count();

        $pengaduanBaru = Pengaduan::where('status', 'menunggu')->count();

        // Antrian prioritas: menunggu verifikasi + siap cetak
        $selesaiHariIni = PengajuanSurat::where('status', 'selesai')
            ->whereDate('updated_at', today())
            ->count();

        $antrian = PengajuanSurat::with('user:id,name')
            ->with('masterSurat:id,nama_surat,kode')
            ->whereIn('status', ['menunggu', 'disetujui', 'siap_diambil'])
            ->oldest()
            ->take(15)
            ->get(['id', 'no_pengajuan', 'user_id', 'master_surat_id', 'status', 'created_at']);

        $recentPengaduan = Pengaduan::where('status', 'menunggu')
            ->latest()
            ->take(4)
            ->get(['id', 'judul', 'status', 'created_at']);

        $bukuTamuHariIni = BukuTamu::whereDate('created_at', today())
            ->latest()
            ->take(5)
            ->get(['id', 'nama_pengunjung', 'keperluan', 'instansi', 'created_at']);

        return Inertia::render('dashboard/staff', [
            'stats' => [
                'menunggu_verifikasi' => $menungguVerifikasi,
                'siap_cetak'          => $siapCetak,
                'siap_diambil'        => $siapDiambil,
                'pengaduan_baru'      => $pengaduanBaru,
                'selesai_hari_ini'    => $selesaiHariIni,
            ],
            'antrian'          => $antrian,
            'recent_pengaduan' => $recentPengaduan,
            'buku_tamu_hari_ini' => $bukuTamuHariIni,
        ]);
    }
}
