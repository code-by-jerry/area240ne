<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Cache keys constants
     */
    const CACHE_KEYS = [
        'POPULAR_KEYWORDS' => 'popular_keywords',
        'TRENDING_KEYWORDS' => 'trending_keywords',
        'HIGH_CONVERTING_KEYWORDS' => 'high_converting_keywords',
        'INTENT_CONVERSIONS' => 'intent_conversions',
        'WELCOME_KEYWORDS' => 'welcome_keywords',
        'ANALYTICS_SUMMARY' => 'analytics_summary',
        'CONVERSION_FUNNEL' => 'conversion_funnel',
        'HIGH_VALUE_INTENTS' => 'high_value_intents',
        'COMMON_INTENTS' => 'common_intents',
        'FAQ_RESPONSES' => 'faq_responses'
    ];

    /**
     * Invalidate popular keywords cache
     */
    public function invalidatePopularKeywords(?string $serviceVertical = null): void
    {
        if ($serviceVertical) {
            Cache::forget("popular_keywords_*_{$serviceVertical}");
        } else {
            Cache::forget('popular_keywords');
            Cache::forget('popular_keywords_*');
        }
    }

    /**
     * Invalidate trending keywords cache
     */
    public function invalidateTrendingKeywords(): void
    {
        Cache::forget('trending_keywords');
        Cache::forget('trending_keywords_*');
    }

    /**
     * Invalidate conversion-related caches
     */
    public function invalidateConversionCaches(): void
    {
        Cache::forget('high_converting_keywords');
        Cache::forget('high_converting_keywords_*');
        Cache::forget('intent_conversions');
        Cache::forget('conversion_optimized_keywords_*');
        Cache::forget('high_converting_intents_*');
    }

    /**
     * Invalidate analytics caches
     */
    public function invalidateAnalyticsCaches(): void
    {
        Cache::forget('analytics_summary');
        Cache::forget('conversion_funnel');
    }

    /**
     * Invalidate welcome message cache
     */
    public function invalidateWelcomeCache(?int $userId = null): void
    {
        if ($userId) {
            Cache::forget("user_keywords_{$userId}_*");
        }
        Cache::forget('welcome_keywords_*');
        Cache::forget('high_value_intents_*');
    }

    /**
     * Invalidate intent-related caches
     */
    public function invalidateIntentCaches(?string $intentSlug = null): void
    {
        if ($intentSlug) {
            Cache::forget("intent_{$intentSlug}_*");
        }
        Cache::forget('common_intents_*');
        Cache::forget('faq_responses_*');
    }

    /**
     * Warm cache on deployment/startup
     */
    public function warmCache(): void
    {
        // Warm popular keywords
        $analyticsService = app(AnalyticsService::class);
        $analyticsService->getPopularKeywords(10);
        $analyticsService->getTrendingKeywords(10);
        $analyticsService->getHighConvertingKeywords(10);
        
        // Warm welcome message
        $welcomeService = app(WelcomeMessageService::class);
        $welcomeService->generateWelcomeMessage();
        
        // Warm analytics summary
        $analyticsService->getAnalyticsSummary();
    }

    /**
     * Clear all chat-related caches
     */
    public function clearAllChatCaches(): void
    {
        $this->invalidatePopularKeywords();
        $this->invalidateTrendingKeywords();
        $this->invalidateConversionCaches();
        $this->invalidateAnalyticsCaches();
        $this->invalidateWelcomeCache();
        $this->invalidateIntentCaches();
    }
}
