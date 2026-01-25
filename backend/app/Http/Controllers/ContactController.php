<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    public function backup(Request $request)
    {
        // Expecting a list of contacts: { "contacts": [ {"name": "...", "number": "..."} ] }
        $validated = $request->validate([
            'contacts' => 'required|array',
            'contacts.*.number' => 'required|string',
            'contacts.*.name' => 'nullable|string',
        ]);

        $deviceId = $request->header('X-Device-ID') ?? 'unknown_device';
        // In a real app, we would use Auth::id()
        $userId = 1; // Mock user ID for this demo

        $contacts = $validated['contacts'];
        
        // Upsert contacts
        // We will assume phone_number + user_id is unique
        // Since we don't have a user system fully set up, we'll just store them globally or by device_id if we added that column.
        // For simplicity, let's just store distinct numbers.
        
        $upsertData = [];
        $now = now();
        
        foreach ($contacts as $contact) {
            $upsertData[] = [
                'user_id' => $userId,
                'phone_number' => $this->normalize($contact['number']),
                'name' => $contact['name'] ?? 'Unknown',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Chunking to avoid massive queries
        foreach (array_chunk($upsertData, 500) as $chunk) {
            DB::table('contacts')->upsert(
                $chunk,
                ['user_id', 'phone_number'], // Unique keys
                ['name', 'updated_at'] // Columns to update
            );
        }

        return response()->json(['status' => 'success', 'count' => count($contacts)]);
    }

    private function normalize($number) {
        // Simple logic for now
        return preg_replace('/[^0-9]/', '', $number);
    }
}
