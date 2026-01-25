<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SpamReport;
use App\Models\BlacklistedNumber;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string',
            'device_id' => 'nullable|string',
            'reason' => 'nullable|string',
        ]);

        // Log report
        SpamReport::create($validated);

        // Check threshold (Aggressive: Block on first report)
        $reportCount = SpamReport::where('phone_number', $validated['phone_number'])->count();
        if ($reportCount > 0) {
            BlacklistedNumber::firstOrCreate(
                ['phone_number' => $validated['phone_number']],
                ['reason' => 'Auto-blocked: High report count', 'source' => 'system']
            );
        }

        return response()->json(['message' => 'Report received']);
    }
}
