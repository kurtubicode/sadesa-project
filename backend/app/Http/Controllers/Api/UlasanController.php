<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PengajuanSurat;
use App\Models\Ulasan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UlasanController extends Controller
{
    public function store(Request $request, int $id): JsonResponse
    {
        $pengajuan = PengajuanSurat::where('user_id', $request->user()->id)
            ->where('status', 'selesai')
            ->findOrFail($id);

        if (Ulasan::where('pengajuan_id', $pengajuan->id)->exists()) {
            return response()->json(['message' => 'Ulasan untuk pengajuan ini sudah pernah diberikan.'], 422);
        }

        $data = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
        ]);

        $ulasan = Ulasan::create([
            'user_id'      => $request->user()->id,
            'pengajuan_id' => $pengajuan->id,
            'rating'       => $data['rating'],
            'komentar'     => $data['komentar'] ?? null,
        ]);

        return response()->json([
            'message' => 'Terima kasih atas ulasan Anda!',
            'data'    => [
                'id'      => $ulasan->id,
                'rating'  => $ulasan->rating,
                'komentar'=> $ulasan->komentar,
            ],
        ], 201);
    }
}
