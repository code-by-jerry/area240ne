<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CostEstimationController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\HeroSlideController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/cost-estimator', [CostEstimationController::class, 'create'])->name('cost-estimator.create');
Route::post('/cost-estimator', [CostEstimationController::class, 'store'])->name('cost-estimator.store');
Route::get('/cost-estimation/{uuid}', [CostEstimationController::class, 'show'])->name('cost-estimation.show');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('leads', [App\Http\Controllers\LeadController::class, 'index'])->name('leads');
    Route::get('admin/cost-estimations', [CostEstimationController::class, 'index'])->name('admin.cost-estimations');

    // Hero Slides Management
    Route::get('admin/hero-slides', [HeroSlideController::class, 'index'])->name('admin.hero-slides.index');
    Route::post('admin/hero-slides', [HeroSlideController::class, 'store'])->name('admin.hero-slides.store');
    Route::post('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'update'])->name('admin.hero-slides.update');
    Route::delete('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy'])->name('admin.hero-slides.destroy');
});

// Socialite Routes
Route::get('auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirect'])->name('google.redirect');
Route::get('auth/google/callback', [App\Http\Controllers\Auth\SocialiteController::class, 'callback'])->name('google.callback');

require __DIR__ . '/settings.php';

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
