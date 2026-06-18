<?php

namespace App\Services;

use App\Models\User;

class AdminNotificationService
{
    /**
     * Kirim notifikasi database ke semua admin dan staff aktif.
     */
    public static function kirim(string $title, string $body, string $type, int $actionId, string $actionUrl): void
    {
        $penerima = User::whereIn('role', ['admin', 'staff'])
            ->where('status', 'aktif')
            ->get();

        foreach ($penerima as $user) {
            $user->notifications()->create([
                'id'   => \Illuminate\Support\Str::uuid(),
                'type' => 'App\Notifications\AdminPushNotification',
                'data' => [
                    'type'       => $type,
                    'title'      => $title,
                    'body'       => $body,
                    'action_id'  => $actionId,
                    'action_url' => $actionUrl,
                ],
            ]);
        }
    }
}
