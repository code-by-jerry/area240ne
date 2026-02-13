<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CostEstimationController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\HeroSlideController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\IntentsController;
use App\Http\Controllers\ServiceConfigsController;
use App\Models\User;
use App\Models\Lead;
use App\Models\CostEstimation;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('/cost-estimator', [CostEstimationController::class, 'create'])->name('cost-estimator.create');
Route::post('/cost-estimator', [CostEstimationController::class, 'store'])->name('cost-estimator.store');
Route::get('/cost-estimation/{uuid}', [CostEstimationController::class, 'show'])->name('cost-estimation.show');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        $stats = [
            'users_total' => User::count(),
            'users_today' => User::whereDate('created_at', now()->toDateString())->count(),
            'leads_total' => Lead::count(),
            'leads_today' => Lead::whereDate('created_at', now()->toDateString())->count(),
            'estimations_total' => CostEstimation::count(),
            'estimations_today' => CostEstimation::whereDate('created_at', now()->toDateString())->count(),
        ];

        $recent_leads = Lead::latest()->take(5)->get(['id','name','email','phone','service','location','lead_status','created_at']);
        $recent_users = User::latest()->take(5)->get(['id','name','email','phone','role','created_at']);
        $recent_estimations = CostEstimation::latest()->take(5)->get(['id','name','city','package','estimated_cost','created_at']);

        $start = Carbon::now()->subDays(13)->startOfDay();
        $period = CarbonPeriod::create($start, Carbon::now()->startOfDay());

        $usersGrouped = User::whereDate('created_at', '>=', $start->toDateString())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $leadsGrouped = Lead::whereDate('created_at', '>=', $start->toDateString())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $estimationsGrouped = CostEstimation::whereDate('created_at', '>=', $start->toDateString())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $usersSeries = [];
        $leadsSeries = [];
        $estimationsSeries = [];
        foreach ($period as $date) {
            $d = $date->toDateString();
            $usersSeries[] = ['date' => $d, 'count' => (int) ($usersGrouped[$d]->count ?? 0)];
            $leadsSeries[] = ['date' => $d, 'count' => (int) ($leadsGrouped[$d]->count ?? 0)];
            $estimationsSeries[] = ['date' => $d, 'count' => (int) ($estimationsGrouped[$d]->count ?? 0)];
        }

        $leadStatusCounts = Lead::selectRaw('COALESCE(lead_status, "unknown") as status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentLeads' => $recent_leads,
            'recentUsers' => $recent_users,
            'recentEstimations' => $recent_estimations,
            'usersSeries' => $usersSeries,
            'leadsSeries' => $leadsSeries,
            'estimationsSeries' => $estimationsSeries,
            'leadStatusCounts' => $leadStatusCounts,
        ]);
    })->name('dashboard');

    Route::get('leads', [App\Http\Controllers\LeadController::class, 'index'])->name('leads');
    Route::get('admin/cost-estimations', [CostEstimationController::class, 'index'])->name('admin.cost-estimations');

    // Hero Slides Management
    Route::get('admin/hero-slides', [HeroSlideController::class, 'index'])->name('admin.hero-slides.index');
    Route::post('admin/hero-slides', [HeroSlideController::class, 'store'])->name('admin.hero-slides.store');
    Route::post('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'update'])->name('admin.hero-slides.update');
    Route::delete('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy'])->name('admin.hero-slides.destroy');

    // Users Management
    Route::get('admin/users', [UsersController::class, 'index'])->name('admin.users.index');
    Route::post('admin/users', [UsersController::class, 'store'])->name('admin.users.store');
    Route::post('admin/users/{user}', [UsersController::class, 'update'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [UsersController::class, 'destroy'])->name('admin.users.destroy');

    // Intents Management
    Route::get('admin/intents', [IntentsController::class, 'index'])->name('admin.intents.index');
    Route::post('admin/intents', [IntentsController::class, 'store'])->name('admin.intents.store');
    Route::post('admin/intents/{intent}', [IntentsController::class, 'update'])->name('admin.intents.update');
    Route::delete('admin/intents/{intent}', [IntentsController::class, 'destroy'])->name('admin.intents.destroy');

    // Service Configs Management
    Route::get('admin/service-configs', [ServiceConfigsController::class, 'index'])->name('admin.service-configs.index');
    Route::post('admin/service-configs', [ServiceConfigsController::class, 'store'])->name('admin.service-configs.store');
    Route::post('admin/service-configs/{serviceConfig}', [ServiceConfigsController::class, 'update'])->name('admin.service-configs.update');
    Route::delete('admin/service-configs/{serviceConfig}', [ServiceConfigsController::class, 'destroy'])->name('admin.service-configs.destroy');
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
