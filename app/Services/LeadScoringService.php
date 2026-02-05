<?php

namespace App\Services;

use App\Models\Intent;
use App\Models\Lead;

/**
 * ENHANCED LEAD SCORING SERVICE
 *
 * Calculates lead quality score (0-100) based on 5 components:
 * - Service Clarity (0-25): How clear is the service need?
 * - Budget Clarity (0-25): How specific is the budget?
 * - Timeline Clarity (0-25): How clear is the timeline?
 * - Engagement Level (0-15): How engaged is the user?
 * - Decision Authority (0-10): Is user the decision maker?
 *
 * Grades:
 * - HOT: 90-100 (High conversion probability)
 * - WARM: 70-89 (Good conversion probability)
 * - COLD: 50-69 (Low conversion probability)
 * - NOT_LEAD: <50 (Not qualified)
 */
class LeadScoringService
{
    public const SCORE_HOT = 90;
    public const SCORE_WARM = 70;
    public const SCORE_COLD = 50;

    /**
     * Score a lead based on multiple factors
     */
    public function scoreLead(array $leadData, ?string $intentSlug = null): int
    {
        $score = 0;

        // Intent value (40 points max)
        if ($intentSlug) {
            $score += $this->scoreIntentValue($intentSlug);
        }

        // Engagement level (30 points max)
        $score += $this->scoreEngagement($leadData);

        // Budget range (20 points max)
        $score += $this->scoreBudget($leadData);

        // Timeline (10 points max)
        $score += $this->scoreTimeline($leadData);

        return min(100, $score); // Cap at 100
    }

    /**
     * PHASE 2: Enhanced comprehensive scoring
     */
    public function calculateScore(array $leadData): array
    {
        // Calculate component scores
        $serviceClarity = $this->scoreServiceClarity($leadData);
        $budgetClarity = $this->scoreBudgetClarity($leadData);
        $timelineClarity = $this->scoreTimelineClarity($leadData);
        $engagementLevel = $this->scoreEngagementLevel($leadData);
        $decisionAuthority = $this->scoreDecisionAuthority($leadData);

        // Total score
        $totalScore = $serviceClarity + $budgetClarity + $timelineClarity + $engagementLevel + $decisionAuthority;

        return [
            'score' => $totalScore,
            'grade' => $this->getGrade($totalScore),
            'breakdown' => [
                'service_clarity' => $serviceClarity,
                'budget_clarity' => $budgetClarity,
                'timeline_clarity' => $timelineClarity,
                'engagement_level' => $engagementLevel,
                'decision_authority' => $decisionAuthority,
            ],
            'recommendations' => $this->getRecommendations($totalScore, $leadData)
        ];
    }

    /**
     * Score based on intent value
     */
    protected function scoreIntentValue(string $intentSlug): int
    {
        $intent = Intent::where('intent_slug', $intentSlug)->first();

        if (!$intent) {
            return 0;
        }

        // High-value intents get more points
        if ($intent->is_high_value) {
            return 40;
        }

        // Service vertical scoring
        $verticalScores = [
            'Construction' => 35,
            'Interiors' => 30,
            'Real Estate' => 25,
            'Events' => 20,
            'General' => 10
        ];

        $baseScore = $verticalScores[$intent->service_vertical] ?? 15;

        // Boost by conversion rate
        $conversionBoost = min(10, $intent->conversion_rate / 2);

        return (int)($baseScore + $conversionBoost);
    }

    /**
     * Score based on engagement level
     */
    protected function scoreEngagement(array $leadData): int
    {
        $questionsAnswered = $leadData['questions_answered'] ?? 0;

        if ($questionsAnswered >= 5) {
            return 30;
        } elseif ($questionsAnswered >= 3) {
            return 20;
        } elseif ($questionsAnswered >= 1) {
            return 10;
        }

        return 0;
    }

    /**
     * Score based on budget range
     */
    protected function scoreBudget(array $leadData): int
    {
        $budget = strtolower($leadData['budget'] ?? '');

        if (str_contains($budget, '2 cr') || str_contains($budget, 'above')) {
            return 20;
        } elseif (str_contains($budget, '1 cr') || str_contains($budget, '2 cr')) {
            return 15;
        } elseif (str_contains($budget, '50l') || str_contains($budget, '1 cr')) {
            return 10;
        } elseif (str_contains($budget, 'under') || str_contains($budget, '50')) {
            return 5;
        }

        return 0;
    }

    /**
     * Score based on timeline
     */
    protected function scoreTimeline(array $leadData): int
    {
        $timeline = strtolower($leadData['timeline'] ?? '');

        if (str_contains($timeline, 'immediate') || str_contains($timeline, 'now')) {
            return 10;
        } elseif (str_contains($timeline, '3') || str_contains($timeline, '6')) {
            return 7;
        } elseif (str_contains($timeline, 'planning')) {
            return 3;
        }

        return 0;
    }

    /**
     * Determine lead status (Hot/Warm/Cold)
     */
    public function determineLeadStatus(int $score): string
    {
        if ($score >= 70) {
            return 'hot';
        } elseif ($score >= 40) {
            return 'warm';
        }

        return 'cold';
    }

    /**
     * Determine engagement level
     */
    public function determineEngagementLevel(array $leadData): string
    {
        $questionsAnswered = $leadData['questions_answered'] ?? 0;

        if ($questionsAnswered >= 4) {
            return 'high';
        } elseif ($questionsAnswered >= 2) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Score and tag a lead
     */
    public function scoreAndTagLead(Lead $lead, array $sessionData = []): Lead
    {
        $score = $this->scoreLead($sessionData, $lead->intent_slug);
        $status = $this->determineLeadStatus($score);
        $engagement = $this->determineEngagementLevel($sessionData);

        $lead->update([
            'conversion_score' => $score,
            'lead_status' => $status,
            'engagement_level' => $engagement
        ]);

        return $lead;
    }

    /**
     * Score: Service Clarity (0-25)
     * Does the user know what service they need?
     */
    private function scoreServiceClarity(array $data): int
    {
        $score = 0;

        // Detected service
        if (!empty($data['service'])) {
            $score += 15;
        }

        // Service specified in message
        if (!empty($data['mentioned_service'])) {
            $score += 5;
        }

        // Service tier specified
        if (!empty($data['service_tier']) && in_array($data['service_tier'], ['budget', 'standard', 'premium', 'luxury', 'custom'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    /**
     * Score: Budget Clarity (0-25)
     * Does the user know their budget?
     */
    private function scoreBudgetClarity(array $data): int
    {
        $score = 0;

        // Budget specified
        if (!empty($data['budget'])) {
            $score += 15;
        }

        // Budget is specific (not "expensive" but actual amount)
        if (!empty($data['budget_value']) && is_numeric($data['budget_value'])) {
            $score += 10;
        }

        // Budget range provided
        if (!empty($data['budget_min']) && !empty($data['budget_max'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    /**
     * Score: Timeline Clarity (0-25)
     * Does the user have a clear timeline?
     */
    private function scoreTimelineClarity(array $data): int
    {
        $score = 0;

        // Timeline mentioned
        if (!empty($data['timeline'])) {
            $score += 15;
        }

        // Specific timeline (not "urgent" but months/dates)
        if (!empty($data['timeline_months']) || !empty($data['start_date'])) {
            $score += 10;
        }

        // Urgency level specified
        if (!empty($data['urgency']) && in_array($data['urgency'], ['low', 'medium', 'high', 'urgent'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    /**
     * Score: Engagement Level (0-15)
     * How engaged is the user?
     */
    private function scoreEngagementLevel(array $data): int
    {
        $score = 0;

        // Message count (conversation length)
        if (!empty($data['message_count'])) {
            $messageCount = $data['message_count'];

            if ($messageCount >= 5) {
                $score += 10;
            } elseif ($messageCount >= 3) {
                $score += 6;
            } else {
                $score += 2;
            }
        }

        // Enthusiasm indicators
        if (!empty($data['enthusiasm_indicators'])) {
            $enthusiasmCount = is_array($data['enthusiasm_indicators']) ? count($data['enthusiasm_indicators']) : 0;
            $score += min(5, $enthusiasmCount * 2);
        }

        return min(15, $score);
    }

    /**
     * Score: Decision Authority (0-10)
     * Is the user the decision maker?
     */
    private function scoreDecisionAuthority(array $data): int
    {
        $score = 0;

        // User is primary contact
        if (!empty($data['contact_info']['name']) || !empty($data['contact_info']['phone'])) {
            $score += 5;
        }

        // User mentioned being decision maker
        if (!empty($data['is_decision_maker'])) {
            $score += 5;
        }

        // Contact provided (likely decision maker)
        if (!empty($data['contact_info']) && count($data['contact_info']) >= 2) {
            $score += 3;
        }

        return min(10, $score);
    }

    /**
     * Get lead grade from score
     */
    private function getGrade(int $score): string
    {
        if ($score >= self::SCORE_HOT) {
            return 'HOT';
        } elseif ($score >= self::SCORE_WARM) {
            return 'WARM';
        } elseif ($score >= self::SCORE_COLD) {
            return 'COLD';
        } else {
            return 'NOT_LEAD';
        }
    }

    /**
     * Get recommendations for follow-up
     */
    private function getRecommendations(int $score, array $data): array
    {
        $recommendations = [];

        if ($score >= self::SCORE_HOT) {
            $recommendations[] = 'Call immediately with detailed proposal';
            $recommendations[] = 'Personalized quotation within 1 hour';
            $recommendations[] = 'Assign to senior sales person';
        } elseif ($score >= self::SCORE_WARM) {
            $recommendations[] = 'Send detailed information and case studies';
            $recommendations[] = 'Schedule follow-up call within 24 hours';
            $recommendations[] = 'Address specific concerns identified';
        } elseif ($score >= self::SCORE_COLD) {
            $recommendations[] = 'Add to nurture email sequence';
            $recommendations[] = 'Follow up after 1 week';
            $recommendations[] = 'Provide general information and resources';
        } else {
            $recommendations[] = 'Not qualified - add to awareness list';
            $recommendations[] = 'Send general company information';
            $recommendations[] = 'Check back in 3 months';
        }

        // Add specific gaps to address
        if (empty($data['service'])) {
            $recommendations[] = 'Clarify which service best fits their need';
        }

        if (empty($data['budget'])) {
            $recommendations[] = 'Understand their budget constraints';
        }

        if (empty($data['timeline'])) {
            $recommendations[] = 'Determine project timeline';
        }

        return $recommendations;
    }

    /**
     * Get score breakdown description
     */
    public function getScoreDescription(array $breakdown): string
    {
        $parts = [];

        if ($breakdown['service_clarity'] >= 15) {
            $parts[] = 'Clear service need';
        } elseif ($breakdown['service_clarity'] >= 10) {
            $parts[] = 'Somewhat clear service need';
        }

        if ($breakdown['budget_clarity'] >= 15) {
            $parts[] = 'Clear budget';
        } elseif ($breakdown['budget_clarity'] >= 10) {
            $parts[] = 'Budget range mentioned';
        }

        if ($breakdown['timeline_clarity'] >= 15) {
            $parts[] = 'Clear timeline';
        } elseif ($breakdown['timeline_clarity'] >= 10) {
            $parts[] = 'General timeline';
        }

        if ($breakdown['engagement_level'] >= 10) {
            $parts[] = 'Highly engaged';
        } elseif ($breakdown['engagement_level'] >= 5) {
            $parts[] = 'Moderately engaged';
        }

        if ($breakdown['decision_authority'] >= 8) {
            $parts[] = 'Decision maker';
        }

        return implode(', ', $parts) ?: 'Insufficient information';
    }

    /**
     * Predict sales probability
     */
    public function predictConversionProbability(int $score): string
    {
        if ($score >= 95) {
            return '90-100% probability';
        } elseif ($score >= 90) {
            return '85-90% probability';
        } elseif ($score >= 80) {
            return '70-85% probability';
        } elseif ($score >= 70) {
            return '55-70% probability';
        } elseif ($score >= 60) {
            return '30-55% probability';
        } else {
            return '<30% probability';
        }
    }
}
