<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('leads', [App\Http\Controllers\LeadController::class, 'index'])->name('leads');
});

// Socialite Routes
Route::get('auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirect'])->name('google.redirect');
Route::get('auth/google/callback', [App\Http\Controllers\Auth\SocialiteController::class, 'callback'])->name('google.callback');

require __DIR__ . '/settings.php';

use App\Http\Controllers\ChatController;

Route::post('/chat', [ChatController::class, 'sendMessage']);
Route::get('/chat/history', [ChatController::class, 'getHistory']);
Route::get('/chat/session/{id}', [ChatController::class, 'loadSession']);
Route::delete('/chat/session/{id}', [ChatController::class, 'deleteSession']);
Route::get('/chat', function () {
    return Inertia::render('ChatApp');
});

Route::get('/debug-db', function () {
    try {
        $chatService = new \App\Services\ChatService();
        $response = $chatService->handle(null, '');
        return "Success! Reply: " . $response['reply'];
    } catch (\Throwable $e) {
        return "Error: " . $e->getMessage() . " | File: " . $e->getFile() . " | Line: " . $e->getLine();
    }
});

Route::get('/test', function () {
    return view('test');
});
