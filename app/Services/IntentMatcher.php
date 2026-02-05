<?php

namespace App\Services;

use App\Models\Intent;

/**
 * IntentMatcher Service
 *
 * Matches user input to dataset intents and returns contextual responses
 * Works alongside ChatService state machine for rich conversational experience
 */
class IntentMatcher
{
    /**
     * Try to match user input to dataset intent
     *
     * @param string $userInput User message
     * @param string|null $serviceVertical Current service context (e.g., "Construction", "Interiors")
     * @param string|null $currentState Current chat state
     * @return array|null Intent match with response, or null if no match
     */
    public function match(string $userInput, ?string $serviceVertical = null, ?string $currentState = null): ?array
    {
        $intent = Intent::findBestMatch($userInput, $serviceVertical);

        if (!$intent) {
            return null;
        }

        return [
            'found' => true,
            'intent_slug' => $intent->intent_slug,
            'service_vertical' => $intent->service_vertical,
            'response' => $intent->getFormattedResponse(),
            'redirect_url' => $intent->redirect_url,
            'is_clarification' => $intent->isClarificationIntent(),
            'should_pause_flow' => $intent->shouldPauseFlow()
        ];
    }

    /**
     * Check if input is a greeting/intro message
     * These should be answered before moving to question flow
     */
    public function isGreetingOrIntro(string $userInput): bool
    {
        $greetingIntents = [
            'greet_hello',
            'greet_simple',
            'greet_formal',
            'greet_casual',
            'who_are_you',
            'what_is_area24',
            'services_overview'
        ];

        $intent = Intent::findBestMatch($userInput, 'General');

        return $intent && in_array($intent->intent_slug, $greetingIntents);
    }

    /**
     * Check if input is asking for help/guidance (trigger for discovery questions)
     */
    public function isAskingForHelp(string $userInput): bool
    {
        $helpIntents = [
            'discovery_start',
            'discovery_plan_type',
            'help_navigation'
        ];

        $intent = Intent::findBestMatch($userInput, 'General');

        return $intent && in_array($intent->intent_slug, $helpIntents);
    }

    /**
     * Check if user is expressing uncertainty or anxiety
     * These should get empathetic responses but continue flow
     */
    public function isUserAnxious(string $userInput): bool
    {
        $anxietyIntents = [
            'user_not_ready',
            'user_overwhelmed',
            'user_anxiety_cost',
            'user_anxiety_cheating',
            'user_comparison_mode',
            'user_time_constraint'
        ];

        $intent = Intent::findBestMatch($userInput, 'General');

        return $intent && in_array($intent->intent_slug, $anxietyIntents);
    }

    /**
     * Check if input is asking to restart/change topic
     */
    public function isAskingToRestart(string $userInput): bool
    {
        $restartIntents = [
            'convo_reset',
            'convo_change_topic'
        ];

        $intent = Intent::findBestMatch($userInput, 'General');

        return $intent && in_array($intent->intent_slug, $restartIntents);
    }

    /**
     * Get all intents for a specific service vertical
     * Useful for debugging and analytics
     */
    public function getServiceIntents(string $serviceVertical): array
    {
        return Intent::where('service_vertical', $serviceVertical)
            ->orWhere('service_vertical', 'General')
            ->pluck('intent_slug')
            ->toArray();
    }

    /**
     * Get statistics on dataset coverage
     */
    public function getStats(): array
    {
        return [
            'total_intents' => Intent::count(),
            'by_vertical' => Intent::groupBy('service_vertical')
                ->selectRaw('service_vertical, count(*) as count')
                ->get()
                ->pluck('count', 'service_vertical')
                ->toArray(),
            'by_category' => Intent::groupBy('category')
                ->selectRaw('category, count(*) as count')
                ->get()
                ->pluck('count', 'category')
                ->toArray()
        ];
    }
}
