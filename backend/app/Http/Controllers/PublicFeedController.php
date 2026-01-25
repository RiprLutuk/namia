<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlacklistedNumber;

class PublicFeedController extends Controller
{
    public function index()
    {
        // Fetch latest blocked numbers
        $numbers = BlacklistedNumber::orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return view('feed', ['numbers' => $numbers]);
    }

    public function api()
    {
        $numbers = BlacklistedNumber::orderBy('created_at', 'desc')
            ->limit(100)
            ->get(['phone_number', 'reason', 'source', 'created_at']);

        // Add some metadata
        return response()->json([
            'meta' => [
                'title' => 'Spam Caller Public Blocklist',
                'description' => 'Real-time feed of confirmed spam numbers.',
                'generated_at' => now()->toIso8601String(),
                'count' => $numbers->count()
            ],
            'data' => $numbers
        ]);
    }
}
