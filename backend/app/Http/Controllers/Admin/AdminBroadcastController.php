<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BroadcastNotifikasi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBroadcastController extends Controller
{
    public function index(): Response
    {
        $riwayat = BroadcastNotifikasi::with('admin:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/broadcast', [
            'riwayat' => $riwayat,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'judul'       => 'required|string|max:200',
            'pesan'       => 'required|string|max:1000',
            'target_role' => 'required|in:semua,warga,staff,kepala_desa',
        ]);

        // Simpan riwayat broadcast
        BroadcastNotifikasi::create([
            'admin_id'    => $request->user()->id,
            'judul'       => $request->judul,
            'pesan'       => $request->pesan,
            'target_role' => $request->target_role,
        ]);

        // Kirim ke notifications table semua penerima
        $query = User::where('status', 'aktif');
        if ($request->target_role !== 'semua') {
            $query->where('role', $request->target_role);
        }

        $penerima = $query->get();
        foreach ($penerima as $user) {
            $user->notifications()->create([
                'id'   => \Illuminate\Support\Str::uuid(),
                'type' => 'App\Notifications\BroadcastNotification',
                'data' => [
                    'type'       => 'broadcast',
                    'title'      => $request->judul,
                    'body'       => $request->pesan,
                    'action_url' => null,
                ],
            ]);
        }

        return back()->with('success', "Notifikasi berhasil dikirim ke {$penerima->count()} pengguna.");
    }
}
