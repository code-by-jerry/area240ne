<?php

namespace App\Services;

use App\Models\ChatIntent;
use App\Models\Lead;

class LeadScoringService
{
    public const SCORE_HOT = 90;
    public const SCORE_WARM = 70;
    public const SCORE_COLD = 50;

    public function scoreLead(array $leadData, ?string $intentSlug = null): int
    {
        $score = 0;

        if ($intentSlug) {
            $score += $this->scoreIntentValue($intentSlug);
        }

        $score += $this->scoreEngagement($leadData);
        $score += $this->scoreBudget($leadData);
        $score += $this->scoreTimeline($leadData);

        return min(100, $score);
    }

    public function calculateScore(array $leadData): array
    {
        $serviceClarity = $this->scoreServiceClarity($leadData);
        $budgetClarity = $this->scoreBudgetClarity($leadData);
        $timelineClarity = $this->scoreTimelineClarity($leadData);
        $engagementLevel = $this->scoreEngagementLevel($leadData);
        $decisionAuthority = $this->scoreDecisionAuthority($leadData);

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
            'recommendations' => $this->getRecommendations($totalScore, $leadData),
        ];
    }

    protected function scoreIntentValue(string $intentSlug): int
    {
        $intent = ChatIntent::where('slug', $intentSlug)->with('service:id,name')->first();

        if (! $intent) {
            return 0;
        }

        if ($intent->is_high_value) {
            return 40;
        }

        $verticalScores = [
            'Construction' => 35,
            'Interiors' => 30,
            'Real Estate' => 25,
            'Event' => 20,
            'Land Development' => 20,
            'General' => 10,
        ];

        $serviceName = $intent->service?->name ?? 'General';
        $baseScore = $verticalScores[$serviceName] ?? 15;
        $conversionBoost = min(10, ((float) $intent->conversion_rate) / 2);

        return (int) ($baseScore + $conversionBoost);
    }

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

    public function determineLeadStatus(int $score): string
    {
        if ($score >= 70) {
            return 'hot';
        } elseif ($score >= 40) {
            return 'warm';
        }

        return 'cold';
    }

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

    public function scoreAndTagLead(Lead $lead, array $sessionData = []): Lead
    {
        $score = $this->scoreLead($sessionData, $lead->intent_slug);
        $status = $this->determineLeadStatus($score);
        $engagement = $this->determineEngagementLevel($sessionData);

        $lead->update([
            'conversion_score' => $score,
            'lead_status' => $status,
            'engagement_level' => $engagement,
        ]);

        return $lead;
    }

    private function scoreServiceClarity(array $data): int
    {
        $score = 0;

        if (! empty($data['service'])) {
            $score += 15;
        }

        if (! empty($data['mentioned_service'])) {
            $score += 5;
        }

        if (! empty($data['service_tier']) && in_array($data['service_tier'], ['budget', 'standard', 'premium', 'luxury', 'custom'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    private function scoreBudgetClarity(array $data): int
    {
        $score = 0;

        if (! empty($data['budget'])) {
            $score += 15;
        }

        if (! empty($data['budget_value']) && is_numeric($data['budget_value'])) {
            $score += 10;
        }

        if (! empty($data['budget_min']) && ! empty($data['budget_max'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    private function scoreTimelineClarity(array $data): int
    {
        $score = 0;

        if (! empty($data['timeline'])) {
            $score += 15;
        }

        if (! empty($data['timeline_months']) || ! empty($data['start_date'])) {
            $score += 10;
        }

        if (! empty($data['urgency']) && in_array($data['urgency'], ['low', 'medium', 'high', 'urgent'])) {
            $score += 5;
        }

        return min(25, $score);
    }

    private function scoreEngagementLevel(array $data): int
    {
        $score = 0;

        if (! empty($data['message_count'])) {
            $messageCount = $data['message_count'];

            if ($messageCount >= 5) {
                $score += 10;
            } elseif ($messageCount >= 3) {
                $score += 6;
            } else {
                $score += 2;
            }
        }

        if (! empty($data['enthusiasm_indicators'])) {
            $enthusiasmCount = is_array($data['enthusiasm_indicators']) ? count($data['enthusiasm_indicators']) : 0;
            $score += min(5, $enthusiasmCount * 2);
        }

        return min(15, $score);
    }

    private function scoreDecisionAuthority(array $data): int
    {
        $score = 0;

        if (! empty($data['contact_info']['name']) || ! empty($data['contact_info']['phone'])) {
            $score += 5;
        }

        if (! empty($data['is_decision_maker'])) {
            $score += 5;
        }

        if (! empty($data['contact_info']) && count($data['contact_info']) >= 2) {
            $score += 3;
        }

        return min(10, $score);
    }

    private function getGrade(int $score): string
    {
        if ($score >= self::SCORE_HOT) {
            return 'HOT';
        } elseif ($score >= self::SCORE_WARM) {
            return 'WARM';
        } elseif ($score >= self::SCORE_COLD) {
            return 'COLD';
        }

        return 'NOT_LEAD';
    }

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
        }

        return '<30% probability';
    }
}
