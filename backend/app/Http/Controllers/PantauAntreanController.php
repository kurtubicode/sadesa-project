<?php

namespace App\Http\Controllers;

use App\Models\PengajuanSurat;
use Inertia\Inertia;
use Inertia\Response;

class PantauAntreanController extends Controller
{
    public function index(): Response
    {
        $antrean = PengajuanSurat::with([
            'user:id,name',
            'masterSurat:id,nama_surat,kode',
        ])
        ->whereIn('status', ['menunggu', 'diproses', 'diverifikasi', 'menunggu_pengesahan', 'disetujui', 'siap_diambil'])
        ->latest()
        ->limit(50)
        ->get()
        ->map(fn ($p) => [
            'no_pengajuan' => $p->no_pengajuan,
            'nama'         => $p->user?->name ?? '—',
            'jenis_surat'  => $p->masterSurat?->nama_surat ?? '—',
            'status'       => $p->status,
            'tanggal'      => $p->created_at->format('d M Y'),
            'waktu'        => $p->created_at->format('H:i'),
        ]);

        $stats = [
            'menunggu'            => PengajuanSurat::where('status', 'menunggu')->count(),
            'diproses'            => PengajuanSurat::whereIn('status', ['diproses', 'diverifikasi'])->count(),
            'menunggu_pengesahan' => PengajuanSurat::whereIn('status', ['menunggu_pengesahan', 'disetujui'])->count(),
            'siap_diambil'        => PengajuanSurat::where('status', 'siap_diambil')->count(),
        ];

        return Inertia::render('publik/antrean', [
            'antrean' => $antrean,
            'stats'   => $stats,
        ]);
    }
}
