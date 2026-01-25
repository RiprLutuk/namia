<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/feed', [App\Http\Controllers\PublicFeedController::class, 'index']);
