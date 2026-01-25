<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlacklistedNumber;

class SyncController extends Controller
{
    public function sync(Request $request)
    {
        $validated = $request->validate([
            'last_synced_at' => 'nullable|date_format:Y-m-d\TH:i:sP', // ISO 8601
        ]);

        $lastSyncedAt = $validated['last_synced_at'] ?? null;

        $query = BlacklistedNumber::query()->withTrashed();

        if ($lastSyncedAt) {
            $query->where('updated_at', '>', $lastSyncedAt);
        }

        $changes = $query->get()->map(function ($item) {
            return [
                'phone_number' => $item->phone_number,
                'status' => $item->trashed() ? 'deleted' : 'active',
                'updated_at' => $item->updated_at->toIso8601String(),
            ];
        });

        return response()->json([
            'changes' => $changes,
            'server_timestamp' => now()->toIso8601String(),
        ]);
    }
}
