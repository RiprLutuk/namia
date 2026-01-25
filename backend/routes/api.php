<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SyncController;
use App\Http\Controllers\ReportController;
use App\Http\Middleware\ApiKeyMiddleware;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware([ApiKeyMiddleware::class, 'throttle:60,1'])->group(function () {
    Route::get('/sync', [SyncController::class, 'sync']);
    Route::post('/report', [ReportController::class, 'store']);
    Route::post('/contacts/backup', [App\Http\Controllers\ContactController::class, 'backup']);
});
