<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CostEstimationController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\HeroSlideController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\Admin\ChatIntentsController;
use App\Http\Controllers\Admin\ChatSettingsController;
use App\Http\Controllers\Admin\ChatServicesController;
use App\Http\Controllers\Admin\ChatKnowledgeItemsController;
use App\Http\Controllers\Admin\ChatQualificationFlowsController;
use App\Http\Controllers\Admin\ChatResponseTemplatesController;
use App\Http\Controllers\Admin\ChatImportsController;
use App\Http\Controllers\Admin\ChatSessionsController;
use App\Http\Controllers\Admin\BlogsController;
use App\Http\Controllers\Admin\MediaAssetsController;
use App\Models\User;
use App\Models\Lead;
use App\Models\CostEstimation;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{slug}', [BlogController::class, 'show'])->name('blogs.show');

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

        $recent_leads = Lead::latest()->take(5)->get(['id', 'name', 'email', 'phone', 'service', 'location', 'lead_status', 'created_at']);
        $recent_users = User::latest()->take(5)->get(['id', 'name', 'email', 'phone', 'role', 'created_at']);
        $recent_estimations = CostEstimation::latest()->take(5)->get(['id', 'name', 'city', 'package', 'estimated_cost', 'created_at']);

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

    Route::get('admin/hero-slides', [HeroSlideController::class, 'index'])->name('admin.hero-slides.index');
    Route::post('admin/hero-slides', [HeroSlideController::class, 'store'])->name('admin.hero-slides.store');
    Route::post('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'update'])->name('admin.hero-slides.update');
    Route::delete('admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy'])->name('admin.hero-slides.destroy');

    Route::get('admin/blogs', [BlogsController::class, 'index'])->name('admin.blogs.index');
    Route::post('admin/blogs', [BlogsController::class, 'store'])->name('admin.blogs.store');
    Route::post('admin/blogs/{blog}', [BlogsController::class, 'update'])->name('admin.blogs.update');
    Route::post('admin/blogs/{blog}/toggle', [BlogsController::class, 'toggleActive'])->name('admin.blogs.toggle');
    Route::post('admin/blogs/{blog}/publish', [BlogsController::class, 'togglePublished'])->name('admin.blogs.publish');
    Route::post('admin/blogs/{blog}/feature', [BlogsController::class, 'toggleFeatured'])->name('admin.blogs.feature');
    Route::delete('admin/blogs/{blog}', [BlogsController::class, 'destroy'])->name('admin.blogs.destroy');

    Route::get('admin/media-assets', [MediaAssetsController::class, 'index'])->name('admin.media-assets.index');
    Route::post('admin/media-assets', [MediaAssetsController::class, 'store'])->name('admin.media-assets.store');
    Route::post('admin/media-assets/{mediaAsset}', [MediaAssetsController::class, 'update'])->name('admin.media-assets.update');
    Route::delete('admin/media-assets/{mediaAsset}', [MediaAssetsController::class, 'destroy'])->name('admin.media-assets.destroy');

    Route::get('admin/users', [UsersController::class, 'index'])->name('admin.users.index');
    Route::post('admin/users', [UsersController::class, 'store'])->name('admin.users.store');
    Route::post('admin/users/{user}', [UsersController::class, 'update'])->name('admin.users.update');
    Route::delete('admin/users/{user}', [UsersController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('admin/company-profile', [\App\Http\Controllers\CompanyProfileController::class, 'edit'])->name('admin.company-profile.edit');
    Route::post('admin/company-profile', [\App\Http\Controllers\CompanyProfileController::class, 'update'])->name('admin.company-profile.update');

    Route::get('admin/chat-settings', [ChatSettingsController::class, 'edit'])->name('admin.chat-settings.edit');
    Route::post('admin/chat-settings', [ChatSettingsController::class, 'update'])->name('admin.chat-settings.update');

    Route::get('admin/chat-services', [ChatServicesController::class, 'index'])->name('admin.chat-services.index');
    Route::post('admin/chat-services', [ChatServicesController::class, 'store'])->name('admin.chat-services.store');
    Route::post('admin/chat-services/{chatService}', [ChatServicesController::class, 'update'])->name('admin.chat-services.update');
    Route::post('admin/chat-services/{chatService}/toggle', [ChatServicesController::class, 'toggleActive'])->name('admin.chat-services.toggle');
    Route::post('admin/chat-services/{chatService}/publish', [ChatServicesController::class, 'togglePublished'])->name('admin.chat-services.publish');
    Route::delete('admin/chat-services/{chatService}', [ChatServicesController::class, 'destroy'])->name('admin.chat-services.destroy');

    Route::get('admin/chat-intents', [ChatIntentsController::class, 'index'])->name('admin.chat-intents.index');
    Route::post('admin/chat-intents', [ChatIntentsController::class, 'store'])->name('admin.chat-intents.store');
    Route::post('admin/chat-intents/{chatIntent}', [ChatIntentsController::class, 'update'])->name('admin.chat-intents.update');
    Route::post('admin/chat-intents/{chatIntent}/toggle', [ChatIntentsController::class, 'toggleActive'])->name('admin.chat-intents.toggle');
    Route::post('admin/chat-intents/{chatIntent}/publish', [ChatIntentsController::class, 'togglePublished'])->name('admin.chat-intents.publish');
    Route::delete('admin/chat-intents/{chatIntent}', [ChatIntentsController::class, 'destroy'])->name('admin.chat-intents.destroy');

    Route::get('admin/chat-knowledge-items', [ChatKnowledgeItemsController::class, 'index'])->name('admin.chat-knowledge-items.index');
    Route::post('admin/chat-knowledge-items', [ChatKnowledgeItemsController::class, 'store'])->name('admin.chat-knowledge-items.store');
    Route::post('admin/chat-knowledge-items/{chatKnowledgeItem}', [ChatKnowledgeItemsController::class, 'update'])->name('admin.chat-knowledge-items.update');
    Route::post('admin/chat-knowledge-items/{chatKnowledgeItem}/toggle', [ChatKnowledgeItemsController::class, 'toggleActive'])->name('admin.chat-knowledge-items.toggle');
    Route::post('admin/chat-knowledge-items/{chatKnowledgeItem}/publish', [ChatKnowledgeItemsController::class, 'togglePublished'])->name('admin.chat-knowledge-items.publish');
    Route::delete('admin/chat-knowledge-items/{chatKnowledgeItem}', [ChatKnowledgeItemsController::class, 'destroy'])->name('admin.chat-knowledge-items.destroy');

    Route::get('admin/chat-qualification-flows', [ChatQualificationFlowsController::class, 'index'])->name('admin.chat-qualification-flows.index');
    Route::post('admin/chat-qualification-flows', [ChatQualificationFlowsController::class, 'store'])->name('admin.chat-qualification-flows.store');
    Route::post('admin/chat-qualification-flows/{chatQualificationFlow}', [ChatQualificationFlowsController::class, 'update'])->name('admin.chat-qualification-flows.update');
    Route::post('admin/chat-qualification-flows/{chatQualificationFlow}/toggle', [ChatQualificationFlowsController::class, 'toggleActive'])->name('admin.chat-qualification-flows.toggle');
    Route::post('admin/chat-qualification-flows/{chatQualificationFlow}/publish', [ChatQualificationFlowsController::class, 'togglePublished'])->name('admin.chat-qualification-flows.publish');
    Route::delete('admin/chat-qualification-flows/{chatQualificationFlow}', [ChatQualificationFlowsController::class, 'destroy'])->name('admin.chat-qualification-flows.destroy');

    Route::get('admin/chat-response-templates', [ChatResponseTemplatesController::class, 'index'])->name('admin.chat-response-templates.index');
    Route::post('admin/chat-response-templates', [ChatResponseTemplatesController::class, 'store'])->name('admin.chat-response-templates.store');
    Route::post('admin/chat-response-templates/{chatResponseTemplate}', [ChatResponseTemplatesController::class, 'update'])->name('admin.chat-response-templates.update');
    Route::post('admin/chat-response-templates/{chatResponseTemplate}/toggle', [ChatResponseTemplatesController::class, 'toggleActive'])->name('admin.chat-response-templates.toggle');
    Route::post('admin/chat-response-templates/{chatResponseTemplate}/publish', [ChatResponseTemplatesController::class, 'togglePublished'])->name('admin.chat-response-templates.publish');
    Route::delete('admin/chat-response-templates/{chatResponseTemplate}', [ChatResponseTemplatesController::class, 'destroy'])->name('admin.chat-response-templates.destroy');

    Route::get('admin/chat-imports', [ChatImportsController::class, 'index'])->name('admin.chat-imports.index');
    Route::post('admin/chat-imports', [ChatImportsController::class, 'store'])->name('admin.chat-imports.store');
    Route::get('admin/chat-imports/template/{module}/{format}', [ChatImportsController::class, 'downloadTemplate'])->name('admin.chat-imports.template');

    Route::get('admin/chat-sessions', [ChatSessionsController::class, 'index'])->name('admin.chat-sessions.index');

    Route::get('admin/chat-tester', function () {
        return Inertia::render('Admin/ChatTester');
    })->name('admin.chat-tester');
});

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

Route::get('/test', function () {
    return view('test');
});

